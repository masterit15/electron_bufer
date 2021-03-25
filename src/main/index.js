import { app, ipcMain, BrowserWindow, powerMonitor } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

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
    opacity: 0.95,
    frame: false,
    visualEffectState: 'active',
    vibrancy: "sidebar",
    
    // vibrancyState: 'active',
    //transparent: true,
    //backgroundColor: "#00000000",
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: true,
      // nodeIntegrationInWorker: true
    }
  })

  mainWindow.loadURL(winURL)
  //mainWindow.setOpacity(0.95)
  // mainWindow.setVibrancy('sidebar', {state: 'active'})
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
    console.log('The system is going to sleep!')
  })
  powerMonitor.on('resume', () => {
    console.log('The system is started!')
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
