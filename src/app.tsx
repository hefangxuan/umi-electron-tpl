/**
 * 自定义运行时配置
 * https://umijs.org/zh-CN/docs/runtime-config
 */
import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { Provider } from 'mobx-react';
import { store } from '@/stores/config';

// 覆写 render
export async function render(oldRender: () => void) {
  oldRender();
}

// 修改交给 react-dom 渲染时的根组件
export function rootContainer(container: React.ReactDOM) {
  return (
    <ConfigProvider locale={zhCN}>
      <Provider {...store}>{container}</Provider>
    </ConfigProvider>
  );
}
