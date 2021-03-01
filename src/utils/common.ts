/**
 * 通用方法
 */

export const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * 延迟函数
 * @param ms
 */
export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
