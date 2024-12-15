# Setup Guide

## Instructions On Setting Up Locally
1. Fork this repository.
2. Clone the forked repo to your local machine.
3. Navigate to the project directory.
4. Ensure you have a .env file in the root of the project directory that has exported variables JWT_SECRET_KEY and OPENAI_API_KEY. If not, use a tool like `openssl` to generate a jwt secret key and obtain an openai api key. See example below.
```
JWT_SECRET="INSERT_JWT_SECRET_KEY"
export OPENAI_API_KEY="INSERT_OPENAI_API_KEY"
```
5. Check your version of node and yarn by doing `node -v` and `yarn -v`. Ensure they are `20.x` and `4.4.0` respectively.
    1. If they are not, you will need to swap versions. For node, download `v20.18.0` from [here](https://nodejs.org/en/download/package-manager) using an installation method of your choice. You can also use a tool such as `nvm` or `nvm-windows` to manage node versions.
    2. For yarn, follow [this guide](https://docs.redwoodjs.com/docs/how-to/using-yarn/) to install the correct version. Note that running `corepack` requires elevated permissions.
6. Do `yarn install` at the root of the project directory. If prompted for downloading `v4.4.0`, say yes.
7. Do `yarn rw dev` to fire it up!
8. To migrate or synchronize the database, do `yarn rw prisma migrate dev`.


## Installing Yarn
-`npm install global yarn` installs yarn

-`corepack enable` -switches your yarn version to match the project


## Installing Dependencies

- `yarn install` is used for installing dependencies in the project directory.
- Follow the README instructions to set up yarn and node properly.

## Firing Up the App

- Use `yarn redwood dev` or `yarn rw dev` to launch the app on localhost.
- The database may not be synchronized. Use `yarn rw prisma migrate dev` to synchronize it.
- Check USAGE.md for instructions on using the app.

## Testing and Documentation

- View GraphQL API documentation in the docs folder. Open any of the HTML source files on your browser to see the documentation.
- Run `yarn rw test` to run unit tests. NOTE: At this point, >80% of unit tests are correct.
- Run `yarn playwright test` to do e2e testing.
