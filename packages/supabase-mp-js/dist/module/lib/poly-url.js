export class URLSearchParams {
    constructor(init) {
        this.params = {};
        if (!init)
            return;
        if (typeof init === 'string') {
            const qs = init.replace(/^\?/, '');
            if (qs) {
                qs.split('&').forEach((part) => {
                    const [key, val] = part.split('=');
                    if (key)
                        this.params[decodeURIComponent(key)] = decodeURIComponent(val || '');
                });
            }
        }
        else if (typeof init === 'object') {
            Object.keys(init).forEach((key) => {
                this.params[key] = '' + init[key];
            });
        }
    }
    append(key, value) {
        this.params[key] = value;
    }
    set(key, value) {
        this.params[key] = value;
    }
    get(key) {
        return this.params[key] || null;
    }
    has(key) {
        return Object.prototype.hasOwnProperty.call(this.params, key);
    }
    delete(key) {
        delete this.params[key];
    }
    toString() {
        return Object.keys(this.params)
            .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(this.params[k])}`)
            .join('&');
    }
}
export class URL {
    constructor(url, base) {
        this.protocol = '';
        this.hostname = '';
        this.pathname = '';
        // Very basic parser, assumes valid URLs or simple paths
        // In MP, typical authUrl is 'https://project.supabase.co/auth/v1'
        let fullUrl = url;
        if (base) {
            // Simplistic resolution
            fullUrl = base.replace(/\/$/, '') + '/' + url.replace(/^\//, '');
        }
        this._href = fullUrl;
        const match = fullUrl.match(/^([a-z]+:)\/\/([^/]+)(.*)$/);
        if (match) {
            this.protocol = match[1];
            this.hostname = match[2];
            this.pathname = match[3].split('?')[0] || '/';
            const search = match[3].split('?')[1] || '';
            this.searchParams = new URLSearchParams(search); // Pass raw query string
        }
        else {
            // Handle relative or simple paths if needed, though mostly we deal with absolute
            this.hostname = '';
            this.pathname = fullUrl.split('?')[0];
            const search = fullUrl.split('?')[1] || '';
            this.searchParams = new URLSearchParams(search);
        }
    }
    toString() {
        const qs = this.searchParams.toString();
        return `${this.protocol}//${this.hostname}${this.pathname}${qs ? '?' + qs : ''}`;
    }
}
//# sourceMappingURL=poly-url.js.map