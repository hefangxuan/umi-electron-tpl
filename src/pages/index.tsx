import React from 'react';
import './index.less';

import MyLottie from '@/components/MyLottie';
import { appName } from '../../electronBuilader';

// import data from '@/assets/lf20_mdbdc5l7.json';

export default function IndexPage() {
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
      </div>
    </div>
  );
}
