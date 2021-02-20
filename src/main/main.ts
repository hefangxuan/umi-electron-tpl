import { app, BrowserWindow, protocol, screen } from 'electron';
import createProtocol from '../../lib/umi-plugin-electron-builder/createProtocol';

import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

import isDevEnv from 'electron-is-dev';
import { appName } from '../../electronBuilader';
import * as path from 'path';

// 引入启动窗口
// const Elp = require('electron-launch-page');

// 初始化env
if (isDevEnv) {
  const dotenv = require('dotenv');
  dotenv.config();
}
let mainWindow: BrowserWindow;
let motionWindow: BrowserWindow;

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

function createMotionWindow() {
  motionWindow = new BrowserWindow({
    title: appName,
    frame: false,
    width: 470,
    height: 280,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
    },
    show: true,
    movable: false, // motion window do not movable
    skipTaskbar: true,
    maximizable: false,
    minimizable: false,
    closable: false,
  });

  if (isDevEnv) {
    motionWindow
      .loadURL(`file://${path.join(process.cwd(), 'loading/loading.html')}`)
      .catch((e) => console.log('加载文件错误: ', e));
  } else {
    motionWindow
      .loadURL(`file://${path.join(__dirname, 'loading/loading.html')}`)
      .catch((e) => console.log('加载文件错误: ', e));
  }
}

function createWindow() {
  if (mainWindow) return;

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  // 主窗口配置
  const config = {
    width: width * 0.9,
    height: height * 0.8,
    minWidth: 960,
    minHeight: 720,
    autoHideMenuBar: false,
    title: appName,
    backgroundColor: '#fff',
    // transparent: !isMac,
    // frame: isMac,
    fullscreen: false,
    webPreferences: {
      nodeIntegration: true,
      // webviewTag: true,
      enableRemoteModule: true,
      // preload: path.join(process.cwd(), 'src/main/preload.js')
    },
    show: false,
  };
  mainWindow = new BrowserWindow(config);

  // 隐藏默认菜单
  mainWindow.setMenuBarVisibility(false);

  createMotionWindow();

  if (isDevEnv) {
    mainWindow.loadURL(`http://localhost:${process.env.PORT}`).then();
  } else {
    createProtocol('app');
    mainWindow.loadURL('app://./index.html').then();
  }

  mainWindow.on('ready-to-show', function () {
    // mainWindow.setOpacity(0);
    setTimeout(() => {
      // mainWindow.setOpacity(1);
      if (motionWindow) {
        motionWindow.setOpacity(0);
        motionWindow.destroy();
        mainWindow.show();
        mainWindow.maximize();
      }
    }, 2000);
  });
}

app.on('ready', async () => {
  if (isDevEnv) {
    installExtension(REACT_DEVELOPER_TOOLS).then();
  }
  await app.whenReady();
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
