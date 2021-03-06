import { app, BrowserWindow, ipcMain } from 'electron';

// import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import os from 'os';
import isDevEnv from 'electron-is-dev';
import { globalConfig } from '../common/store';
import AppMainWindow from './AppMainWindow';

// 锁定单实例
const gotTheLock = app.requestSingleInstanceLock();

// 如果失败, 退出程序
if (!gotTheLock) {
  app.quit();
}

app.allowRendererProcessReuse = true;
const isWin7 = os.release().startsWith('6.1');
// win7部分系统白屏优化: 下关闭硬件加速
if (isWin7) app.disableHardwareAcceleration();

// 初始化env
if (isDevEnv) {
  // eslint-disable-next-line global-require
  const dotenv = require('dotenv');
  dotenv.config();
}

// =====================初始化一下参数必须在主进程做的 开始====================== //
// /获取本机ip///
// eslint-disable-next-line consistent-return
function getIPAdress(): any {
  const interfaces = os.networkInterfaces();
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i += 1) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}

globalConfig.set('local.ip', getIPAdress());

/**
 * 类的实现
 */
class MainApp {
  private mainWindow: any;

  // private tray: any;

  constructor() {
    this.initAppLife();
    this.initIPC();
  }

  // app 的生命周期
  initAppLife() {
    // 监听软件运行
    app.on('ready', async () => {
      // if (isDevEnv) {
      //   installExtension(REACT_DEVELOPER_TOOLS).then();
      // }
      await app.whenReady();
      this.createMainWindow();
    });

    // 监听软件关闭
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('before-quit', () => {
      console.log('before-quit');
      this.mainWindow.destoryMainWindow();
    });

    app.on('second-instance', () => {
      const windows = BrowserWindow.getAllWindows();
      if (windows?.length >= 1 && this.mainWindow) {
        this.mainWindow.focus();
      }
    });
  }

  // 所有的IPC通信都放这边
  initIPC() {
    ipcMain.on('logAppName', () => {
      console.log(globalConfig.get('appName.a'));
    });
  }

  createMainWindow() {
    this.mainWindow = new AppMainWindow();
  }
}

new MainApp();
