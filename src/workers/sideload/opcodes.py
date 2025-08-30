#!/usr/bin/env python3
# Copyright (C) 2025 All rights reserved.
# FILENAME:    ~~/src/workers/sideload/opcodes.py
# VERSION:     0.0.1
# CREATED:     2025-08-30 13:44
# AUTHOR:      Sitt Guruvanich <aekazitt+github@gmail.com>
# DESCRIPTION:
#
# HISTORY:
# *************************************************************
"""
Shim opcodes from buidl.op.OP_CODE_NAMES into global builtins
"""

from buidl.op import OP_CODE_NAMES

OP_CODES: dict[str, int] = {value: key for key, value in OP_CODE_NAMES.items()}
globals().update(OP_CODES)
