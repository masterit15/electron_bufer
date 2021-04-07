import { app, dialog, ipcMain, BrowserWindow, powerMonitor } from 'electron'
// import { autoUpdater } from 'electron-updater';
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
// app.on('ready', () => {
//   if (process.env.NODE_ENV == 'production') {
//     require('vue-devtools').uninstall()
//   }else{
//     require('vue-devtools').install()
//   }
// })
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
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
    title: 'Буфер',
    titleBarStyle: 'default',
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

  // mainWindow.once('ready-to-show', () => {
  //   autoUpdater.checkForUpdatesAndNotify();
  // });
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
  autoUpdater.checkForUpdates()
  powerMonitor.on('suspend', () => {
    console.log('Ушел в сон!')
  })
  powerMonitor.on('resume', () => {
    console.log('Проснулся!')
  })

})

// ipcMain.on('app_version', (event) => {
//   event.sender.send('app_version', { version: app.getVersion() });
// });

// autoUpdater.on('update-available', () => {
//   mainWindow.webContents.send('update_available');
// });

// autoUpdater.on('update-downloaded', () => {
//   mainWindow.webContents.send('update_downloaded');
// });

// ipcMain.on('restart_app', () => {
//   autoUpdater.quitAndInstall();
// });

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

// import { autoUpdater } from 'electron-updater'

// autoUpdater.on('update-downloaded', () => {
//   autoUpdater.quitAndInstall()
// })

// app.on('ready', () => {
//   if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
// })

// const { autoUpdater } = require('electron-updater');

// autoUpdater.on('update-downloaded', (info) => {
//   const dialogOpts = {
//     type: 'info',
//     buttons: ['Перезагрузить', 'Обновить'],
//     title: 'Обновление BUFER',
//     detail: 'Была загружена новая версия. Перезапустите приложение, чтобы применить обновления.'
//   };

//   dialog.showMessageBox(dialogOpts, (response) => {
//     if (response === 0) { 
//       autoUpdater.quitAndInstall();
//     }
//   });
// });

