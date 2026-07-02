import SupabaseClient from './SupabaseClient';
export { SupabaseMPAdapter } from './SupabaseMPAdapter';
import { SupabaseMPAdapter } from './SupabaseMPAdapter';
export * from './gotrue-js/src/index';
export { FunctionsHttpError, FunctionsFetchError, FunctionsRelayError, FunctionsError, } from './functions-js/src/index';
export * from './realtime-js/src/index';
export * from './storage-js/src/packages/ResumableUpload';
export { default as SupabaseClient } from './SupabaseClient';
import myfetch from './wefetch';
/**
 * Creates a new Supabase Client.
 */
export const createClient = (supabaseUrl, supabaseKey, options) => {
    var _a, _b;
    const clientOptions = Object.assign({}, options);
    // @ts-ignore
    if (typeof uni !== 'undefined' && !((_a = clientOptions.auth) === null || _a === void 0 ? void 0 : _a.storage)) {
        if (!clientOptions.auth)
            clientOptions.auth = {};
        clientOptions.auth.storage = new SupabaseMPAdapter();
    }
    return new SupabaseClient(supabaseUrl, supabaseKey, Object.assign(Object.assign({}, clientOptions), { global: {
            fetch: ((...args) => myfetch(args[0], args[1])),
            headers: ((_b = options === null || options === void 0 ? void 0 : options.global) === null || _b === void 0 ? void 0 : _b.headers) || {},
        } }));
};
//# sourceMappingURL=index.js.map