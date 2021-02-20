import React from 'react';
import { Spin } from 'antd';
// @ts-ignore
import styles from './index.less';

export default () => {
  return (
    <div className={styles.main}>
      <Spin spinning />
    </div>
  );
};
