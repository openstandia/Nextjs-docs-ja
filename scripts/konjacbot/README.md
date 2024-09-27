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
- [Translation](./translate.mts)
  - Translates files detected as differing using the OpenAI API.
- [Image Downloading](./dlimg.mts)
  - Downloads images from the public site as they are not managed in the Next.js Git repository.
- [Creating Pull Requests](./pr.mts)
  - Creates a branch in this repository and submits a Pull Request with the translated content.

# How to Run
## Github Actions
- Generally run on GitHub Actions where a reviewer reviews the Pull Request.
- For details, see the [workflow](../../.github/workflows/konjacbot.yml).

## Developer's Local
- Prerequisites
  - The following must be installed:
    - npm - See [package.json](../../package.json) for version.
    - git
    - bash - WSL on Windows is also possible
    - GitHub CLI
  - You must have acquired the OpenAI API key.
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
-o : File path to output the execution result
-a : Flag to detect all document files as differences instead of `git diff` results
```

Example:
```
npx tsx run ./scripts/konjackbot/diff.mts -o ./my-diff.txt
```

### Execution (using npm script)
```bash
npm run kj:diff
```
This is an alias for:
```
npx tsx ./scripts/konjacbot/diff.mts -o .kj-diff.txt
```

### Description
- Update the submodule with `git submodule update --remote`
- Obtain submodule differences with `git diff -name-status` and output the results

## [Translation](./translate.mts)
### Execution (using tsx)
```bash
npx tsx run ./scripts/konjacbot/translate.mts [options] <path to diff file>
```

Options:
```
-l : Language to translate into (default: ja)
```

Example:
```
npx tsx run ./scripts/konjackbot/translate.mts ./my-diff.txt
```

### Execution (using npm script)
```bash
npm run kj:ja
```
This is an alias for:
```
npx tsx ./scripts/konjacbot/translate.mts .kj-diff.txt
```

### Description
- Acquire the [prompt](./pr.mts) for the language specified by `-l`
- Read the md(x) files listed in the specified diff file and translate using the OpenAI API
- Output the translation results to a file

## [Image Downloading](./dlimg.mts)
### Execution (using tsx)
```bash
npx tsx run ./scripts/konjacbot/dlimg.mts <path to diff file>
```

Example:
```
npx tsx run ./scripts/konjackbot/dlimg.mts ./my-diff.txt
```

### Execution (using npm script)
```bash
npm run kj:img
```
This is an alias for:
```
npx tsx ./scripts/konjacbot/dlimg.mts .kj-diff.txt
```

### Description
- Read the md(x) files listed in the specified diff file and obtain the paths to the image files used within
- Download images from the public site
- Save the downloaded files

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
```
npx tsx ./scripts/konjacbot/pr.mts
```

### Description
- Create a branch, commit, and push
- Create a PR (Pull Request)