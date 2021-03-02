import { action, makeObservable, observable } from 'mobx';

export type TestType = {
  title: string;
  hefx: number;
  setTitle: (v: string) => void;
  setHefx: () => void;
};

class Test {
  constructor() {
    makeObservable(this);
  }

  @observable title: string = '你好';

  @observable hefx: number = 1;

  @action
  setTitle = (v: string) => {
    this.title = v;
    console.log('执行了改变title', v, this.title);
  };

  @action
  setHefx = () => {
    this.hefx += 1;
    console.log('执行了改变 hefx', this.hefx);
  };
}

const test: TestType = new Test();

export default test;
