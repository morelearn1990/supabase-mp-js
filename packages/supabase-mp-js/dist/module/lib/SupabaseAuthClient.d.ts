import { GoTrueClient, AuthResponse } from '../gotrue-js/src/index';
import { SupabaseAuthClientOptions } from './types';
export declare class SupabaseAuthClient extends GoTrueClient {
    constructor(options: SupabaseAuthClientOptions);
    /**
     * Initializes a WeChat login flow.
     *
     * @param params.code The authorization code from uni.login()
     * @param params.functionName Optional. The name of the Edge Function to call. Defaults to 'wechat-login'.
     * @param params.options Optional. fetch options.
     */
    signInWithWechat(params: {
        code: string;
        functionName?: string;
        options?: any;
    }): Promise<AuthResponse>;
}
//# sourceMappingURL=SupabaseAuthClient.d.ts.map