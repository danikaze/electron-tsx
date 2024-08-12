# App icons

When building the application, the packager will look automatically for the following files, depending on the OS:

| OS    | Path                         | Size                               |
| ----- | ---------------------------- | ---------------------------------- |
| Win   | /config/icons/icon-256.ico   | 256x256                            |
| Mac   | /config/icons/icon-512.icns  | 512x512                            |
| Mac   | /config/icons/icon-1024.icns | 1024x1024 (for 2x Retina displays) |
| Linux | /config/icons/icon-512.png   | 512x512                            |

If [app.config.ts](../../app.config.ts) defines the field `iconPath`, it will be used instead.

Note that the path doesn't need to specify the size nor the extension (consider its default value to be `config/icons/icon`).

Then, it will append `-256.ico` for Windows, `-512.png` for Linux, etc.

## Recommended sizes and formats by OS

| OS    | Format | Size                                        |
| ----- | ------ | ------------------------------------------- |
| Win   | .ico   | 256x256                                     |
| Mac   | .icns  | 512x512 (1024x1024 @2x for Retina displays) |
| Linux | .png   | 512x512                                     |

> Source: [Electron Forge](https://www.electronforge.io/guides/create-and-add-icons)

## Refreshing the icon cache (Windows)

Windows caches all application icons in a hidden Icon Cache Database. If your Electron app's icon is not showing up, you may need to rebuild this cache. To invalidate the cache, use the system ie4uinit.exe utility:

```
ie4uinit.exe -show
```

## Configuring the icon in Linux

The icon must be additionally loaded when instantiating your `BrowserWindow`.

The path is provided by the `APP_ICON_PNG_PATH` value [defined in webpack](./webpack-defines.md).

```ts
const { BrowserWindow } = require('electron')

const win = new BrowserWindow({
  // the value comes automagically from webpack
  icon: APP_ICON_PNG_PATH
})
```

Note that this icon needs to be accessible in the main/renderer
