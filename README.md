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
