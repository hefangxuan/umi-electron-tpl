/**
 * electron窗口初始化
 */

import { BrowserWindow, protocol, screen } from 'electron';

import isDevEnv from 'electron-is-dev';
import * as path from 'path';
import { appName } from '../../electronBuilader';
import createProtocol from '../../lib/umi-plugin-electron-builder/createProtocol';

// 自定义协议,主窗口
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

export default class AppMainWindow {
  private mainWindow: any;

  private motionWindow: any;

  public childWindow: any;

  constructor() {
    this.initMainWindow();
  }

  initMainWindow() {
    this.createWindow();
  }

  createMotionWindow() {
    // eslint-disable-next-line prefer-const
    this.motionWindow = new BrowserWindow({
      frame: false,
      width: 470,
      height: 280,
      transparent: true,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
      },
    });

    if (isDevEnv) {
      this.motionWindow
        .loadURL(`file://${path.join(process.cwd(), 'files/loading/loading.html')}`)
        .catch((e: any) => console.log('加载文件错误: ', e));
    } else {
      this.motionWindow
        .loadURL(`file://${path.join(__dirname, 'files/loading/loading.html')}`)
        .catch((e: any) => console.log('加载文件错误: ', e));
    }
  }

  createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    // 主窗口配置
    const config = {
      width: width * 0.8,
      height: height * 0.8,
      minWidth: width * 0.8,
      minHeight: height * 0.8,
      autoHideMenuBar: false,
      title: appName,
      backgroundColor: '#fff',
      // fullscreen: false,
      webPreferences: {
        nodeIntegration: true,
        webviewTag: true,
        enableRemoteModule: true,
      },
      show: false,
    };

    // eslint-disable-next-line prefer-const
    this.mainWindow = new BrowserWindow(config);

    // 隐藏默认菜单
    this.mainWindow.setMenuBarVisibility(false);

    // 创建loading窗口
    // eslint-disable-next-line prefer-const
    this.createMotionWindow();

    if (isDevEnv) {
      this.mainWindow.loadURL(`http://localhost:${process.env.PORT}`).then();
    } else {
      createProtocol('app');
      this.mainWindow.loadURL('app://./index.html').then();
    }

    // 监听主窗口完成
    this.mainWindow.webContents.on('did-finish-load', () => {
      // this.mainWindow.setOpacity(0);
      setTimeout(() => {
        // this.mainWindow.setOpacity(1);
        if (this.motionWindow) {
          // this.motionWindow.setOpacity(0);
          this.motionWindow.close();
          this.motionWindow.destroy();
          this.motionWindow = null;
        }
        this.mainWindow.show();
      }, 100);
    });
  }

  initEvents() {
    // 窗口关闭的监听
    this.mainWindow.on('closed', () => {
      // console.log('closed')
      this.mainWindow = null;
    });
  }

  destoryMainWindow() {
    this.mainWindow = null;
  }

  // 统一发送渲染进程的消息函数
  send(key: string, value: any) {
    if (this.mainWindow) {
      this.mainWindow.webContents.send(key, value);
    }
  }
}
