/* ~~/src/workers/interpreter.ts */

/* imports */
import { ripemd160 } from '@noble/hashes/legacy'
import { pbkdf2 } from '@noble/hashes/pbkdf2'
import { sha256, sha512 } from '@noble/hashes/sha2'
import { sha1 } from '@noble/hashes/sha1'
import { loadPyodide } from 'pyodide'

/* python setup modules */
import hashfib from '@/workers/sideload/hashfib.py?raw'
import opcodes from '@/workers/sideload/opcodes.py?raw'
import wrapped from '@/workers/sideload/wrapped.py?raw'

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
    const sideloader = [
      hashfib, // Shim PBKDF2 & RIPEMD160 implementation using @noble/hashes
      opcodes, // Bitcoin opcodes from buidl library
      wrapped, // Smart execution with auto-print functionality
    ].join('\n\n')
    const sideloaded = `${sideloader}\nwrapped("""${code}""")`
    console.log(sideloaded)
    await pyodide.runPythonAsync(sideloaded, {
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
