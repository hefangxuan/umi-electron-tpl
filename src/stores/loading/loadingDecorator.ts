import loadingStore, { NAMESPACE_SEP } from './loadingStore';

// lowercase the first
function lowerCaseFirst(str: any) {
  if (str === null) {
    return '';
  }

  // eslint-disable-next-line no-param-reassign
  str = String(str);

  return str.charAt(0).toLowerCase() + str.substr(1);
}

/**
 * execute action
 * @param names [model, action]
 * @param func
 * @param scope
 * @returns {function(): *}
 */
function executeAction(names: any, func: any, scope: any) {
  return (...args: any) => {
    const [model, action] = names;

    loadingStore.change(model, action, true);

    //
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-invalid-this
    const promise = func.apply(scope || this, args);

    // hope is a promise object
    if (typeof promise === 'object' && typeof promise.finally === 'function') {
      promise.finally(() => {
        loadingStore.change(model, action, false);
      });
    } else {
      loadingStore.change(model, action, false);
    }

    return promise;
  };
}

function actionDecorator(this: any, target: any, prop: any, descriptor: any, name: any) {
  let names: any[];

  if (
    typeof name === 'undefined' &&
    target.constructor &&
    typeof target.constructor.name === 'string'
  ) {
    if (target.namespace) {
      // eslint-disable-next-line no-param-reassign
      name = target.namespace;
      // eslint-disable-next-line no-param-reassign
      prop = lowerCaseFirst(prop);
    } else {
      // eslint-disable-next-line no-param-reassign
      name = lowerCaseFirst(target.constructor.name);
      // eslint-disable-next-line no-param-reassign
      prop = lowerCaseFirst(prop);
    }

    names = [name, lowerCaseFirst(`${name}${NAMESPACE_SEP}${prop}`)];
  } else if (Array.isArray(name)) {
    names = [name[0], name.length > 1 ? name.join(NAMESPACE_SEP) : null];
  } else {
    // eslint-disable-next-line no-param-reassign
    name = String(name).split(NAMESPACE_SEP);

    names = [name[0], name.length > 1 ? name.join(NAMESPACE_SEP) : null];
  }

  if (descriptor) {
    if (process.env.NODE_ENV !== 'production' && descriptor.get !== undefined) {
      throw new Error('@loading cannot be used with getters');
    }
    // babel / typescript
    // @action method() { }
    if (descriptor.value) {
      // typescript
      return {
        // @ts-ignore
        value: executeAction(names, descriptor.value),
        enumerable: false,
        configurable: true, // See #1477
        writable: true, // for typescript, this must be writable, otherwise it cannot inherit :/ (see inheritable actions test)
      };
    }

    // babel only: @action method = () => {}
    const { initializer } = descriptor;

    return {
      enumerable: false,
      configurable: true, // See #1477
      writable: true, // See #1398
      initializer() {
        // N.B: we can't immediately invoke initializer; this would be wrong
        // @ts-ignore
        return executeAction(names, initializer.call(this));
      },
    };
  }

  // bound loadingStore methods
  // @ts-ignore
  // eslint-disable-next-line prefer-rest-params
  return fieldActionDecorator(names).apply(this, arguments);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function fieldActionDecorator(name: any) {
  // Simple property that writes on first invocation to the current loadingStore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (target: any, prop: any, descriptor: any) => {
    Object.defineProperty(target, prop, {
      configurable: true,
      enumerable: false,
      get() {
        return undefined;
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      set(value: any) {
        // 待实现
        return value;
      },
    });
  };
}

export default function loading(...args: any[]): any {
  if (args.length === 1) {
    return (target: any, prop: any, descriptor: any) =>
      actionDecorator(target, prop, descriptor, args[0]);
  }
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-invalid-this
  return actionDecorator.apply(this, args);
}
