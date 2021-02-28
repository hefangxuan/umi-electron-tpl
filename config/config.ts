import { defineConfig } from 'umi';
import { appName, electronBuilder } from '../electronBuilader';
import { routes } from './route';
import path from 'path';

const resolvePath = (dir: string) => path.join(__dirname, '../', dir);

const chainWebpack = ({ target }: any) => {
  return target('electron-renderer');
};

export default defineConfig({
  // chainWebpack,
  devtool: 'eval',
  electronBuilder,
  title: appName,
  nodeModulesTransform: {
    type: 'none',
  },
  routes,

  // 引入插件
  plugins: [path.join(__dirname, '../lib/umi-plugin-electron-builder')],

  dynamicImport: {
    loading: '@/components/Loading',
  },

  targets: {
    chrome: 79,
    firefox: false,
    safari: false,
    edge: false,
    ios: false,
  },

  copy: [
    {
      from: 'files',
      to: 'files',
    },
  ],
  // 生成资源带 hash 尾缀
  // 开发模式下 umi 会忽略此选项，不然热重载会出问题(很贴心)
  hash: true,
  // url 格式
  history: {
    type: 'hash',
  },
  // script、link 标签资源引入路径
  publicPath: './',
  // antd 主题配置
  theme: {
    '@primary-color': 'rgba(249, 163, 42, 1.000)',
    '@link-color': 'rgba(249, 163, 42, 1.000)',
    '@font-family': 'Arial, Helvetica, sans-serif',
    // '@line-height-base': '1.3',
    '@border-radius-base': '6px',
    '@font-size-base': '14px',
  },
  // antd: {
  //   // dark: true, // 开启暗色主题
  //   compact: true, // 开启紧凑主题
  // },
  // 路径别名
  alias: {
    '@': resolvePath('src'),
    '@components': resolvePath('src/components'),
    '@config': resolvePath('config'),
    '@utils': resolvePath('src/utils'),
    '@pages': resolvePath('src/pages'),
  },
});
