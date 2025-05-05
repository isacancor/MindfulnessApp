export function ensureHttps(url) {
    if (
        url &&
        !/^https?:\/\//i.test(url) &&
        /\.\w{2,}/.test(url) // .com, .org, etc.
    ) {
        return `https://${url}`;
    }
    return url;
}
