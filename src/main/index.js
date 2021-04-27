import { app, dialog, BrowserWindow, powerMonitor, ipcMain} from 'electron'
import log from 'electron-log'
import request from 'request'
import fs from 'fs'
import os from 'os'
const username = os.userInfo().username

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

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
    visualEffectState: 'active',
    title: 'Буфер',
    titleBarStyle: 'default',
    // transparent: true, 
    frame: false,
    webPreferences: {
      nodeIntegration: true,
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
    if (process.env.NODE_ENV === 'production' && process.platform === "win32") {
      autoUpdater.checkForUpdates()
    }
  });
  log.info('createWindow')
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
ipcMain.on('quit-app', () => {
  console.log('quit-app');
  if (process.platform !== 'darwin') {
    app.quit()
  }
});


/**
 * Auto Updater
 */
if(process.platform === "win32"){
  const { AppImageUpdater, MacUpdater, NsisUpdater } = require("electron-updater")

  var options

  if (process.env.NODE_ENV === 'production') {
    options = {
      requestHeaders: {
        // Any request headers to include here
        Authorization: 'Basic 123456789'
      },
      provider: 'generic',
      url: 'http://localhost:5050/update/',//'http://10.20.0.41:3000/update/'
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
  ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
  });
}
ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

ipcMain.on('download-url', async (event, file) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  })
  if(!result.canceled){
    let localFile = `${result.filePaths}\\${file}`
    let percent = 0
    downloadFile({
      remoteFile: `http://localhost:5050/download/${file}`,
      localFile: localFile,
      onProgress: function (received,total){
        percent = Math.round((received * 100) / total) / 100
        if(percent == 0 || percent == 1){
          mainWindow.setProgressBar(-1)
        }else{
          mainWindow.setProgressBar(percent)
        }
      }
    }).then(function(){
      // console.log(`File succesfully downloaded ${file.path}`);
    });
  }
});

ipcMain.on('ondragstart', async (event, file) => {
  let localFile = ''
  if (process.platform === "win32") {
    localFile = `C:\\Users\\${username}\\AppData\\Local\\Temp\\${file}`
  }else{
    localFile = `/tmp/${file}`
  }
  let percent = 0
  await downloadFile({
    remoteFile: `http://localhost:5050/download/${file}`,
    localFile: localFile,
    onProgress: function (received,total){
        percent = Math.round((received * 100) / total) / 100
        if(percent == 0 || percent == 1){
          mainWindow.setProgressBar(-1)
        }else{
          mainWindow.setProgressBar(percent)
        }
    }
  }).then(res=>{
    
    
  });
  event.sender.startDrag({
    file: localFile,
    icon: './static/hand-drag.png'
  })
  if(percent == 1){
    fs.unlink(localFile, (err) => {
      if (err) throw err;
      console.log('path/file.txt was deleted');
    })
  }
})

function downloadFile(configuration){
  return new Promise(function(resolve, reject){
      // Save variable to know progress
      var received_bytes = 0;
      var total_bytes = 0;

      var req = request({
          method: 'GET',
          uri: configuration.remoteFile
      });

      var out = fs.createWriteStream(configuration.localFile);
      req.pipe(out);

      req.on('response', function ( data ) {
          // Change the total bytes value to get progress later.
          total_bytes = parseInt(data.headers['content-length' ]);
      });

      // Get progress if callback exists
      if(configuration.hasOwnProperty("onProgress")){
          req.on('data', function(chunk) {
              // Update the received bytes
              received_bytes += chunk.length;

              configuration.onProgress(received_bytes, total_bytes);
          });
      }else{
          req.on('data', function(chunk) {
              // Update the received bytes
              received_bytes += chunk.length;
          });
      }

      req.on('end', function() {
          resolve();
      });
  });
}