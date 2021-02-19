/**
 * 通用方法
 */

export const isDevelopment = process.env.NODE_ENV === 'development';
/**
 * url参数查询
 * @param {string} [url=location.search] - url地址
 * @param {string} [query] - 查询参数
 * @param {boolean} [decode=true] - 返回的查询值是否需要解码
 * @returns {object|string}
 */
export const getParams = ({
  url = window.location.search,
  query,
  decode = true,
}: { url?: string; query?: string; decode?: boolean } = {}) => {
  const paramStr = url.split('?')[1];
  const paramArr = (paramStr && paramStr.split('&')) || [];
  const params: any = {};
  paramArr.forEach((param) => {
    const paramData = param.split('=');
    params[paramData[0]] = decode ? decodeURIComponent(paramData[1]) : paramData[1];
  });
  return query ? params[query] : params;
};

/**
 * url添加参数
 * @param {string} url - 需要添加参数的url
 * @param {object} params - 添加的参数，参数是'key:value'形式
 * @param {boolean} [encode=false] - 返回的url是否需要编码
 * @returns {string}
 */
export function addParams({
  url = '',
  params = {},
  encode = false,
}: {
  url?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  params: object;
  encode?: boolean;
}) {
  let URL = url;
  let PARAMS = params;
  if (!Object.keys(params).length) {
    return URL;
  }
  URL = decodeURIComponent(URL);
  const [hostStr, searchStr] = URL.split('?');
  if (URL.includes('?')) {
    let oldParams = {};
    searchStr.split('&').forEach((val) => {
      const newVal = val.split('=');
      oldParams = { ...oldParams, [newVal[0]]: newVal[1] };
    });
    // 合并、去重参数
    PARAMS = { ...oldParams, ...PARAMS };
  }
  let [paramsStr, i] = ['', 1];
  for (const [key, val] of Object.entries(PARAMS)) {
    paramsStr += i > 1 ? `&${key}=${val}` : `${key}=${val}`;
    i += 1;
  }
  const baseUrl = `${hostStr}?${paramsStr}`;
  return encode ? encodeURIComponent(baseUrl) : baseUrl;
}

/**
 * 判断是否是json字符串
 * @param str
 */
export function isJSON(str: string) {
  try {
    const obj = JSON.parse(str);
    return !!(typeof obj === 'object' && obj);
  } catch (e) {
    return false;
  }
}

/**
 * 数组转对象
 * @param arr
 */
// [{"id": 1, title: "a"}] ====> {"1":{"id": 1, title: "a"}}
export const flattenArr = (arr: any) => {
  return arr.reduce((a: any, item: any) => {
    return { ...a, [item.id]: item };
  }, {});
};

/**
 * 对象转数组
 * @param obj
 */
export const objToArr = (obj: any) => {
  return Object.keys(obj).map((key) => obj[key]);
};

/**
 * 随机数
 * @param min
 * @param max
 */
export function getRandom(min: number, max: number) {
  // @ts-ignore
  // eslint-disable-next-line radix
  return Math.floor(parseInt(Math.random() * (max - min))) + min;
}

/**
 * 延迟函数
 * @param ms
 */
// eslint-disable-next-line strict
export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * 处理对象参数值，排除对象参数值为”“、null、undefined，并返回一个新对象
 * */
const toType = (obj: any) => {
  // @ts-ignore
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase();
};
export const filterNull = (obj: Record<string, any>) => {
  if (typeof obj !== 'object') return obj;
  const o = obj;
  Object.keys(o).forEach((i) => {
    if (o[i] == null) delete o[i];
    if (toType(o[i]) === 'string') {
      o[i] = o[i].trim();
      if (o[i] === '') delete o[i];
    } else if (toType(o[i]) === 'object') {
      o[i] = filterNull(o[i]);
      if (JSON.stringify(o[i]) === '{}') delete o[i];
    } else if (toType(o[i]) === 'array') {
      o[i] = filterNull(o[i]);
      o[i] = o[i].filter((arr: any) => arr);
      if (o[i].length === 0) delete o[i];
    }
  });
  return o;
};

// 获取直播间连接地址函数
export function getLiveHostAndPort(arr: string[]) {
  let sArr = ['103.102.201.82', 14000];
  const hostPort14000 = arr.find((i) => i.indexOf('14000') !== -1);
  if (!hostPort14000) {
    const [hostPort] = arr;
    sArr = hostPort.split(':');
  } else {
    sArr = hostPort14000.split(':');
  }

  return sArr;
}

// 计算long类型值
export function sumLongValue(a: any) {
  // eslint-disable-next-line no-restricted-properties
  const q = Math.pow(2, 32) * a.high + a.low;
  console.log(111, a, a.toString(), q);
  return q;
}
