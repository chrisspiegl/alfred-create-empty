# alfred-create-empty

Alfred workflow to create empty files and folders from names on the clipboard.

Requires [Alfred 5](https://alfredapp.com) with the [Powerpack](https://alfredapp.com/powerpack/). Requires [Node.js](https://nodejs.org) 20+ (verified on 24).

## Install

```bash
npm install --global alfred-create-empty
```

## Usage

Copy a list of names to the clipboard, one name per line. Open Alfred's file browser on a file or a folder, then choose **Create Files with Names in Clipboard** or **Create Folders with Names in Clipboard**.

New items are created in the selected folder, or next to the selected file. Existing files are left unchanged. Folder names are created recursively. Names that are absolute paths or contain `..` are rejected. A missing clipboard list stops the workflow with an error.

## Maintainer

```bash
pnpm install
pnpm lint
pnpm test
pnpm release
```

## Release

From a clean main checkout, `pnpm release` prompts for the version, publishes to npm with pnpm, and creates the GitHub release. Requires npm login and a GitHub token (`GITHUB_TOKEN`) or `gh` auth.

## Related

* [More Alfred Workflows](https://github.com/chrisspiegl/alfred-workflows) - My Alfred Workflow Directory
* [alfy](https://github.com/sindresorhus/alfy) - Create Alfred workflows with ease
