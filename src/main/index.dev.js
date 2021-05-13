require('electron').app.on('ready', () => {
  //if(process.env.NODE_ENV !== 'production'){
    require('electron-debug')({ showDevTools: true })
  //}
})

require('./index')