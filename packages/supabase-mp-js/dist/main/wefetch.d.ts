export default myfetch;
/**
 * uni-app 小程序 Fetch 适配器
 * 模拟标准 Fetch API
 *
 * @param {string} url - 请求 URL
 * @param {Object} options - 请求选项
 * @param {string} options.method - HTTP 方法
 * @param {Object|Map} options.headers - 请求头
 * @param {string|Object} options.body - 请求体
 * @param {number} options.timeout - 超时时间（毫秒）
 * @returns {Promise<Response>}
 */
declare function myfetch(url: string, options?: {
    method: string;
    headers: Object | Map<any, any>;
    body: string | Object;
    timeout: number;
}): Promise<Response>;
//# sourceMappingURL=wefetch.d.ts.map