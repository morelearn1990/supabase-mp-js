export declare class URLSearchParams {
    private params;
    constructor(init?: string | Record<string, string> | any);
    append(key: string, value: string): void;
    set(key: string, value: string): void;
    get(key: string): string | null;
    has(key: string): boolean;
    delete(key: string): void;
    toString(): string;
}
export declare class URL {
    protocol: string;
    hostname: string;
    pathname: string;
    searchParams: URLSearchParams;
    private _href;
    constructor(url: string, base?: string);
    toString(): string;
}
//# sourceMappingURL=poly-url.d.ts.map