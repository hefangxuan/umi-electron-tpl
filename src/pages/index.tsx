import React from 'react';
import Lottie from 'react-lottie';
import './index.less';

import animationData from '@/assets/lf20_mdbdc5l7.json';

export default function IndexPage() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <div className="home">
      <div className="home-body">
        <Lottie
          options={defaultOptions}
          height={300}
          width={300}
          isStopped={false}
          isPaused={false}
        />
        <div id="box">
          <p id="flashlight">
            <span id="flash">UMI-ELECTRON-TPl</span>
          </p>
        </div>
      </div>
    </div>
  );
}
