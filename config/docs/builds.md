# Building the application

## Building steps

### 1. Development Building

Where the TS code is transpiled and bundled via webpack. It generates entry points for the `main` and `renderer` processes, but they require `electron` to be executed.

This is the only step needed when developing and can be used via

```
npm run dev
```

This command starts a webpack build in development mode and the electron process concurrently so development is efficient.

Webpack will rebuild the output on file changes, and the electron process will be restarted automatically when the main bundle changes (via [electronmon](https://github.com/catdad/electronmon)).

### 2. App Bundling

This second step (could be the last depending on your application needs) takes the output from the 1st step and bundles the application code into standalone binaries without requiring electron.

Note that this is automatically done by default on the 3rd step, but can be invoked without creating the installers via

```
npm run package:bundle
```

Also note that this second step doesn't need the application to be built from the 1st step, because it will run webpack by itself. The build webpack called by the package script is aimed for production bundles, optimizing the produced code.

### 3. Installers

The last step (optional) takes the output from the 2nd step and creates installer executables that facilitates the distribution of the application.

```
npm run package
```

When testing creating the installers the bundling process (2nd step) can be skipped by directly calling the following instead

```
npm run package:installer
```

## App Configuration

Every value used to create the bundles and installers in these steps can be customized in the [app.config.ts](../../app.config.ts) file.

Refer to the [type definition](../../config/types.d.ts) to see the purpose of each field and their default values.

## Platform specifics

### Windows

#### Creating installers

The installer creation process depends on the [WiX Toolset v3](https://wixtoolset.org/docs/wix3/), which (in my opinion) provides a more integrated installation than electron-installer ([see details on the used electron-wix-msi package](https://github.com/electron-userland/electron-wix-msi)).

#### Error: cannot find candle.exe or light.exe

If you find the following error:

```
'light' is not recognized as an internal or external command,
operable program or batch file.
'candle' is not recognized as an internal or external command,
operable program or batch file.
It appears that electron-wix-msi cannot find candle.exe or light.exe.
Please consult the readme at https://github.com/felixrieseberg/electron-wix-msi
for information on how to install the Wix toolkit, which is required.

Error caught: Error: Could not find light.exe or candle.exe
```

It's because:

- WiX Toolset is not installed ([download](https://wixtoolset.org/docs/wix3/))
- WiX binaries (`C:\Program Files (x86)\WiX Toolset v3.14\bin`) are not included in the `PATH`

### MacOS

### Linux
