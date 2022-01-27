// prefer old unicode hacks for backward compatibility
// https://base64.guru/developers/javascript/examples/unicode-strings
//编码 URI to ASCII
export function utoa(data: string): string {
  return btoa(unescape(encodeURIComponent(data)))
}

//解码 ASCII to URI
export function atou(base64: string): string {
  return decodeURIComponent(escape(atob(base64)))
}
