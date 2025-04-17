import { app, BrowserWindow, dialog } from "electron"
import path from "path"
import { isDev } from "./util.js"
import pkg from 'electron-updater'
const { autoUpdater } = pkg

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    if (isDev()) {
        mainWindow.loadURL("http://localhost:5123")
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'))
    }
}

app.on("ready", () => {
    createWindow()

    if (!isDev()) {
        autoUpdater.checkForUpdates()
    }
})

autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
        type: 'info',
        title: 'Update Available',
        message: 'Có phiên bản mới. Ứng dụng sẽ được cập nhật sau khi tải xong.',
    })
})

autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
        type: 'info',
        title: 'Update Ready',
        message: 'Update đã tải xong. Ứng dụng sẽ khởi động lại để cập nhật.',
    }).then(() => {
        autoUpdater.quitAndInstall()
    })
})
