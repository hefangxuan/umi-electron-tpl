import React, { useEffect, useState } from 'react';
import Lottie, { LottieProps } from 'react-lottie';
import { request } from '@@/plugin-request/request';

export default React.memo((props: LottieProps) => {
  const [data, setData] = useState(undefined);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
    ...props.options,
    animationData: data,
  };

  useEffect(() => {
    if (typeof props.options?.animationData === 'string') {
      request(props.options.animationData, {
        method: 'get',
      }).then((r) => {
        console.log(r);
        setData(r);
      });
      return;
    }

    setData(props.options.animationData);
  }, []);

  return <Lottie {...props} options={defaultOptions} />;
});
