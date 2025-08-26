# thnbr

[![Bitcoin-only](https://img.shields.io/badge/bitcoin-only-FF9900?logo=bitcoin)](https://twentyone.world)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/krutt/thnbr/blob/master/LICENSE)
[![Top](https://img.shields.io/github/languages/top/krutt/thnbr)](https://github.com/krutt/thnbr)
[![Languages](https://img.shields.io/github/languages/count/krutt/thnbr)](https://github.com/krutt/thnbr)
[![Size](https://img.shields.io/github/repo-size/krutt/thnbr)](https://github.com/krutt/thnbr)
[![Last commit](https://img.shields.io/github/last-commit/krutt/thnbr/master)](https://github.com/krutt/thnbr)

[![Thonburi banner](https://github.com/krutt/thnbr/blob/master/static/thnbr-banner.svg)](static/thnbr-banner.svg)

## Stack

* [Pyodide](https://pyodide.org/en/stable)
* [Tailwind CSS](https://tailwindcss.com)
* [shadcn/vue](https://shadcn-vue.com)
* [Vite](https://vitejs.dev)
* [Vue 3](https://v3.vuejs.org)

<details>
  <summary> Project structure </summary>

  ```
  thnbr/
  ├── LICENSE                              # MIT License permission outline
  ├── README.md                            # Project setup and test setup walkthrough
  ├── index.html                           # Hypertext template where application is embedded
  ├── package.json                         # Project definitions and dependencies 
  ├── src/
  │   ├── App.vue                          # Vue single-page application base view
  │   ├── assets/                          # Collection of stylesheets and vector assets
  │   │   └── ...                          # TODO: expand descriptions
  │   │
  │   ├── components/                      # Collection of Vue frontend components
  │   │   └── ...                          # TODO: expand descriptions
  │   │
  │   ├── main.ts                          # Vue single-page application entrypoint
  │   ├── stores/                          # Collection of Vue composable stores
  │   │   └── ...                          # TODO: expand descriptions
  │   │
  │   ├── style.css                        # Vue single-page application cascade styling sheet
  │   ├── views/                           # Collection of Vue frontend pages
  │   │   └── ...                          # TODO: expand descriptions
  │   │
  │   └── workers/                         # Collection of web workers
  │       └── interpreter.ts               # Pyodide interpreter with required shims
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
  │   ├── thnbr.svg                        # Project logo
  │   ├── thnbr-banner.svg                 # Project banner
  │   └── thnbr-social.svg                 # Project social link preview
  │
  ├── tailwind.config.js                   # Styling plugins and rules for TailwindCSS
  └── vite.config.ts                       # Bundler configuration and static asset bypass
  ```

  Notable exemptions: `dotfiles`, `lockfile` and `component library generated files`
</details>

## Contributions

### Prerequisites

* [node](https://nodejs.org) - Run JavaScript Everywhere
* [pnpm](https://pnpm.io) - Fast, disk space efficient package manager
* Web browser of choice (Chrome or Firefox)
  * [![Chrome Logo](static/chrome.svg) Chrome](https://www.google.com/chrome)
  * [![Firefox Logo](static/firefox.svg) Firefox](https://www.mozilla.org/en-US/firefox/new)

### Getting started

Install the project dependencies with the following command:

```sh
pnpm install
```

<details>
  <summary> Sample output of successful dependency installation </summary>

  ```sh
  $ pnpm install
  > Lockfile is up to date, resolution step is skipped
  > Packages: +263
  > ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  > Downloading @biomejs/cli-darwin-x64@2.2.2: 14.67 MB/14.67 MB, done
  > Progress: resolved 263, reused 260, downloaded 3, added 263, done
  >
  > dependencies:
  > + @codemirror/commands 6.8.1
  > + @codemirror/lang-python 6.2.1
  > + @codemirror/language 6.11.1
  > + @codemirror/state 6.5.2
  > + @codemirror/view 6.37.2
  > + @lezer/common 1.2.3
  > + @lezer/highlight 1.2.1
  > + @noble/hashes 1.8.0
  > + @tanstack/vue-table 8.21.3
  > + class-variance-authority 0.7.1
  > + clsx 2.1.1
  > + jdenticon 3.3.0
  > + lucide-vue-next 0.541.0
  > + pinia 2.3.1
  > + pyodide 0.27.7
  > + reka-ui 2.4.1
  > + tailwind-merge 3.3.1
  > + tailwindcss-animate 1.0.7
  > + vue 3.5.17
  > + vue-router 4.5.1
  > + vue-sonner 2.0.0
  >
  > devDependencies:
  > + @biomejs/biome 2.2.2
  > + @tailwindcss/typography 0.5.16
  > + @vitejs/plugin-vue 4.6.2
  > + @vueuse/core 11.3.0
  > + autoprefixer 10.4.21
  > + tailwindcss 3.4.17
  > + typescript 5.8.3
  > + unplugin-auto-import 0.18.6
  > + vite 5.4.19
  > + vite-plugin-top-level-await 1.5.0
  > + vite-svg-loader 5.1.0
  > + vue-tsc 2.2.10
  >
  > Done in 11s
  ```
</details>

Before the current repository can be built with `pnpm run build` command, you must first
download the required [shadcn/vue](https://shadcn-vue.com) components first. We currently
use two of the many components listed under shadcn/vue components which are:

* [Button](https://www.shadcn-vue.com/docs/components/button.html)
* [DropdownMenu](https://www.shadcn-vue.com/docs/components/dropdown-menu.html)

Using the following commands:

```sh
pnpm dlx shadcn-vue@latest add button
```

and

```sh
pnpm dlx shadcn-vue@latest add dropdown-menu
```

<details>
  <summary> Sample outputs of running the component download commands successfully </summary>

  ```sh
  $ pnpm dlx shadcn-vue@latest add button
  > ✔ Checking registry.
  > ✔ Installing dependencies.
  > ✔ Created 2 files:
  >   - src/components/ui/button/Button.vue                                                                                                 6:43:58 PM
  >   - src/components/ui/button/index.ts
  $ pnpm dlx shadcn-vue@latest add dropdown-menu
  > ✔ Checking registry.
  > ✔ Installing dependencies.
  > ✔ Created 15 files:
  >   - src/components/ui/dropdown-menu/DropdownMenu.vue                                                                                    6:45:07 PM
  >   - src/components/ui/dropdown-menu/DropdownMenuCheckboxItem.vue                                                                        6:45:08 PM
  >   - src/components/ui/dropdown-menu/DropdownMenuContent.vue                                                                             6:45:08 PM
  >   - src/components/ui/dropdown-menu/DropdownMenuGroup.vue                                                                               6:45:08 PM
  >   - src/components/ui/dropdown-menu/DropdownMenuItem.vue                                                                                6:45:08 PM
  >   - src/components/ui/dropdown-menu/DropdownMenuLabel.vue                                                                               6:45:08 PM
  >   - src/components/ui/dropdown-menu/DropdownMenuRadioGroup.vue                                                                          6:45:08 PM
  >   - src/components/ui/dropdown-menu/DropdownMenuRadioItem.vue                                                                           6:45:08 PM
  >   - src/components/ui/dropdown-menu/DropdownMenuSeparator.vue                                                                           6:45:08 PM
  >   - src/components/ui/dropdown-menu/DropdownMenuShortcut.vue                                                                            6:45:08 PM
  >   - src/components/ui/dropdown-menu/DropdownMenuSub.vue                                                                                 6:45:08 PM
  >   - src/components/ui/dropdown-menu/DropdownMenuSubContent.vue                                                                          6:45:08 PM
  >   - src/components/ui/dropdown-menu/DropdownMenuSubTrigger.vue                                                                          6:45:08 PM
  >   - src/components/ui/dropdown-menu/DropdownMenuTrigger.vue                                                                             6:45:08 PM
  >   - src/components/ui/dropdown-menu/index.ts
  ```
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

# create private keys from WIF
sender_wif = "cUZLbjpNRAAuu5sV8e8ocwMqAYDtdxY2EXCPyjvyeGATzCnCCaMK"
sender_decoded = decode_base58(sender_wif)
seckey_sender = PrivateKey(int.from_bytes(sender_decoded[1:], "big"))
pubkey_sender = seckey_sender.point.sec()
recipient_wif = "cVhjB76GwuZiva15i88Hwbgc1ZZB6KFMUAjAgiauD1mpugQDVGTc"
recipient_decoded = decode_base58(recipient_wif)
seckey_recipient = PrivateKey(int.from_bytes(recipient_decoded[1:], "big"))
pubkey_recipient = seckey_recipient.point.sec()

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
address = internal_pubkey.p2tr_address(script_pubkey.serialize(), network="regtest")``
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
