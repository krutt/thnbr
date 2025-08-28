/* ~~/src/workers/interpreter.ts */

/* imports */
import { ripemd160 } from '@noble/hashes/legacy'
import { pbkdf2 } from '@noble/hashes/pbkdf2'
import { sha256, sha512 } from '@noble/hashes/sha2'
import { sha1 } from '@noble/hashes/sha1'
import { loadPyodide } from 'pyodide'

const pyodide = await loadPyodide({
  indexURL: import.meta.env.BASE_URL,
  stderr: () => console.error,
  stdout: () => console.log,
})
await pyodide.loadPackage('/thnbr/buidl-0.2.37-py3-none-any.whl', {
  checkIntegrity: true,
})

/**
 * Expose cryptographic functions to pyodide environment
 */
// @ts-expect-error
self.ripemd160 = ripemd160
// @ts-expect-error
self.pbkdf2 = pbkdf2
// @ts-expect-error
self.sha1 = sha1
// @ts-expect-error
self.sha256 = sha256
// @ts-expect-error
self.sha512 = sha512

const decoder: TextDecoder = new TextDecoder()
let inputData = null
let waitFlag = null

onmessage = async (event: MessageEvent) => {
  if (event.data.inputBuffer && event.data.waitBuffer && event.data.interruptBuffer) {
    inputData = new Uint8Array(event.data.inputBuffer)
    waitFlag = new Int32Array(event.data.waitBuffer)
    pyodide.setInterruptBuffer(event.data.interruptBuffer)
    return
  }
  const { id, code } = event.data
  pyodide.setStdout({
    write: (buf) => {
      postMessage({ id, output: decoder.decode(buf) })
      return buf.length
    },
  })
  pyodide.setStdin({
    stdin: () => {
      postMessage({ id, input: true })
      Atomics.wait(waitFlag, 0, 0)
      const inputArray = new Uint8Array(Number(Atomics.load(inputData, 0)))
      for (let i = 0; i < inputArray.length; i++)
        inputArray[i] = Number(Atomics.load(inputData, i + 1))
      const inputText = decoder.decode(inputArray)
      postMessage({ id, output: `${inputText}\n` })
      return inputText
    },
  })
  try {
    // https://github.com/pyodide/pyodide/issues/703#issuecomment-1937774811
    const dict = pyodide.globals.get('dict')
    const globals = dict()
    const wrappedCode = `
from ast import AST, Module, Name, Store, parse, walk
from collections.abc import Iterator


# NOTE: shim pbkdf2_hmac using secure @noble/hashes implementation
#       https://pyodide.org/en/stable/usage/wasm-constraints.html#modules-with-limited-functionality
import hashlib
from array import array
from js import Uint8Array, pbkdf2, sha1, sha256, sha512
from mmap import mmap
from typing import Callable, Literal, Mapping, TypeAlias


NOBLE_HASHES: Mapping[Literal["sha1", "sha256", "sha512"], Callable[..., str]]= {
  "sha1": sha1,
  "sha256": sha256,
  "sha512": sha512,
}
ReadableBuffer: TypeAlias = bytes | bytearray | memoryview | array | mmap


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
hashlib.pbkdf2_hmac = lambda hash_name, password, salt, iterations, dklen: None


# NOTE: shim hashlib new inside pyodide to include ripemd160 from wasm implementation
from js import ripemd160
class JSRipemd160:
  def __init__(self, data=b''):
    self._data = data if isinstance(data, bytes) else data.encode('utf-8')
  
  def update(self, data):
    if isinstance(data, str):
      data = data.encode('utf-8')
    self._data += data
  
  def digest(self):
    uint8_data = Uint8Array.new(list(self._data))
    result = ripemd160(uint8_data)
    return bytes(result)
  
  def hexdigest(self):
    return self.digest().hex()

from hashlib import new as hashlib_new
def new(name: str, data: bytes = b""):
  if name == "ripemd160":
    h = JSRipemd160()
    if data:
      h.update(data)
    return h
  else:
    return hashlib_new(name, data)
hashlib.new = new


# NOTE: shim opcodes from buidl.op.OP_CODE_NAMES
from buidl.op import OP_CODE_NAMES
OP_CODES: dict[str, int] = {value: key for key, value in OP_CODE_NAMES.items()}
globals().update(OP_CODES)


module: Module = parse("""${code}""")
try:
  next(filter(lambda node: isinstance(node, Name) and node.id == 'print', walk(module)))
  exec("""${code}""")
except StopIteration:
  reversed_walker: Iterator[AST] = reversed(tuple(walk(module)))
  try:
    name: Name = next(
      filter(
        lambda node: isinstance(node, Name) and isinstance(node.ctx, Store),
        reversed_walker
      )
    )
    exec("""${code}\nprint(eval(name.id))""")
  except StopIteration:
    exec("""${code}""")
`
    await pyodide.runPythonAsync(wrappedCode, {
      filename: '<editor>',
      globals,
      locals: globals,
    })
    globals.destroy()
    dict.destroy()
  } catch (error) {
    if (error instanceof Error && error.constructor.name === 'PythonError') {
      const lines = error.message.split('\n')
      const output = lines
        .slice(lines.findIndex((line) => line.includes('File "<editor>"')))
        .join('\n')
      if (!output.endsWith('KeyboardInterrupt\n')) postMessage({ id, output })
    } else {
      throw error
    }
  } finally {
    postMessage({ id, done: true })
  }
}

postMessage({})
