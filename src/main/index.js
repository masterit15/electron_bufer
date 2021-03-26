import { app, ipcMain, BrowserWindow, powerMonitor } from 'electron'

// import { Titlebar, Color } from 'custom-electron-titlebar'

// new Titlebar({
// 	backgroundColor: Color.fromHex('#ECECEC')
// });
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  // mainWindow = new BrowserWindow({
  //   height: 563,
  //   useContentSize: true,
  //   width: 1000
  // })

  mainWindow = new BrowserWindow({
    useContentSize: true,
    width: 1000,
    height: 700,
    minWidth: 900,
    minHeight: 600,
    movable: true,//может ли окно перемещаться. В Linux это не реализовано
    opacity: 1,
    frame: true,
    visualEffectState: 'active',
    //vibrancy: "sidebar",
    // vibrancyState: 'active',
    //transparent: true,
    backgroundColor: "#00000000",
    titleBarStyle: "hidden",
    webPreferences: {
      nodeIntegration: true,
      // nodeIntegrationInWorker: true
    }
  })
  mainWindow.setMenu(null)
  mainWindow.loadURL(winURL)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
app.on('ready', () => {
  powerMonitor.on('suspend', () => {
    console.log('Ушел в сон!')
  })
  powerMonitor.on('resume', () => {
    console.log('Проснулся!')
  })
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
