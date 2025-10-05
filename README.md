# QDog Project Front End Repository

QDog is a virtual vet app that lets pet owners reach licensed veterinarians in minutes. 
It keeps prescriptions, notes, and past visits in one place and allows you to track your pet’s health over time.

This is a student project for COMP 4350 (Software Engineering 2) at the University of Manitoba.
This is an educational prototype, not a substitute for in-person veterinary care. Please do not submit real medical information. 
The project documentation live on our Confluence space (see Quick Links below)


## Repo Links

Due to the projects' requirement to have a second front end implemented during our final iteration, we decided that it would be best to split this project into two repositories: the front end and the back end. When it is needed we will create a third repository that contains the second implementation of our front end. 

- [The front end repository](https://github.com/4350-fall-2025/frontend-1)
- [The back end repository](https://github.com/4350-fall-2025/backend)


## Team Members

- Ara Santos
- Basma Abdul Razaq
- Jordon Hong
- Minh Phan
- Nataniella Ogogo
- Victoria Iskandar


## Sprint 0

All Sprint 0 deliverables are available on our private Confluence space. Click on the hyperlinks to see them.

- [Sprint 0 Project Proposal & Worksheet](https://jordonhong.atlassian.net/wiki/spaces/qdog/pages/10158159/Sprint+0+Hub?atlOrigin=eyJpIjoiZDhjNWYzYjJjZDQzNDhhN2I4MmFjOGZiZGE3MzUwN2EiLCJwIjoiYyJ9)
- [Link to slides](https://www.figma.com/deck/SVXDUyXp4JtoTR8rG2OxHg/QDog-Product-Pitch?node-id=1-37&t=Mlbl4aSf43FQBJ4J-1)

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

### Start the web app locally

```bash
pnpm start
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