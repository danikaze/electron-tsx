# Unit Testing

Unit testing works with [Jest](https://jestjs.io/).

The plugin `@alex_neo/jest-expect-message` is pre-configured, so `expect` functions accept an optional 2nd argument with a message for more readability and maintainability (to work like other testing frameworks).

```
npm run test
```

For developing the tests and debugging the code:

```
npm run dev:test
```

Lamentably, executing the tests in watch mode from VS Code doesn't work... but the command can be run and then execute the `Attach (to test:dev)` _Run and Debug_ configuration.

Tests are written in `.test.ts` or `.spec.ts` files, and by convention enclosed in folders called `__test` where their tested functions are placed (anywhere in the repo).
