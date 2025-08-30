#!/usr/bin/env python3
# Copyright (C) 2025 All rights reserved.
# FILENAME:    ~~/src/workers/sideload/wasmify.py
# VERSION:     0.0.1
# CREATED:     2025-08-30 13:44
# AUTHOR:      Sitt Guruvanich <aekazitt+github@gmail.com>
# DESCRIPTION:
#
# HISTORY:
# *************************************************************

# NOTE: shim hashlib new inside pyodide to include ripemd160 from wasm implementation
import hashlib
from array import array
from js import Uint8Array, pbkdf2, ripemd160, sha1, sha256, sha512  # type: ignore
from hashlib import new as hashlib_new
from mmap import mmap
from typing import Callable, Literal, Mapping, TypeAlias


NOBLE_HASHES: Mapping[Literal["sha1", "sha256", "sha512"], Callable[..., str]] = {
  "sha1": sha1,
  "sha256": sha256,
  "sha512": sha512,
}
ReadableBuffer: TypeAlias = bytes | bytearray | memoryview | array | mmap


# NOTE: shim pbkdf2_hmac using secure @noble/hashes implementation
#       https://pyodide.org/en/stable/usage/wasm-constraints.html#modules-with-limited-functionality
def pbkdf2_hmac(
  hash_name: Literal["sha1", "sha256", "sha512"],
  password: ReadableBuffer,
  salt: ReadableBuffer,
  iterations: int,
  dklen: None | int = None,
) -> bytes:
  """
  Secure PBKDF2-HMAC implementation using @noble/hashes.
  This replaces the manual implementation with a cryptographically audited one.
  """
  if hash_name not in {"sha1", "sha256", "sha512"}:
    raise ValueError(f"Unsupported hash function: {hash_name}")
  hash_func: Callable[..., str] = NOBLE_HASHES[hash_name]
  password_array: Uint8Array = Uint8Array.new(list(password))
  salt_array: Uint8Array = Uint8Array.new(list(salt))
  options: dict[str, int] = {"c": iterations}
  if dklen is not None:
    options["dkLen"] = dklen
  result: str = pbkdf2(hash_func, password_array, salt_array, options)
  return bytes(result)


class JSRipemd160:
  def __init__(self, data=b""):
    self._data = data if isinstance(data, bytes) else data.encode("utf-8")

  def update(self, data):
    if isinstance(data, str):
      data = data.encode("utf-8")
    self._data += data

  def digest(self):
    uint8_data = Uint8Array.new(list(self._data))
    result = ripemd160(uint8_data)
    return bytes(result)

  def hexdigest(self):
    return self.digest().hex()


def new(name: str, data: bytes = b""):
  if name == "ripemd160":
    h = JSRipemd160()
    if data:
      h.update(data)
    return h
  else:
    return hashlib_new(name, data)


hashlib.new = new
hashlib.pbkdf2_hmac = pbkdf2_hmac
