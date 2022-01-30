# nodejs-typescript-express-starter
NodeJs, TypeScript, Express and Sentry Starter Project

## Application Checklist

- [x] Node 14+
- [x] Express
- [x] Sentry
- [x] Node Config
- [x] NotEnv
- [x] Yarn
- [x] Docker
- [x] Docker-Compose
- [x] Eslint
- [x] Unit-Tests

## Before Run
#### Required installed tools:

- Docker
- Docker-Compose
- NPM
- Yarn

#### Create .env file
Copy and Paste .env-template to .env and edit the configurations
```
NODE_ENV=local | development | production
SENTRY_DSN=
```

## How To Build
Just run the command
```bash
make build
```

## How To Run
#### Docker-Compose
Just run the command
```bash
make run/docker-compose
```

#### Docker
```bash
make run/docker
```

#### Local
```bash
make run
```

#### Lint
Just run the command
```bash
make lint
```

#### Unit Tests
Just run the command
```bash
make test
```

#### Run de project inside VSCode
- 1: create .vscode folder in root project
- 2: add the file launch.json in the folder
```
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "ts-node - Launch & debug",
      "type": "node",
      "request": "launch",
      "runtimeArgs": ["-r", "ts-node/register"],
      "runtimeExecutable": "node",
      "args": ["--inspect", "${workspaceFolder}/src/index.ts"],
      "cwd": "${workspaceRoot}",
      "skipFiles": ["<node_internals>/**", "node_modules/**"],
      "envFile": "${workspaceFolder}/.env"
    }
  ]
}
```

## Endpoints
- GET http://localhost:3000/sucess
Returns 200

- GET http://localhost:3000/error
Returns 500 and if Sentry is active, sends errors to Sentry Console.

## Sentry
To learn more about Sentry, visit https://sentry.io
Create a free Sentry account and project
Add the `SENTRY_DSN` in .env file
```bash
SENTRY_DSN=YOUR-SENTRY-DSN
```

## Contributors
Just don't commit directly on master, push a branch and Pull Request.
