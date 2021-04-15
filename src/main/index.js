import { app, dialog, BrowserWindow, powerMonitor, ipcMain, session } from 'electron'

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

let mainWindow

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
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
      //nodeIntegrationInWorker: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  })
  mainWindow.setMenu(null)
  mainWindow.loadURL(winURL)
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdates()
  });
 
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
app.on('ready', async() => {
  powerMonitor.on('suspend', () => {
    console.log('Ушел в сон!')
  })
  powerMonitor.on('resume', () => {
    console.log('Проснулся!')
  })

})

/**
 * Auto Updater
 */

const { AppImageUpdater, MacUpdater, NsisUpdater } = require("electron-updater")

var options

if (process.env.NODE_ENV === 'production') {
  options = {
    requestHeaders: {
      // Any request headers to include here
      Authorization: 'Basic 123456789'
    },
    provider: 'generic',
    url: 'http://10.20.0.41:3000/update/'
  }
} else {
  
  options = {
    requestHeaders: {
      // Any request headers to include here
      Authorization: 'Basic 123456789'
    },
    provider: 'generic',
    url: 'http://localhost:5050/update/'
  }
}

var autoUpdater

if (process.platform === "win32") {
  autoUpdater = new NsisUpdater(options)
}
else if (process.platform === "darwin") {
  autoUpdater = new MacUpdater(options)
}
else {
  autoUpdater = new AppImageUpdater(options)
}

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

// autoUpdater.on('download-progress', (progressObj) => {
//   let log_message = "Download speed: " + progressObj.bytesPerSecond;
//   log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
//   log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
//   mainWindow.webContents.send('download-progress', log_message);
// })

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});
ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});