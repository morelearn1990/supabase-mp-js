/**
 * PostgREST 错误友好提示系统
 * 将晦涩的 PostgREST 错误转换为开发者友好的中文提示
 */
interface PostgrestError {
    code?: string;
    message?: string;
    details?: string;
    hint?: string;
}
interface FriendlyError extends PostgrestError {
    friendlyMessage?: string;
    suggestion?: string;
}
/**
 * 增强 PostgREST 错误，添加友好提示
 */
export declare function enhancePostgrestError(error: PostgrestError | null, httpStatus?: number): FriendlyError | null;
/**
 * 在控制台打印友好的错误信息（开发模式）
 */
export declare function logFriendlyError(error: FriendlyError, context?: string): void;
export {};
//# sourceMappingURL=error-hints.d.ts.map