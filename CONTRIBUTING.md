# Intallation steps:

### 1: Clone the repository

git clone https://github.com/4350-fall-2025/frontend-1

### 2: Install pnpm

pnpm requires Node.js, so if that is not installed maybe go ahead and install that first.

Using homebrew (if you use mac):

```bash
brew install pnpm
```

Using npm:

```bash
npm install -g pnpm@latest-10
```

### 3: Install dev dependecies

```bash
pnpm install
```

### 4: Setup Husky

Husky runs pre-commit hooks and post-commit hooks, and ensures your code meets the standards.

```bash
pnpm prepare
```

### 5: Install prettier

If you're using VSCode, please install the prettier extension.
Now go into your VSCode settings `Ctrl/Cmd + ,` , and under `Text Editor -> Formatting`, turn on format on save.
This will now run prettier on your file after saving.

You can also format the entire repo by running:

```bash
pnpm format
```
