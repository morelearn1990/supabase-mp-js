interface UploadOptions {
    contentType?: string;
    chunkSize?: number;
    upsert?: boolean;
}
/**
 * Uploads a large file using TUS protocol (Resumable Uploads) in uni-app.
 * This function is tree-shakable (not bound to the main client class).
 *
 * @param url - The bucket URL (e.g. https://xyz.supabase.co/storage/v1/s3)
 * @param headers - Authorization headers (apikey, Authorization)
 * @param filePath - Local file path (uni.chooseMedia result)
 * @param bucketName - Target bucket name
 * @param objectName - Target file path in bucket
 * @param options - Upload options
 */
export declare function uploadLargeFile(supabaseUrl: string, headers: Record<string, string>, filePath: string, bucketName: string, objectName: string, options?: UploadOptions): Promise<{
    data: {
        path: string;
    };
    error: null;
}>;
export {};
//# sourceMappingURL=ResumableUpload.d.ts.map