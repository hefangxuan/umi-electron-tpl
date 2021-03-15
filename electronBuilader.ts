import type { Configuration } from 'webpack';

import { resolve } from 'path';

const env = process.env.NODE_ENV === 'development' ? 'development' : 'production';

const { appName, version: appVersion, appId } = require('./package.json');

export const electronBuilder = {
  // 默认主进程目录
  mainSrc: 'src/main',

  // 路由 只能是hash或memory
  routerMode: 'hash',

  // 默认打包目录
  outputDir: 'release',

  // 不配置的无法使用
  externals: ['electron-store'],

  // 构建目标electron-renderer或web
  rendererTarget: 'electron-renderer',

  // 主进程webpack配置
  mainWebpackConfig(config: Configuration) {
    // eslint-disable-next-line no-param-reassign
    // config.mode = env;
    // eslint-disable-next-line no-param-reassign
    config.node = { __dirname: false, __filename: false };
    // eslint-disable-next-line no-param-reassign
    config.devtool = env === 'development' ? 'cheap-module-source-map' : false;
    // eslint-disable-next-line no-param-reassign
    // config.target = 'electron-main';
    // eslint-disable-next-line no-param-reassign
    config.resolve!.alias = {
      '@main': resolve(__dirname, 'src/main'),
    };
  },

  // 过滤 Electron 发出的log信息, 通过返回 true 或 false 来决定是否输出 false不输出
  isLogProcess(data: string) {
    // 排除打开开发者工具栏,鼠标点击会出发警告信息
    const is1 = data.indexOf('NSPopoverTouchBarItemButton') !== -1;
    // 排除加载react开发者工具会出现的警告信息
    const is2 = data.indexOf('minimum_chrome_version') !== -1;

    return !(is1 || is2);
  },

  // 打包配置
  builderOptions: {
    // 软件名称
    productName: appName,
    // 版本
    buildVersion: appVersion,
    // 包名
    appId,
    // 删除package.json 中的scripts 自定义命令
    removePackageScripts: true,
    // 配置打包生成目录及自动版本分目录
    directories: {
      // eslint-disable-next-line no-template-curly-in-string
      output: 'release/${buildVersion}_setup',
    },
    // mac 配置
    mac: {
      target: ['dmg', 'zip'],
    },
    // win 配置
    win: {
      target: 'nsis',
      icon: 'src/public/icon.ico',
    },
    // 关于自动更新的
    publish: [
      {
        provider: 'generic',
        url: '',
      },
    ],
    // win安装文件配置
    nsis: {
      allowToChangeInstallationDirectory: true,
      oneClick: false,
      menuCategory: true,
      allowElevation: true,
      // 生成的安装包名字
      // eslint-disable-next-line no-template-curly-in-string
      artifactName: '${productName}_Setup_${buildVersion}.${ext}',
      // 安装后的快捷方式名字
      // eslint-disable-next-line no-template-curly-in-string
      shortcutName: '${productName}v${buildVersion}',
    },
    // 添加要引入的文件,!是不引入即排除
    // files: [
    //   '!node_modules/*/**',
    // ],
  },
};

export { appId, appName, appVersion };
