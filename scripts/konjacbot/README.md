# Konjacbot

A bot that performs translations using AI.

"Translation" is "Honyaku" in Japanese
-> "Honyaku Konnyaku" (©DORAEMON)
-> Konnyaku is "Konjac" in English
-> Konjacbot

# Purpose

To update translations of the [Next.js documentation](https://nextjs.org/docs) in near real-time and effortlessly.

# Overview

- [Detecting Differences](./diff.mts)
  - Retrieves differences from the [Next.js repository](../../next.js) incorporated via git submodule.
- [Copy Files](./cp.mts)
  - Copies or deletes files with detected differences from the Next.js repository.
- [Translation](./translate.mts)
  - Translates files identified as differing using the OpenAI API.
- [Document Modifications](./mod.mts)
  - Modifies the MDX format for proper display in [Docusaurus](https://docusaurus.io/).
- [Image Downloading](./dlimg.mts)
  - Downloads images from the [public site](https://nextjs.org/docs), as they are not managed in the Next.js Git repository.
- [Creating Pull Requests](./pr.mts)
  - Creates a branch in this repository and submits a Pull Request with the translated content.

# How to Run

## GitHub Actions

- Generally run on GitHub Actions, where a reviewer reviews the Pull Request.
- For details, see the [workflow](../../.github/workflows/konjacbot.yml).

## Developer's Local

- Prerequisites:
  - The following must be installed:
    - npm - See [package.json](../../package.json) for the version.
    - git
    - bash - WSL on Windows is also an option.
    - GitHub CLI.
  - You must have an OpenAI API key.
    - Set it as the environment variable `OPENAI_API_KEY`.
- Refer to [Details](#Details) for commands.

# Details

## [Detecting Differences](./diff.mts)

### Execution (using tsx)

```bash
npx tsx run ./scripts/konjacbot/diff.mts [options]
```

Options:

```
-o : File path to output the execution result.
-a : Flag to detect all document files as differences instead of `git diff` results.
```

Example:

```bash
npx tsx run ./scripts/konjacbot/diff.mts -o ./my-diff.txt
```

### Execution (using npm script)

```bash
npm run kj:diff
```

This is an alias for:

```bash
npx tsx ./scripts/konjacbot/diff.mts -o .kj-diff.txt
```

### Output File Format

The output format is identical to the result of `git diff --name-status`.

Example:

```txt
A  docs/02-app/01-building-your-application/01-routing/03-layouts-and-templates.mdx
A  docs/02-app/01-building-your-application/01-routing/04-linking-and-navigating.mdx
```

### Description

- Update the submodule with `git submodule update --remote`.
- Obtain submodule differences with `git diff --name-status` and output the results.

## [Copy Files](./cp.mts)

### Execution (using tsx)

```bash
npx tsx run ./scripts/konjacbot/cp.mts <path to diff file>
```

Example:

```bash
npx tsx run ./scripts/konjacbot/cp.mts ./my-diff.txt
```

### Execution (using npm script)

```bash
npm run kj:cp
```

This is an alias for:

```bash
npx tsx ./scripts/konjacbot/cp.mts .kj-diff.txt
```

### Description

- Copies files that have been changed or added from the Next.js repository using the submodule.
- Deletes files from the repository if the differences indicate removal.

## [Translation](./translate.mts)

### Execution (using tsx)

```bash
npx tsx run ./scripts/konjacbot/translate.mts [options] <path to diff file>
```

Options:

```
-l : Language to translate into (default: ja).
```

Example:

```bash
npx tsx run ./scripts/konjacbot/translate.mts ./my-diff.txt
```

### Execution (using npm script)

```bash
npm run kj:ja
```

This is an alias for:

```bash
npx tsx ./scripts/konjacbot/translate.mts .kj-diff.txt
```

### Description

- Acquires the [prompt](./prompt) for the specified language using `-l`.
- Reads the md(x) files listed in the specified diff file and translates them using the OpenAI API.
- Outputs the translation results to a file.

## [Document Modifications](./mod.mts)

### Execution (using tsx)

```bash
npx tsx run ./scripts/konjacbot/mod.mts <path to diff file>
```

### Execution (using npm script)

```bash
npm run kj:mod
```

This is an alias for:

```bash
npx tsx ./scripts/konjacbot/mod.mts .kj-diff.txt
```

### Description

- Modifies code blocks within MDX files to ensure they are displayed correctly.
- Modify links to untranslated documents to point to the official site.
- To prevent anchor links from breaking after translation, IDs will be added to the headings.

## [Image Downloading](./dlimg.mts)

### Execution (using tsx)

```bash
npx tsx run ./scripts/konjacbot/dlimg.mts <path to diff file>
```

Example:

```bash
npx tsx run ./scripts/konjacbot/dlimg.mts ./my-diff.txt
```

### Execution (using npm script)

```bash
npm run kj:img
```

This is an alias for:

```bash
npx tsx ./scripts/konjacbot/dlimg.mts .kj-diff.txt
```

### Description

- Reads the md(x) files listed in the specified diff file to obtain the paths to the images used.
- Downloads images from the [public site](https://nextjs.org/docs).
- Saves the downloaded files.

## [Creating Pull Requests](./pr.mts)

### Execution (using tsx)

```bash
npx tsx run ./scripts/konjacbot/pr.mts
```

### Execution (using npm script)

```bash
npm run kj:pr
```

This is an alias for:

```bash
npx tsx ./scripts/konjacbot/pr.mts
```

### Description

- Creates a branch, commits, and pushes changes.
- Creates a Pull Request (PR).
