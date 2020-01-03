'use strict'

import {
  app,
  BrowserWindow,
  ipcMain
} from 'electron'
// Local
import './localBridge'
import './localSingleBridge'
import { autoUpdater } from 'electron-updater'
// import updateUrl from '../config/index'

// Online
import './onlineBridge'
import util from './lib'

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

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
  mainWindow = new BrowserWindow({
    height: 600,
    width: 900,
    opacity: 0.96,
    useContentSize: true,
    maximizable: false,
    // transparent: true,
    resizable: false,
    show: false
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
    // taryIcon.destroy()
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // 尝试更新
  updateHandle()
}

app.on('ready', () => {
  createWindow()
  util.createTray()
})

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

function updateHandle () {
  let message = {
    error: '检查更新出错',
    checking: '正在检查更新..',
    updateAva: '检测到新版本，正在下载...',
    updateNotAva: '已经是最新版本'
  }

  autoUpdater.setFeedURL('http://localhost/download/')
  autoUpdater.on('error', _ => {
    sendUpdateMessage(message.error)
  })

  autoUpdater.on('checking-for-update', _ => {
    sendUpdateMessage(message.checking)
  })

  autoUpdater.on('update-not-available', _ => {
    sendUpdateMessage(message.updateNotAva)
  })

  autoUpdater.on('download-progress', progressObj => {
    mainWindow.webContents.send('downloadProgress', progressObj)
  })

  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, relaseData, updateUrl, quitAndUpdate) => {
    ipcMain.on('isUpdateNow', (e, arg) => {
      console.log(arguments)
      console.log('开始更新')
      autoUpdater.quitAndInstall()
    })

    mainWindow.webContents.send('isUpdateNow')
  })

  ipcMain.on('checkForUpdate', _ => {
    autoUpdater.checkForUpdates()
  })
}

// 传递提示信息
function sendUpdateMessage (content) {
  mainWindow.webContents.send('message', content)
}
