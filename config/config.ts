import { defineConfig } from 'umi';
import { appName, electronBuilder } from '../electronBuilader';
import { routes } from './route';
import path from 'path';

export default defineConfig({
  devtool: 'eval',
  electronBuilder,
  layout: {
    name: 'Ant Design Pro',
    logo: 'https://preview.pro.ant.design/static/logo.f0355d39.svg',
    // copy from pro site
    navTheme: 'dark',
    primaryColor: '#1890ff',
    layout: 'sidemenu',
    contentWidth: 'Fluid',
    fixedHeader: true,
    // fixSiderbar: false,
    title: 'Ant Design Pro',
    pwa: false,
    iconfontUrl: '',
  },
  title: appName,
  nodeModulesTransform: {
    type: 'none',
  },
  routes,

  // 引入插件
  plugins: [path.join(__dirname, '../src/lib/umi-plugin-electron-builder')],

  dynamicImport: {
    loading: '@/components/Loading',
  },

  copy: [
    {
      from: 'loading/loading.html',
      to: 'loading/loading.html',
    },
  ],
});
