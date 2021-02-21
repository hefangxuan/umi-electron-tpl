/**
 * 自定义运行时配置
 * https://umijs.org/zh-CN/docs/runtime-config
 */
import React from 'react';
import { history } from 'umi';
import { ConfigProvider, message } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

// 覆写 render
export async function render(oldRender: () => void) {
  oldRender();
}

// 修改交给 react-dom 渲染时的根组件
export function rootContainer(container: React.ReactDOM) {
  return React.createElement(
    ConfigProvider,
    {
      locale: zhCN,
    },
    container,
  );
}
