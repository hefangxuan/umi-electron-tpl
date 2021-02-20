import { defineConfig } from 'umi';
import { appName, electronBuilder } from '../electronBuilader';
import { routes } from './route';
import path from 'path';

export default defineConfig({
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

  copy: [
    {
      from: 'loading/loading.html',
      to: 'loading/loading.html',
    },
  ],
});
