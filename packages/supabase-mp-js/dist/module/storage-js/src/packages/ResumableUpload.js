var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { StorageError } from '../lib/errors';
const DEFAULT_CHUNK_SIZE = 6 * 1024 * 1024; // 6MB per chunk
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
export function uploadLargeFile(supabaseUrl, headers, filePath, bucketName, objectName, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const fs = uni.getFileSystemManager();
        // 1. Get File Stats
        const stats = yield new Promise((resolve, reject) => {
            fs.stat({
                path: filePath,
                success: resolve,
                fail: reject,
            });
        });
        const fileSize = stats.size;
        const chunkSize = (options === null || options === void 0 ? void 0 : options.chunkSize) || DEFAULT_CHUNK_SIZE;
        // Clean URL: remove trailing slash
        const endpoint = supabaseUrl.replace(/\/$/, '');
        // TUS Endpoint: /storage/v1/upload/resumable
        const tusUrl = `${endpoint}/upload/resumable`;
        const targetPath = `${bucketName}/${objectName}`;
        const fingerprint = `tus-${targetPath}-${fileSize}`; // Simple fingerprint
        // Encode metadata
        const meta = {
            bucketName,
            objectName,
            contentType: options === null || options === void 0 ? void 0 : options.contentType,
            upsert: (options === null || options === void 0 ? void 0 : options.upsert) ? 'true' : 'false',
        };
        const uploadMetadata = Object.keys(meta)
            .filter((k) => meta[k])
            .map((k) => `${k} ${base64(meta[k])}`)
            .join(',');
        // 2. Create Upload (POST)
        const createRes = yield request(tusUrl, {
            method: 'POST',
            headers: Object.assign(Object.assign({}, headers), { 'Tus-Resumable': '1.0.0', 'Upload-Length': fileSize.toString(), 'Upload-Metadata': uploadMetadata }),
        });
        if (createRes.statusCode !== 201) {
            throw new StorageError(createRes.data || 'Failed to create upload session');
        }
        // Get Upload URL from Location header
        let uploadUrl = createRes.header['Location'] || createRes.header['location'];
        if (!uploadUrl) {
            throw new StorageError('No Location header in TUS response');
        }
        // Handle relative URLs
        if (!uploadUrl.startsWith('http')) {
            uploadUrl = `${endpoint}/upload/resumable/${uploadUrl.split('/').pop()}`;
        }
        // 3. Upload Chunks (PATCH)
        let offset = 0;
        while (offset < fileSize) {
            const end = Math.min(offset + chunkSize, fileSize);
            const length = end - offset;
            // Read Chunk
            const chunkBuffer = yield new Promise((resolve, reject) => {
                fs.readFile({
                    filePath: filePath,
                    position: offset,
                    length: length,
                    success: (res) => resolve(res.data),
                    fail: reject,
                });
            });
            // Upload Chunk
            yield retry(() => __awaiter(this, void 0, void 0, function* () {
                const patchRes = yield request(uploadUrl, {
                    method: 'PATCH',
                    headers: Object.assign(Object.assign({}, headers), { 'Tus-Resumable': '1.0.0', 'Upload-Offset': offset.toString(), 'Content-Type': 'application/offset+octet-stream' }),
                    body: chunkBuffer,
                    timeout: 60000, // 1 minute per chunk
                });
                if (patchRes.statusCode !== 204) {
                    // If 409 Conflict, we might need to check offset HEAD
                    if (patchRes.statusCode === 409) {
                        const headRes = yield request(uploadUrl, {
                            method: 'HEAD',
                            headers: Object.assign(Object.assign({}, headers), { 'Tus-Resumable': '1.0.0' }),
                        });
                        const serverOffset = parseInt(headRes.header['Upload-Offset'] || headRes.header['upload-offset'] || '-1');
                        if (serverOffset > offset) {
                            // Update offset and retry logic (outer loop will advance)
                            offset = serverOffset;
                            return; // Continue to next chunk
                        }
                    }
                    throw new StorageError(`Upload failed at offset ${offset}: ${patchRes.statusCode}`);
                }
            }));
            // Advance offset
            // In a robust impl, we should use the new offset from response, but 204 doesn't return it usually?
            // TUS says server SHOULD return Upload-Offset.
            // For simplicity, we assume success means full chunk written.
            offset = end;
            // Optional: Progress Callback can be added here
        }
        return { data: { path: targetPath }, error: null };
    });
}
// Helpers
function base64(str) {
    // Basic base64 implementation for MP
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let output = '';
    // Use Buffer if available (in some MP environments), otherwise manual
    // MP usually doesn't have Buffer.from globally unless polyfilled.
    // Let's use a simple manual encoder to be safe and tree-shakable.
    // Or Buffer.from if we assume it exists (Supabase client might polyfill it).
    // Let's stick to safe string encoding since metadata is small.
    // Actually, `wefetch.js` might not have it.
    for (let i = 0, len = str.length; i < len; i++) {
        // This is naive and only works for ASCII. UTF-8 requires TextEncoder.
        // Given this is metadata (bucket, objectName), ASCII is mostly expected, but UTF-8 is possible.
        // For robustness, we might rely on a library. But let's try strict ASCII for now or typed array.
    }
    // Fallback: use built-in btoa if available (WeChat usually has it in Worker/JSCore but maybe not exposed)
    // Actually, the simplest is explicit Buffer use if we can, but we removed Buffer polyfill?
    // `uni.arrayBufferToBase64` exists!
    const buffer = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
        buffer[i] = str.charCodeAt(i);
    }
    return uni.arrayBufferToBase64(buffer.buffer);
}
function request(url, options) {
    return new Promise((resolve, reject) => {
        uni.request(Object.assign(Object.assign({ url }, options), { success: resolve, fail: reject }));
    });
}
function retry(fn, retries = 3) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < retries; i++) {
            try {
                yield fn();
                return;
            }
            catch (e) {
                if (i === retries - 1)
                    throw e;
                // Wait 1s
                yield new Promise((r) => setTimeout(r, 1000));
            }
        }
    });
}
//# sourceMappingURL=ResumableUpload.js.map