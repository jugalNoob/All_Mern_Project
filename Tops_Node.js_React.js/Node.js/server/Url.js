//https://nodejs.org/api/url.html

const url = new URL('https://user:pass@my.site.com:3000/dir/page?query=123#frag');
const url = new URL('https://username:password@www.example.com:8080/path/page.html?search=test#section');
const url = new URL('/path/page.html?search=test#section', 'https://example.com:8080');

console.log(url.href);        // 'https://username:password@www.example.com:8080/path/page.html?search=test#section'
console.log(url.protocol);    // 'https:'
console.log(url.username);    // 'username'
console.log(url.password);    // 'password'
console.log(url.host);        // 'www.example.com:8080'
console.log(url.hostname);    // 'www.example.com'
console.log(url.port);        // '8080'
console.log(url.pathname);    // '/path/page.html'
console.log(url.search);      // '?search=test'
console.log(url.searchParams); // URLSearchParams { 'search' => 'test' }
console.log(url.hash);        // '#section'
console.log(url.origin);      // 'https://www.example.com:8080'
console.log(myURL.href);
// Prints https://xn--1xa.example.com/foo
console.log(myURL.origin);
// Prints https://xn--1xa.example.com 
console.log({
  href: url.href,
  origin: url.origin,
  protocol: url.protocol,
  username: url.username,
  password: url.password,
  host: url.host,
  hostname: url.hostname,
  port: url.port,
  pathname: url.pathname,
  search: url.search,
  searchParams: Array.from(url.searchParams.entries()),
  hash: url.hash,
  toString: url.toString(),
  toJSON: url.toJSON()
});


// 🧱 URL.parse() (used to exist in older Node.js)


const { parse } = require('url');
const parsedUrl = parse('https://example.com:8080/path?search=test#section');

console.log(parsedUrl.hostname);  // 'example.com'
console.log(parsedUrl.path);      // '/path?search=test'







// 💡 URL.createObjectURL(blob) & URL.revokeObjectURL(url)
// 🧠 Browser Only, not available in Node.js.



const blob = new Blob(["Hello, world!"], { type: "text/plain" });
const objectUrl = URL.createObjectURL(blob);
console.log(objectUrl); // blob:http://example.com/...
URL.revokeObjectURL(objectUrl); // Clean up


// 🧪 URL.canParse(input[, base]) (browser-only)


console.log(URL.canParse('https://example.com')); // true
console.log(URL.canParse('/path', 'https://example.com')); // true
console.log(URL.canParse('not a url')); // false


// Class: URLPattern      -------------------------->>
new URLPattern()
new URLPattern(string[, baseURL][, options])
new URLPattern(obj[, baseURL][, options])
urlPattern.exec(input[, baseURL])
urlPattern.test(input[, baseURL])