# umi-electron-tpl Electron 样板代码项目

## 项目介绍
- 本项目是一个`Electron + umi + TypeScript` 的样板代码库,用于快速创建`Electron`项目

## 目录结构


## Getting Started

安装依赖项,

```bash
// 请使用yarn管理依赖
$ yarn
```

script 命令,

```
// 处理代码风格
"prettier": "prettier --write '**/*.{js,jsx,tsx,ts,less,md,json}'",
// umi 测试
"test": "umi-test",
"test:coverage": "umi-test --coverage",
"rebuild-deps": "electron-builder install-app-deps",
// 运行dev
"electron:dev": "umi dev electron",
// 打包win平台
"electron:build:win": "umi build electron --win",
// 打包mac平台
"electron:build:mac": "umi build electron --mac",
// 打包linux平台
"electron:build:linux": "umi build electron --linux"
```

## 约定
