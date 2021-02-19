import { defineConfig } from 'umi';
import { appName, electronBuilder } from '../electronBuilader';
import { routes } from './route';

export default defineConfig({
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
});
