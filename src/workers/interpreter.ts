/* ~~/src/workers/buidl.ts */

// imports
import { loadPyodide } from 'pyodide'
import { ripemd160 } from '@noble/hashes/legacy.js'

const pyodide = await loadPyodide({
  indexURL: import.meta.env.BASE_URL,
  stderr: () => console.error,
  stdout: () => console.log,
})
await pyodide.loadPackage('/thnbr/buidl-0.2.37-py3-none-any.whl', { checkIntegrity: true })

// @ts-ignore
self.ripemd160 = ripemd160

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
    write: buf => {
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


# NOTE: shim pbkdf2_hmac without openssl
#       https://pyodide.org/en/stable/usage/wasm-constraints.html#modules-with-limited-functionality
import hashlib
import hmac
def pbkdf2_hmac(hash_name, password, salt, iterations, dklen=None):
  hash_func = getattr(hashlib, hash_name)
  hlen = hash_func().digest_size
  if dklen is None:
    dklen = hlen
  blocks = -(-dklen // hlen)  # ceil division
  def F(block_index):
    U = hmac.new(password, salt + block_index.to_bytes(4, "big"), hash_func).digest()
    result = bytearray(U)
    for _ in range(iterations - 1):
      U = hmac.new(password, U, hash_func).digest()
      result = bytearray(x ^ y for x, y in zip(result, U))
    return result
  dk = b''.join(F(i + 1) for i in range(blocks))
  return dk[:dklen]
hashlib.pbkdf2_hmac = pbkdf2_hmac


# NOTE: shim hashlib new inside pyodide to include ripemd160 from wasm implementation
from js import Uint8Array, ripemd160
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
    await pyodide.runPythonAsync(wrappedCode, { filename: '<editor>', globals, locals: globals })
    globals.destroy()
    dict.destroy()
  } catch (error) {
    if (error instanceof Error && error.constructor.name === 'PythonError') {
      let lines = error.message.split('\n')
      let output = lines.slice(lines.findIndex(line => line.includes('File "<editor>"'))).join('\n')
      if (!output.endsWith('KeyboardInterrupt\n')) postMessage({ id, output })
    } else {
      throw error
    }
  } finally {
    postMessage({ id, done: true })
  }
}

postMessage({})
