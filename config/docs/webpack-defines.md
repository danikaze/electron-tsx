# Values defined by webpack

List of values defined by webpack via [DefinePlugin](https://webpack.js.org/plugins/define-plugin/).

| Name                          | Description                                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------------- |
| `process.env.NODE_ENV`        | `production` or `development`                                                                     |
| `process.env.PACKAGE_VERSION` | Version string defined in `package.json`                                                          |
| `process.env.BUILD_DATE`      | Build date                                                                                        |
| `ENTRY_POINT_PRELOAD`         | Path to the preload built file (to use with `new BrowserWindow({ webPreferences: { preload } })`) |
| `ENTRY_POINT_HTML`            | Path to the built html (from `/src/renderer/index.html`) (to use with `BrowserWindow.loadFile()`) |
| `APP_ICON_PNG_PATH`           | Path to the largest png icon provided (to use with `new BrowserWindow({icon})`)                   |
