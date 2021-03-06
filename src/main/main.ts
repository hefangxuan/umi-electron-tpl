import { app, BrowserWindow, ipcMain, protocol, screen } from 'electron';

// import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import os from 'os';
import isDevEnv from 'electron-is-dev';
import { globalConfig } from '../common/store';
import path from 'path';
import { appName } from '../../electronBuilader';
import createProtocol from '../../lib/umi-plugin-electron-builder/createProtocol';

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

// 自定义协议,主窗口
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

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

// 主窗口
let mainWindow: BrowserWindow;
// loading窗口
let motionWindow: BrowserWindow | null;

function createMotionWindow() {
  // eslint-disable-next-line prefer-const
  motionWindow = new BrowserWindow({
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
    motionWindow
      .loadURL(`file://${path.join(process.cwd(), 'files/loading/loading.html')}`)
      .catch((e) => console.log('加载文件错误: ', e));
  } else {
    motionWindow
      .loadURL(`file://${path.join(__dirname, 'files/loading/loading.html')}`)
      .catch((e) => console.log('加载文件错误: ', e));
  }
}

globalConfig.set('local.ip', getIPAdress());

export function createWindow() {
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
  mainWindow = new BrowserWindow(config);

  // 隐藏默认菜单
  mainWindow.setMenuBarVisibility(false);

  // 创建loading窗口
  // eslint-disable-next-line prefer-const
  createMotionWindow();

  if (isDevEnv) {
    mainWindow.loadURL(`http://localhost:${process.env.PORT}`).then();
  } else {
    createProtocol('app');
    mainWindow.loadURL('app://./index.html').then();
  }

  // 监听主窗口完成
  mainWindow.webContents.on('did-finish-load', () => {
    // mainWindow.setOpacity(0);
    setTimeout(() => {
      // mainWindow.setOpacity(1);
      if (motionWindow) {
        // motionWindow.setOpacity(0);
        motionWindow.close();
        motionWindow.destroy();
      }
      mainWindow.show();
    }, 100);
  });
}

// =====================初始化一下参数必须在主进程做的 结束====================== //

// =====================创建监听通讯 IPC 开始====================== //
// 关闭启动loading层, 移除loading view视图
ipcMain.on('logAppName', () => {
  console.log(globalConfig.get('appName.a'));
});
// =====================创建监听通讯 IPC 结束====================== //

// 控制窗口数量
// app.on('second-instance', (event, commandLine, workingDirectory) => {
//   // 当运行第二个实例时,将会聚焦到 mainWindow 这个窗口
//   if (mainWindow) {
//     if (mainWindow.isMinimized()) mainWindow.restore();
//     mainWindow.focus();
//   }
// });

app.on('second-instance', () => {
  const windows = BrowserWindow.getAllWindows();
  if (windows?.length >= 1 && mainWindow) {
    mainWindow.focus();
  }
});

// 监听软件运行
app.on('ready', async () => {
  // if (isDevEnv) {
  //   installExtension(REACT_DEVELOPER_TOOLS).then();
  // }
  await app.whenReady();
  createWindow();
});

// 监听软件关闭
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  console.log('before-quit');
  // @ts-ignore
  mainWindow = null;
});
