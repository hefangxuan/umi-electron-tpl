import { app, BrowserWindow } from 'electron';

import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

import isDevEnv from 'electron-is-dev';
import { createWindow } from './mainWindow';

const gotTheLock = app.requestSingleInstanceLock();
// 约定只有非开发环境才退出app
if (!gotTheLock && !isDevEnv) {
  app.quit();
}

// 主窗口
let mainWindow: BrowserWindow;

// 引入启动窗口
// const Elp = require('electron-launch-page');

// 初始化env
if (isDevEnv) {
  const dotenv = require('dotenv');
  dotenv.config();
}

// 控制窗口数量
app.on('second-instance', (event, commandLine, workingDirectory) => {
  // 当运行第二个实例时,将会聚焦到 mainWindow 这个窗口
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

// 监听软件运行
app.on('ready', async () => {
  if (isDevEnv) {
    installExtension(REACT_DEVELOPER_TOOLS).then();
  }
  await app.whenReady();
  mainWindow = createWindow();
});

// 监听软件关闭
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 监听软件获取焦点
app.on('activate', async () => {
  if (mainWindow === null) {
    mainWindow = createWindow();
  }
});
