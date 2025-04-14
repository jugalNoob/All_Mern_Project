✅ 1. new Console(stdout[, stderr][, ignoreErrors])
Custom console logging to file or stream


const fs = require('fs');
const { Console } = require('console');

const output = fs.createWriteStream('out.log');
const errorOutput = fs.createWriteStream('err.log');

const customConsole = new Console(output, errorOutput);
customConsole.log('This goes to out.log');
customConsole.error('This goes to err.log');
✅ 2. new Console(options)
Alternative style using options object


const custom = new Console({
  stdout: process.stdout,
  stderr: process.stderr,
  ignoreErrors: true
});
custom.log('Hello from custom console!');
✅ 3. console.assert(value[, ...message])
Only logs if the value is falsy


console.assert(1 === 1, 'This won’t show');
console.assert(1 === 2, 'Assertion failed: 1 is not 2');
✅ 4. console.clear()
Clears the console


console.clear();
✅ 5. console.count([label]) & console.countReset([label])

console.count('loop');
console.count('loop');
console.countReset('loop');
console.count('loop'); // starts again from 1
✅ 6. console.debug(data[, ...args])
Alias for console.log


console.debug('This is a debug message');
✅ 7. console.dir(obj[, options])
Detailed object inspection


const obj = { name: 'Jugal', nested: { key: 'value' } };
console.dir(obj, { depth: null, colors: true });
✅ 8. console.dirxml(...data)
Browser focused — same as console.log in Node.js


console.dirxml({ name: 'Node.js' });
✅ 9. console.error([data][, ...args])
Prints to stderr


console.error('This is an error!');
✅ 10. console.group([...label]), console.groupCollapsed(), console.groupEnd()

console.group('Main Group');
console.log('Inside group');
console.groupCollapsed('Collapsed Subgroup');
console.log('Inside collapsed group');
console.groupEnd(); // ends collapsed group
console.groupEnd(); // ends main group
✅ 11. console.info(...)
Alias of console.log()


console.info('Some info');
✅ 12. console.log(...)
Standard output


console.log('Logging a value:', 123);
✅ 13. console.table(tabularData[, properties])
Pretty prints objects or arrays as tables


console.table([
  { name: 'Alice', age: 22 },
  { name: 'Bob', age: 25 }
]);

// With specific properties
console.table({ a: 1, b: 2, c: 3 }, ['a', 'c']);
✅ 14. console.time([label]), console.timeEnd([label]), console.timeLog([label][, ...data])

console.time('process');
for (let i = 0; i < 1e6; i++) {} // dummy load
console.timeLog('process', 'Halfway');
console.timeEnd('process');
✅ 15. console.trace([message][, ...args])
Shows stack trace

js
Copy
Edit
function demo() {
  console.trace('Stack trace here');
}
demo();
✅ 16. console.warn(...)
Prints warning to stderr


console.warn('This is a warning');

console.log('--- Console Showcase ---');
console.assert(false, 'Assertion failed');
console.count('run');
console.count('run');
console.countReset('run');
console.count('run');

console.debug('Debug message');
console.dir({ name: 'Jugal', age: 22 }, { colors: true });
console.error('Something went wrong!');
console.group('Process Group');
console.log('Grouped message');
console.groupEnd();

console.info('Info log');
console.table([{ a: 1, b: 2 }, { a: 3, b: 4 }]);

console.time('timer');
for (let i = 0; i < 1e6; i++) {}
console.timeEnd('timer');

console.trace('Trace this path');
console.warn('Watch out!');
