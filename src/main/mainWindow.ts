// 主窗口
import { BrowserWindow, protocol, screen } from 'electron';
import { appName } from '../../electronBuilader';
import isDevEnv from 'electron-is-dev';
import createProtocol from '../../lib/umi-plugin-electron-builder/createProtocol';
import { createMotionWindow } from './motionWindow';

// 自定义协议,主窗口
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

export function createWindow() {
  // 主窗口
  let mainWindow: BrowserWindow;

  // loading窗口
  let motionWindow: BrowserWindow | null;

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
    fullscreen: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    show: false,
  };
  mainWindow = new BrowserWindow(config);

  // 隐藏默认菜单
  mainWindow.setMenuBarVisibility(false);

  // 创建loading窗口
  motionWindow = createMotionWindow();

  if (isDevEnv) {
    mainWindow.loadURL(`http://localhost:${process.env.PORT}`).then();
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

  return mainWindow;
}
