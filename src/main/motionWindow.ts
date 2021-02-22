// loading窗口
import { BrowserWindow } from 'electron';
import { appName } from '../../electronBuilader';
import isDevEnv from 'electron-is-dev';
import path from 'path';

export function createMotionWindow() {
  // loading窗口
  let motionWindow: BrowserWindow | null;

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

  return motionWindow;
}
