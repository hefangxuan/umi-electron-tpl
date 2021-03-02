import React from 'react';
import './index.less';

import MyLottie from '@/components/MyLottie';
import { appName } from '../../electronBuilader';
import { observer } from 'mobx-react';
import { useStore } from '@/stores';

// import data from '@/assets/lf20_mdbdc5l7.json';

function IndexPage(): JSX.Element {
  // 测试mobx
  const { test } = useStore();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    // animationData: data,
    animationData: 'https://assets1.lottiefiles.com/packages/lf20_mdbdc5l7.json',
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="home">
      <div className="home-body">
        <MyLottie
          options={defaultOptions}
          height={300}
          width={300}
          isStopped={false}
          isPaused={false}
        />
        <div id="box">
          <div id="flashlight">
            <div id="flash">{appName}</div>
          </div>
          <div id="flashlight-b">
            <div id="flash-b">{appName}</div>
          </div>
        </div>
        <div className="text-red">{test?.title}</div>
        <button onClick={() => test.setTitle('niasdh' + Math.random())}>测试</button>
      </div>
    </div>
  );
}

export default observer(IndexPage);
