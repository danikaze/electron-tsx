# ES module support

While there's no really need to use ESM imports in an Electron project built with webpack in 99% of the cases, there are packages providing only ESM version of their libraries which would require some tricks when ESM is not supported.

The configuration applied here supports ESM from scratch, and it's tested by importing [nanoid](https://github.com/ai/nanoid)`^5` (only available via ESM).

TS config is used with the new `bundled` module resolution, which allows more laxed checks providing the usualy syntax where there's no need to specify file extension on the imported path, and the `index.ts` and similar are also resolved when imported from a folder.

On the downsides, `ts-node` [doesn't really like ESM 100%](https://github.com/TypeStrong/ts-node/issues/2100) and most of the scripts provided in `package.json` need to run via [tsx](https://tsx.is/), which doesn't do type checking (that's why ーamong other reasonsー there are linting on pre-commit and testing on pre-push).
