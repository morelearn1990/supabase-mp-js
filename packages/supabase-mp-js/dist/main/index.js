"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = exports.SupabaseClient = exports.FunctionsError = exports.FunctionsRelayError = exports.FunctionsFetchError = exports.FunctionsHttpError = exports.SupabaseMPAdapter = void 0;
const SupabaseClient_1 = __importDefault(require("./SupabaseClient"));
var SupabaseMPAdapter_1 = require("./SupabaseMPAdapter");
Object.defineProperty(exports, "SupabaseMPAdapter", { enumerable: true, get: function () { return SupabaseMPAdapter_1.SupabaseMPAdapter; } });
const SupabaseMPAdapter_2 = require("./SupabaseMPAdapter");
__exportStar(require("./gotrue-js/src/index"), exports);
var index_1 = require("./functions-js/src/index");
Object.defineProperty(exports, "FunctionsHttpError", { enumerable: true, get: function () { return index_1.FunctionsHttpError; } });
Object.defineProperty(exports, "FunctionsFetchError", { enumerable: true, get: function () { return index_1.FunctionsFetchError; } });
Object.defineProperty(exports, "FunctionsRelayError", { enumerable: true, get: function () { return index_1.FunctionsRelayError; } });
Object.defineProperty(exports, "FunctionsError", { enumerable: true, get: function () { return index_1.FunctionsError; } });
__exportStar(require("./realtime-js/src/index"), exports);
__exportStar(require("./storage-js/src/packages/ResumableUpload"), exports);
var SupabaseClient_2 = require("./SupabaseClient");
Object.defineProperty(exports, "SupabaseClient", { enumerable: true, get: function () { return __importDefault(SupabaseClient_2).default; } });
const wefetch_1 = __importDefault(require("./wefetch"));
/**
 * Creates a new Supabase Client.
 */
const createClient = (supabaseUrl, supabaseKey, options) => {
    var _a, _b;
    const clientOptions = Object.assign({}, options);
    // @ts-ignore
    if (typeof uni !== 'undefined' && !((_a = clientOptions.auth) === null || _a === void 0 ? void 0 : _a.storage)) {
        if (!clientOptions.auth)
            clientOptions.auth = {};
        clientOptions.auth.storage = new SupabaseMPAdapter_2.SupabaseMPAdapter();
    }
    return new SupabaseClient_1.default(supabaseUrl, supabaseKey, Object.assign(Object.assign({}, clientOptions), { global: {
            fetch: ((...args) => (0, wefetch_1.default)(args[0], args[1])),
            headers: ((_b = options === null || options === void 0 ? void 0 : options.global) === null || _b === void 0 ? void 0 : _b.headers) || {},
        } }));
};
exports.createClient = createClient;
//# sourceMappingURL=index.js.map