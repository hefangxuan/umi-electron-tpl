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

// 主窗口
let mainWindow: BrowserWindow;

// loading窗口
let motionWindow: BrowserWindow | null;

// 自定义协议,主窗口
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

// loading窗口
function createMotionWindow() {
  motionWindow = new BrowserWindow({
    title: appName,
    frame: false,
    width: 470,
    height: 280,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
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
      .loadURL(`file://${path.join(process.cwd(), 'files/loading/loading.html')}`)
      .catch((e) => console.log('加载文件错误: ', e));
  } else {
    motionWindow
      .loadURL(`file://${path.join(__dirname, 'files/loading/loading.html')}`)
      .catch((e) => console.log('加载文件错误: ', e));
  }
}

// 主窗口
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
      contextIsolation: false,
      // webviewTag: true,
      // enableRemoteModule: true,
      // preload: path.join(process.cwd(), 'src/main/preload.js')
    },
    show: false,
  };
  mainWindow = new BrowserWindow(config);

  // 隐藏默认菜单
  mainWindow.setMenuBarVisibility(false);

  // 创建loading窗口
  createMotionWindow();

  if (isDevEnv) {
    mainWindow.loadURL(`http://localhost:${process.env.PORT}`).then(() => {
      if (!process.env.IS_TEST) mainWindow.webContents.openDevTools();
    });
  } else {
    createProtocol('app');
    mainWindow.loadURL('app://./index.html').then();
  }

  // 监听主窗口完成
  mainWindow.on('ready-to-show', function () {
    // mainWindow.setOpacity(0);
    setTimeout(() => {
      // mainWindow.setOpacity(1);
      if (motionWindow) {
        motionWindow.setOpacity(0);
        motionWindow.destroy();
        motionWindow = null;
        mainWindow.show();
        mainWindow.maximize();
      }
    }, 2000);
  });
}

// 监听软件运行
app.on('ready', async () => {
  if (isDevEnv) {
    installExtension(REACT_DEVELOPER_TOOLS).then();
  }
  await app.whenReady();
  createWindow();
});

// 监听软件关闭
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 监听软件获取焦点
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
