import { app, BrowserWindow, protocol } from 'electron';
import createProtocol from '../lib/umi-plugin-electron-builder/createProtocol';
import { appName } from '../../electronBuilader';
import { isDevelopment } from '../utils/common';

import dotenv from 'dotenv';
// 主进程加载env环境变量
dotenv.config();

// import installExtension, {
//   REACT_DEVELOPER_TOOLS,
// } from 'electron-devtools-installer';

let mainWindow: BrowserWindow;

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: appName,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  if (isDevelopment) {
    mainWindow.loadURL(`http://localhost:${process.env.PORT}`).then();
  } else {
    createProtocol('app');
    mainWindow.loadURL('app://./index.html').then();
  }
}

app.on('ready', async () => {
  // if (isDevelopment) {
  //   await installExtension(REACT_DEVELOPER_TOOLS);
  // }
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
