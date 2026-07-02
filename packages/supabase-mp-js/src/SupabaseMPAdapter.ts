declare const uni: any

export class SupabaseMPAdapter {
  getItem(key: string): string | null {
    try {
      return uni.getStorageSync(key)
    } catch (e) {
      console.error('Error getting item from storage', e)
      return null
    }
  }

  setItem(key: string, value: string): void {
    try {
      uni.setStorageSync(key, value)
    } catch (e) {
      console.error('Error setting item to storage', e)
    }
  }

  removeItem(key: string): void {
    try {
      uni.removeStorageSync(key)
    } catch (e) {
      console.error('Error removing item from storage', e)
    }
  }
}
