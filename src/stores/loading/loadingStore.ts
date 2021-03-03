import { observable, action, makeObservable } from 'mobx';

export const NAMESPACE_SEP = '/';

const counter: any = {
  models: {},
  actions: {},
};

function modelCount(model: any, state: any) {
  if (typeof counter.models[model] === 'undefined') {
    counter.models[model] = 0;
  }

  if (state === true) {
    counter.models[model] += 1;
  } else if (state === false) {
    counter.models[model] = Math.max(counter.models[model] - 1, 0);
  }

  return counter.models[model] > 0;
}

function actionCount(actionName: any, state: any) {
  if (typeof counter.actions[actionName] === 'undefined') {
    counter.actions[actionName] = 0;
  }

  if (state === true) {
    counter.actions[actionName] += 1;
  } else if (state === false) {
    counter.actions[actionName] = Math.max(counter.actions[actionName] - 1, 0);
  }

  return counter.actions[actionName] > 0;
}

// reference https://github.com/mobxjs/mobx/blob/master/src/api/actiondecorator.ts
class LoadingStore {
  constructor() {
    makeObservable(this);
  }

  // global loading state
  @observable
  global = false;

  // load status of each model
  @observable
  models: any = {};

  // load status of each action
  @observable
  actions: any = {};

  // change load status
  @action
  change = (model: any, actionName: any, state: any) => {
    if (actionName) {
      this.actions[actionName] = actionCount(actionName, state);
    }

    if (state === true) {
      this.models[model] = modelCount(model, state);
      this.global = true;
    } else {
      this.models[model] = Object.keys(this.actions)
        .filter((key) => {
          return key && key.startsWith(`${model}${NAMESPACE_SEP}`);
        })
        .some((key) => {
          return this.actions[key];
        });

      this.global = Object.keys(this.models).some((key) => {
        return this.models[key];
      });
    }
  };
}

export default new LoadingStore();
