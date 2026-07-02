export class SupabaseMPAdapter {
    getItem(key) {
        try {
            return uni.getStorageSync(key);
        }
        catch (e) {
            console.error('Error getting item from storage', e);
            return null;
        }
    }
    setItem(key, value) {
        try {
            uni.setStorageSync(key, value);
        }
        catch (e) {
            console.error('Error setting item to storage', e);
        }
    }
    removeItem(key) {
        try {
            uni.removeStorageSync(key);
        }
        catch (e) {
            console.error('Error removing item from storage', e);
        }
    }
}
//# sourceMappingURL=SupabaseMPAdapter.js.map