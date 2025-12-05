# Installation steps:

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

### 3: Install dev dependencies

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

### 6: Setup back end repository

As our server is not currently hosted on the cloud in order to run the app locally you need to set up the [back end](https://github.com/4350-fall-2025/backend).

The instructions are located [here](https://github.com/4350-fall-2025/backend/blob/develop/README.md).

### 7: Define Firebase Storage related values in .env file

Define the following variables in a .env file located in the app's root folder.
These define if you are using an emulator or an a real database instance.

```bash
NEXT_PUBLIC_USE_EMULATOR=false
NEXT_PUBLIC_USE_STORAGE=true
```

### 8: (optional) Add Firebase related values in .env file

if you want to connect to a real database instance, add these values to the .env file with the following values:

```bash
NEXT_PUBLIC_GCP_API_KEY=
NEXT_PUBLIC_GCP_AUTH_DOMAIN=
NEXT_PUBLIC_GCP_PROJECT_ID=
NEXT_PUBLIC_GCP_BUCKET=
```

### 9: Run the Front End Server In Development Mode

```bash
pnpm dev
```
