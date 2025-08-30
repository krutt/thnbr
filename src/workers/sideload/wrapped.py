#!/usr/bin/env python3
# Copyright (C) 2025 All rights reserved.
# FILENAME:    ~~/src/workers/sideload/wrapped.py
# VERSION:     0.0.1
# CREATED:     2025-08-30 13:44
# AUTHOR:      Sitt Guruvanich <aekazitt+github@gmail.com>
# DESCRIPTION:
#
# HISTORY:
# *************************************************************

from ast import AST, Module, Name, Store, parse, walk
from collections.abc import Iterator


def wrapped(code: str) -> None:
  """
  Execute user code with intelligent output handling.

  This function:
  1. Checks if the code contains print statements
  2. If not, tries to automatically print the last assignment
  3. Falls back to normal execution
  """
  module: Module = parse(code)
  try:
    next(filter(lambda node: isinstance(node, Name) and node.id == "print", walk(module)))
    exec(code)
  except StopIteration:
    reversed_walker: Iterator[AST] = reversed(tuple(walk(module)))
    try:
      name: Name = next(  # noqa: F841  # type: ignore[misc]
        filter(
          lambda node: isinstance(node, Name) and isinstance(node.ctx, Store),
          reversed_walker
        )
      )
      exec(f"{code}\nprint(eval(name.id))")
    except StopIteration:
      exec(code)
