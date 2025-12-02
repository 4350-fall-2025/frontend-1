# QDog Project Front End Repository

QDog is a virtual vet app that lets pet owners reach licensed veterinarians in minutes.
It keeps prescriptions, notes, and past visits in one place and allows you to track your pet’s health over time.

This is a student project for COMP 4350 (Software Engineering 2) at the University of Manitoba.
This is an educational prototype, not a substitute for in-person veterinary care. Please do not submit real medical information.
The project documentation live on our Confluence space (see Quick Links below)

## Development Environment Setup Instructions

See [CONTRIBUTING.md](./CONTRIBUTING.md) on instructions on how to set up your development tools and environment.

## Instructions on how to run locally:

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

### 4: Setup and Run Back End Server

As our server is not currently hosted on the cloud in order to run the app locally you need to set up the [back end](https://github.com/4350-fall-2025/backend).

The instructions are located [here](https://github.com/4350-fall-2025/backend/blob/develop/README.md).

Once done please run the back end server.

### 5: (optional) Add Firebase related values in .env file

if you want to connect to a real database instance, create a .env file with the following values:

```bash
NEXT_PUBLIC_GCP_API_KEY=
NEXT_PUBLIC_GCP_AUTH_DOMAIN=
NEXT_PUBLIC_GCP_PROJECT_ID=
NEXT_PUBLIC_GCP_BUCKET=
NEXT_PUBLIC_USE_EMULATOR=false
NEXT_PUBLIC_USE_STORAGE=true
```

### 5: Run the Front End Server

```bash
pnpm dev
```

## PNPM Commands

### Install the dependencies

**Note:** Your IDE might warn you to use the same version of pnpm that we use (see the `packageManager` value in `package.json`). You can safely ignore that warning if your version is higher than what we use. If you use a majorly lower one, you might notice some subtle bugs. For example, being 1 major version (version 9) behind ours (version 10.7) can be bad, but being a few minor versions (version 10.4) behind ours is fine. This is because old PNPM might not successfully read new PNPM lockfiles.

```bash
pnpm install
```

### Build the web app

```bash
pnpm build
```

### Run the web app locally

```bash
pnpm dev
```

### Run the tests

```bash
pnpm test
```

### Setup Husky

```bash
pnpm prepare
```

### Run the linter

**Note:** If you want to use linter on a specific folder, replace `.` with the folder name you want to lint.

```bash
pnpm oxlint .
```

## Running the app in a container

Pre-built images of the application can be found in our [repository packages](https://github.com/orgs/4350-fall-2025/packages?repo_name=frontend-1).

To run the latest version of the application simply run `docker compose up` in your terminal and it should pull the image locally and run it in a container.

**Important Notes**:

- Make sure that you have docker installed and running before running the compose file. For instructions on installing Docker and Docker Desktop, visit their [official documentation](https://docs.docker.com/desktop/)
- Make sure that you have your service account key in the root of the project.
