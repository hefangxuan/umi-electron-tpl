import type { Configuration } from 'webpack';

import { resolve } from 'path';

const env = process.env.NODE_ENV === 'development' ? 'development' : 'production';

// 应用id
export const appId = 'com.test.test';

// 应用名称
export const appName = '测试的系统';

// 应用版本号
export const appVersion = '0.0.2';

export const electronBuilder = {
  // 默认主进程目录
  mainSrc: 'src/main',

  // 路由 只能是hash或memory
  routerMode: 'hash',

  // 默认打包目录
  outputDir: 'release',

  // 不配置的无法使用
  externals: [],

  // 构建目标electron-renderer或web
  rendererTarget: 'electron-renderer',

  // 主进程webpack配置
  mainWebpackConfig(config: Configuration) {
    // eslint-disable-next-line no-param-reassign
    config.mode = env;
    // eslint-disable-next-line no-param-reassign
    config.devtool = env === 'production' ? undefined : 'cheap-module-source-map';
    // eslint-disable-next-line no-param-reassign
    config.resolve!.alias = {
      '@main': resolve(__dirname, 'src/main'),
    };
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
