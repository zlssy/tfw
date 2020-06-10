const { BrowserWindow, app, shell, ipcMain, dialog } = require('electron');
const path = require('path');
const debug = false;

function createWindow() {
  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 400,
    height: 150,
    webPreferences: {
      nodeIntegration: true
    }
  })

  let exePath = path.dirname(app.getPath('exe'));
  let autoPostPath;

  win.setMenuBarVisibility(false);

  // 并且为你的应用加载index.html
  win.loadFile('index.html')

  if (debug) {
    // 打开开发者工具
    win.webContents.openDevTools()
  }
}

ipcMain.on('open-directory-dialog', async (e) => {
  let files = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  if (files.filePaths && files.filePaths.length) {
    e.sender.send('selectedItem', files.filePaths[0]);
  }
});

app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})