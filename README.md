# thnbr

[![Bitcoin-only](https://img.shields.io/badge/bitcoin-only-FF9900?logo=bitcoin)](https://twentyone.world)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/aekasitt/thonburi/blob/master/LICENSE)
[![Top](https://img.shields.io/github/languages/top/aekasitt/thonburi)](https://github.com/aekasitt/thonburi)
[![Languages](https://img.shields.io/github/languages/count/aekasitt/thonburi)](https://github.com/aekasitt/thonburi)
[![Size](https://img.shields.io/github/repo-size/aekasitt/thonburi)](https://github.com/aekasitt/thonburi)
[![Last commit](https://img.shields.io/github/last-commit/aekasitt/thonburi/master)](https://github.com/aekasitt/thonburi)

[![Thonburi banner](https://github.com/aekasitt/thonburi/blob/master/static/thonburi-banner.svg)](static/thonburi-banner.svg)

## Prerequisites

* [node](https://nodejs.org) - Run JavaScript Everywhere
* [pnpm](https://pnpm.io) - Fast, disk space efficient package manager
* Web browser of choice (Chrome or Firefox)
  * [![Chrome Logo](static/chrome.svg) Chrome](https://www.google.com/chrome)
  * [![Firefox Logo](static/firefox.svg) Firefox](https://www.mozilla.org/en-US/firefox/new)

## Stack

* [Pyodide](https://pyodide.org/en/stable)
* [Tailwind CSS](https://tailwindcss.com)
* [Vite](https://vitejs.dev)
* [Vue 3](https://v3.vuejs.org)

## Contribute

<details>
  <summary> Project structure </summary>

  ```
  thonburi/
  ├── LICENSE                              # MIT License permission outline
  ├── README.md                            # Project setup and test setup walkthrough
  ├── index.html                           # Hypertext template where application is embedded
  ├── package.json                         # Project definitions and dependencies 
  ├── src/
  │   ├── assets/                          # Collection of stylesheets and vector assets
  │   │   └── ...                          # TODO: expand descriptions
  │   │
  │   ├── components/                      # Collection of Vue frontend components
  │   │   └── ...                          # TODO: expand descriptions
  │   │
  │   ├── stores/                          # Collection of Vue composable stores
  │   │   └── ...                          # TODO: expand descriptions
  │   │
  │   ├── views/                           # Collection of Vue frontend pages
  │   │   └── ...                          # TODO: expand descriptions
  │   │
  │   └── workers/                         # Collection of web workers
  │       └── mattvm.js                    # Pyodide parser with `pymatt` pre-installed
  │
  ├── static/                              # Static assets
  │   ├── coi-serviceworker.min.js         # Cross-origin isolation through a service worker
  │   ├── chrome.svg                       # Vector asset of Chrome web browser logo
  │   ├── favicon.ico                      # Small graphic image for the browser's address bar
  │   ├── firefox.svg                      # Vector asset of Firefox logo used by README.md
  │   ├── pymatt-0.0.1-py3-none-any.whl    # Wheel file for `pymatt` python package
  │   ├── pyodide.asm.js                   # The JS half of the main "binary"
  │   ├── pyodide.asm.wasm                 # The WebAssembly half of the main "binary"
  │   ├── pyodide.js                       # Legacy support for browsers unable to use es6 module
  │   ├── pyodide.mjs                      # Small JS loader shim which exports `loadPyodide`
  │   ├── pyodide-lock.json                # Lockfile for Python packages
  │   ├── python_stdlib.zip                # Python standard libraries for Pyodide
  │   ├── thonburi.svg                        # Project logo
  │   ├── thonburi-banner.svg                 # Project banner
  │   └── thonburi-social.svg                 # Project social link preview
  │
  ├── tailwind.config.js                   # Styling plugins and rules for TailwindCSS
  └── vite.config.js                       # Bundler configuration and static asset bypass
  ```

  Notable exemptions: `dotfiles`, `lockfile` and `component library generated files`
</details>

### Patches

The online interpreter has been patched with few moderations in order to ease development.

<details>
  <summary> Override hashlib.pbkdf2_hmac </summary>

  This normally is an operation where `hashlib` binds to `OpenSSL` in user's environment
  and not supported in `pyodide` environment, but interpreter overrides this with a pure
  python implementation at runtime to make possible some of `buidl` method calls.
  ```python
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
  ```
</details>
<details>
  <summary> Shim OP_CODES into global built-ins </summary>

  This gives access to developer to immediately use OP_CODES such as `OP_0`, `OP_ADD`,
  `OP_EQUAL`, and etc. without imports

  ```python
  # NOTE: shim opcodes from buidl.op.OP_CODE_NAMES
  from buidl.op import OP_CODE_NAMES
  OP_CODES: dict[str, int] = {value: key for key, value in OP_CODE_NAMES.items()}
  globals().update(OP_CODES)
  ```
</details>

### Samples

#### Locking and Spending a Taproot Script

```python
from binascii import unhexlify
from buidl.ecc import S256Point
from buidl.taproot import TapLeaf, TapBranch, TapScript


# buidl doesn't have constants/variables defined for op codes hence why
# we use use their integer values
script_a = TapScript([OP_1, OP_ADD, OP_2, OP_EQUAL])
script_b = TapScript([OP_2, OP_ADD, OP_4, OP_EQUAL])
script_c = TapScript([OP_1, OP_ADD, OP_5, OP_EQUAL])
leaf_a = TapLeaf(script_a)
leaf_b = TapLeaf(script_b)
leaf_c = TapLeaf(script_c)

# we need to construct a tree of branches ourselves
branch_bc = TapBranch(leaf_b, leaf_c)
branch_abc = TapBranch(leaf_a, branch_bc)

internal_pubkey = S256Point.parse_xonly(unhexlify("50929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0"))
addr = internal_pubkey.p2tr_address(branch_abc.hash(), network="regtest")
print("Send 0.01 BTC to the following address: {}".format(addr))
# prints: Send 0.01 BTC to the following address: bcrt1py7e8e0q7pdkxwyp2tjn65k4kd5kgch0aqe03jzjczn96xat6nwjswsu892
```

#### Hash Timelock Contract using RIPEMD-160 (Lightning)

```python
from binascii import unhexlify
from buidl.ecc import PrivateKey, S256Point
from buidl.script import Script
from buidl.helper import decode_base58, sha256, hash160

# secret and preimage
preimage_secret = b"super secret code"
preimage = sha256(preimage_secret)

# sender private keys from WIF
sender_wif = "cUZLbjpNRAAuu5sV8e8ocwMqAYDtdxY2EXCPyjvyeGATzCnCCaMK"
sender_decoded = decode_base58(sender_wif)
seckey_sender = PrivateKey(int.from_bytes(sender_decoded[1:], "big"))
pubkey_sender = seckey_sender.address(network="regtest", witness_type='p2wpkh').pub

# recipient private key from WIF
recipient_wif = "cVhjB76GwuZiva15i88Hwbgc1ZZB6KFMUAjAgiauD1mpugQDVGTc"
recipient_decoded = decode_base58(recipient_wif)
seckey_recipient = PrivateKey(int.from_bytes(recipient_decoded[1:], "big"))
pub_key reciepient = seckey_recipient.address(network="regtest", witness_type='p2wpkh').pub

# construct redeem script
redeem_script = Script([
  OP_IF,
    OP_SHA256,
    preimage,
    OP_EQUALVERIFY,
    OP_DUP,
    OP_HASH160,
    hash160(pubkey_recipient),
  OP_ELSE,
    10,
    OP_CHECKSEQUENCEVERIFY,
    OP_DROP,
    OP_DUP,
    OP_HASH160,
    hash160(pubkey_sender),
  OP_ENDIF,
  OP_EQUALVERIFY,
  OP_CHECKSIG,
])

# redeem script hash for P2WSH
redeem_script_hash = sha256(redeem_script.serialize())

# P2WSH scriptPubKey: OP_0 <redeem_script_hash>
script_pubkey = Script([OP_0, redeem_script_hash])
internal_pubkey = S256Point.parse_xonly(unhexlify("50929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0"))
address = internal_pubkey.p2tr_address(script_pubkey.serialize(), network="regtest")
```

### Acknowledgements

1. [วง - Wong](https://www.f0nt.com/release/sov-wong) typeface
  by [uvSOV - Worawut Thanawatanawanich](https://fb.com/worawut.thanawatanawanich)
2. [VitePress Python Editor](https://github.com/zqianem/vitepress-python-editor)
  by [@zqianem](https://github.com/zqianem)
3. [YT: Build in-browser 3D experiences with WebGL and PyScript](https://youtu.be/NQyzFbYZjHk)
  by [Łukasz Langa](https://lukasz.langa.pl)
  at [Pycon US](https://us.pycon.org) 2024

## License

This project is licensed under the terms of the MIT license.
