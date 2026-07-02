"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionsClient = void 0;
const helper_1 = require("./helper");
const types_1 = require("./types");
class FunctionsClient {
    constructor(url, { headers = {}, customFetch, } = {}) {
        this.url = url;
        this.headers = headers;
        this.customFetch = customFetch;
        this.fetch = (0, helper_1.resolveFetch)(customFetch);
    }
    /**
     * Updates the authorization header
     * @param token - the new jwt token sent in the authorisation header
     */
    setAuth(token) {
        this.headers.Authorization = `Bearer ${token}`;
    }
    /**
     * Invokes a function
     * @param functionName - the name of the function to invoke
     */
    invoke(functionName, invokeOptions = {}) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { headers, method, body: functionArgs } = invokeOptions;
                let _headers = {};
                let body;
                if (functionArgs &&
                    ((headers && !Object.prototype.hasOwnProperty.call(headers, 'Content-Type')) || !headers)) {
                    if ((typeof Blob !== 'undefined' && functionArgs instanceof Blob) ||
                        functionArgs instanceof ArrayBuffer) {
                        // will work for File as File inherits Blob
                        // also works for ArrayBuffer as it is the same underlying structure as a Blob
                        _headers['Content-Type'] = 'application/octet-stream';
                        body = functionArgs;
                    }
                    else if (typeof functionArgs === 'string') {
                        // plain string
                        _headers['Content-Type'] = 'text/plain';
                        body = functionArgs;
                    }
                    else if (typeof FormData !== 'undefined' && functionArgs instanceof FormData) {
                        // don't set content-type headers
                        // Request will automatically add the right boundary value
                        body = functionArgs;
                    }
                    else {
                        // default, assume this is JSON
                        _headers['Content-Type'] = 'application/json';
                        body = JSON.stringify(functionArgs);
                    }
                }
                // Use customFetch if available (with auth), otherwise use resolved fetch
                const fetchFn = this.customFetch || this.fetch;
                const functionUrl = `${this.url}/${functionName}`;
                // @ts-ignore
                if (typeof uni !== 'undefined' && typeof uni.request === 'function') {
                    return new Promise((resolve) => {
                        // @ts-ignore
                        uni.request({
                            url: functionUrl,
                            method: (method || 'POST'),
                            header: Object.assign(Object.assign(Object.assign({}, _headers), this.headers), headers),
                            data: body,
                            responseType: 'text',
                            dataType: 'text',
                            // Actually, to make it robust, let's let uni parse JSON if it looks like JSON, but we must check statusCode.
                            // If we use 'text', we must JSON.parse ourselves.
                            // Let's use 'text' to be safe against "success but error" auto-parsing quirks.
                            success: (res) => {
                                // Handle 200-299 success
                                if (res.statusCode >= 200 && res.statusCode < 300) {
                                    // Try to parse data if content-type is json
                                    const contentType = (res.header && (res.header['Content-Type'] || res.header['content-type'])) ||
                                        'text/plain';
                                    let data = res.data;
                                    if (typeof data === 'string' && contentType.includes('application/json')) {
                                        try {
                                            data = JSON.parse(data);
                                        }
                                        catch (e) {
                                            // ignore, keep as string
                                        }
                                    }
                                    resolve({ data, error: null });
                                }
                                else {
                                    // Handle Error
                                    // rpc often returns error details in body
                                    const contentType = (res.header && (res.header['Content-Type'] || res.header['content-type'])) ||
                                        'text/plain';
                                    let errorData = res.data;
                                    if (typeof errorData === 'string' && contentType.includes('application/json')) {
                                        try {
                                            errorData = JSON.parse(errorData);
                                        }
                                        catch (e) { }
                                    }
                                    resolve({
                                        data: null,
                                        error: {
                                            name: 'FunctionsHttpError',
                                            message: errorData && typeof errorData === 'object' && errorData.error
                                                ? errorData.error
                                                : res.errMsg || 'Unknown error',
                                            status: res.statusCode,
                                            context: res,
                                        },
                                    });
                                }
                            },
                            fail: (err) => {
                                resolve({
                                    data: null,
                                    error: {
                                        name: 'FunctionsFetchError',
                                        message: err.errMsg || 'Network request failed',
                                        cause: err,
                                    },
                                });
                            },
                        });
                    });
                }
                const response = yield fetchFn(functionUrl, {
                    method: method || 'POST',
                    // ... existing fetch logic
                    // headers priority is (high to low):
                    // 1. invoke-level headers
                    // 2. client-level headers
                    // 3. default Content-Type header
                    headers: Object.assign(Object.assign(Object.assign({}, _headers), this.headers), headers),
                    body,
                }).catch((fetchError) => {
                    throw new types_1.FunctionsFetchError(fetchError);
                });
                const isRelayError = response.headers.get('x-relay-error');
                if (isRelayError && isRelayError === 'true') {
                    throw new types_1.FunctionsRelayError(response);
                }
                if (!response.ok) {
                    throw new types_1.FunctionsHttpError(response);
                }
                let responseType = ((_a = response.headers.get('Content-Type')) !== null && _a !== void 0 ? _a : 'text/plain').split(';')[0].trim();
                let data;
                if (responseType === 'application/json') {
                    data = yield response.json();
                }
                else if (responseType === 'application/octet-stream') {
                    data = yield response.blob();
                }
                else if (responseType === 'multipart/form-data') {
                    data = yield response.formData();
                }
                else {
                    // default to text
                    data = yield response.text();
                }
                return { data, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
}
exports.FunctionsClient = FunctionsClient;
//# sourceMappingURL=FunctionsClient.js.map