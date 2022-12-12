import { app, dialog, BrowserWindow, powerMonitor, ipcMain, shell} from 'electron'
import child_process from 'child_process'
import log from 'electron-log'
import request from 'request'
import fs from 'fs'
import os from 'os'
import path from 'path'
const username = os.userInfo().username
var activeFilesPath = []
var interval
const serverURL = process.env.NODE_ENV === 'production' ? 'http://localhost:5050': 'http://localhost:5050'//'http://10.20.0.41'
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
  // log.info('createWindow')
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
if(process.platform === "win32"){
  const { AppImageUpdater, MacUpdater, NsisUpdater } = require("electron-updater")

  var options, url

  if (process.env.NODE_ENV === 'production') {
    url = `${serverURL}/update/`
    options = {
      requestHeaders: {
        Authorization: 'Basic 123456789'
      },
      provider: 'generic',
      url: url
    }
  } else {
    url = `${serverURL}/update/`
    options = {
      requestHeaders: {
        Authorization: 'Basic 123456789'
      },
      provider: 'generic',
      url: url
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
// работает при закрытии приложения
ipcMain.on('quit-app', () => {
  app.exit(0)
});
// работает при двойном клике, открывает файл
ipcMain.on('openFile', async(event, file) => {
  let localFile = ''
  if (process.platform === "win32") {
    localFile = `C:\\Users\\${username}\\AppData\\Local\\Temp\\${file}`
  }else{
    localFile = `/tmp/${file}`
  }
  let percent = 0
  await downloadFile({
    remoteFile: `${serverURL}/download/${file}`,
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
    // shell.showItemInFolder(localFile) // Показать данный файл в файловом менеджере. Если это возможно, выберите файл.
    shell.openPath(localFile) // Откройте данный файл в режиме рабочего стола по умолчанию.
    // if(res){
    //   open_file_exp(localFile)
    //   activeFilesPath.push(localFile)
    //   if(activeFilesPath.length > 0){
    //     interval = setInterval(()=>{
    //         clearTempFiles()
    //     }, 3000)
    //   }
    // }
  }) 
});
// отправка в приложение версии
ipcMain.on('app_version', async(event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});
// работает при скачивании 
ipcMain.on('download-url', async (event, file) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  })
  if(!result.canceled){
    let localFile = `${result.filePaths}\\${file}`
    let percent = 0
    await downloadFile({
      remoteFile: `${serverURL}/download/${file}`,
      localFile: localFile,
      onProgress: function (received,total){
        percent = Math.round((received * 100) / total) / 100
        event.reply('downloadProgressStart', Math.round((received * 100) / total))
        if(percent == 0 || percent == 1){
          mainWindow.setProgressBar(-1)
        }else{
          mainWindow.setProgressBar(percent)
        }
      }
    }).then(res=>{
      if(res) shell.openPath(localFile) 
      // console.log(`File succesfully downloaded ${file.path}`);
    });
  }
});
// работает при перетаскивании из приложения
ipcMain.on('ondragstart', async (event, file) => {
  let localFile = ''
  if (process.platform === "win32") {
    localFile = `C:\\Users\\${username}\\AppData\\Local\\Temp\\${file}`
  }else{
    localFile = `/tmp/${file}`
  }
  let percent = 0
  await downloadFile({
    remoteFile: `${serverURL}/download/${file}`,
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
    event.sender.startDrag({
      file: localFile,
      icon: './static/hand-drag.png'
    })
    if(res && percent == 1){
      fs.unlink(localFile, (err) => {
        if (err) throw err;
      })
    }
  });
})
// Функция очистки файлов из папки Temp или tmp
function clearTempFiles(){
  activeFilesPath.forEach(file=>{
    fs.open(file,'r+', function(err,data) {
      if(data !== undefined && data !== null){
        fs.unlink(file, (err) => {
          if (err) throw err;
          console.log('deleted', file);
          activeFilesPath = activeFilesPath.filter(activFile=> activFile !== file)
          if(activeFilesPath.length == 0){
            clearInterval(interval);
          }
        })
      }
    });
  })
}
// Функция открытия файла по его пути 
function open_file_exp(fpath) {
  var command = '';
  switch (process.platform) {
    case 'darwin':
      command = 'open -R ' + fpath;
      break;
    case 'win32':
      // if (process.env.SystemRoot) {
      //   command = path.join(process.env.SystemRoot, 'explorer.exe');
      // } else {
      //   command = 'explorer.exe';
      // }
      command = fpath;
      break;
    default:
      fpath = path.dirname(fpath)
      command = 'xdg-open ' + fpath;
  }
  child_process.exec(command, function(stdout) {
    clearTempFiles()
  });
}
// Функция скачивания файлов
function downloadFile(configuration){
  return new Promise(function(resolve, reject){
      let received_bytes = 0;
      let total_bytes = 0;
      let req = request({
          method: 'GET',
          uri: configuration.remoteFile
      });
      let out = fs.createWriteStream(configuration.localFile);
      req.pipe(out);
      req.on('response', function ( data ) {
          total_bytes = parseInt(data.headers['content-length' ]);
      });
      if(configuration.hasOwnProperty("onProgress")){
          req.on('data', function(chunk) {
              received_bytes += chunk.length;
              configuration.onProgress(received_bytes, total_bytes);
          });
      }else{
          req.on('data', function(chunk) {
              received_bytes += chunk.length;
          });
      }
      req.on('end', function(e) {
          resolve(true);
      });
  });
}