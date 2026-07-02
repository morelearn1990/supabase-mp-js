var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GoTrueClient, isAuthError } from '../gotrue-js/src/index';
export class SupabaseAuthClient extends GoTrueClient {
    constructor(options) {
        super(options);
        if (typeof uni !== 'undefined' && typeof uni.onAppShow === 'function') {
            uni.onAppShow(() => __awaiter(this, void 0, void 0, function* () {
                yield this._recoverAndRefresh();
                if (this.autoRefreshToken) {
                    this.startAutoRefresh();
                }
            }));
        }
    }
    /**
     * Initializes a WeChat login flow.
     *
     * @param params.code The authorization code from uni.login()
     * @param params.functionName Optional. The name of the Edge Function to call. Defaults to 'wechat-login'.
     * @param params.options Optional. fetch options.
     */
    signInWithWechat(params) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { code, functionName = 'wechat-login', options } = params;
                console.log('[signInWithWechat] Starting WeChat login, code:', code.substring(0, 10) + '...');
                const projectUrl = this.url.replace(/\/auth\/v1$/, '');
                const functionUrl = `${projectUrl}/functions/v1/${functionName}`;
                console.log('[signInWithWechat] Function URL:', functionUrl);
                const res = yield this.fetch(functionUrl, Object.assign({ method: 'POST', headers: Object.assign(Object.assign({}, this.headers), { 'Content-Type': 'application/json' }), body: JSON.stringify({ code }) }, options));
                console.log('[signInWithWechat] Response status:', res.status, res.statusText);
                const responseData = (yield res.json());
                console.log('[signInWithWechat] Response data:', {
                    hasUser: !!((_a = responseData.data) === null || _a === void 0 ? void 0 : _a.user),
                    hasSession: !!((_b = responseData.data) === null || _b === void 0 ? void 0 : _b.session),
                    hasError: !!responseData.error,
                });
                if (!res.ok || responseData.error) {
                    console.error('[signInWithWechat] Login failed:', responseData.error);
                    return {
                        data: { user: null, session: null },
                        error: responseData.error || new Error('WeChat login failed'),
                    };
                }
                const { session = null, user = null } = responseData.data || {};
                if (session) {
                    console.log('[signInWithWechat] Session received, saving...', {
                        access_token: ((_c = session.access_token) === null || _c === void 0 ? void 0 : _c.substring(0, 20)) + '...',
                        expires_at: session.expires_at,
                        expires_in: session.expires_in,
                    });
                    yield this._saveSession(session);
                    console.log('[signInWithWechat] Session saved successfully');
                    this._notifyAllSubscribers('SIGNED_IN', session);
                    console.log('[signInWithWechat] Subscribers notified');
                }
                else {
                    console.warn('[signInWithWechat] No session in response!');
                }
                console.log('[signInWithWechat] Login completed successfully');
                return { data: { user, session }, error: null };
            }
            catch (error) {
                console.error('[signInWithWechat] Exception caught:', error);
                if (isAuthError(error)) {
                    return { data: { user: null, session: null }, error };
                }
                throw error;
            }
        });
    }
}
//# sourceMappingURL=SupabaseAuthClient.js.map