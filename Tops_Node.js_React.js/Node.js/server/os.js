const os = require('os');

console.log("OS Architecture:", os.arch());
console.log("OS Constants:", os.constants);
console.log("CPU Info:", os.cpus());
console.log("Endianness:", os.endianness());
console.log("Free Memory:", os.freemem());
console.log("Home Directory:", os.homedir());
console.log("Hostname:", os.hostname());
console.log("Load Average:", os.loadavg()); // Linux/macOS only
console.log("Network Interfaces:", os.networkInterfaces());
console.log("Platform:", os.platform());
console.log("OS Release:", os.release());
console.log("Temporary Directory:", os.tmpdir());
console.log("Total Memory:", os.totalmem());
console.log("OS Type:", os.type());
console.log("System Uptime:", os.uptime());
console.log("User Info:", os.userInfo());
console.log("OS Version:", os.version());
console.log(os.constants.errno);  // Common error codes like EADDRINUSE
console.log(os.constants.signals); // Signal constants like SIGINT



router.get('/storage', async (req, res) => {
    try {
        const diskData = await si.fsSize();
        console.log(diskData)
        const storage = diskData.map(disk => ({
            mount: disk.mount,
            total: (disk.size / (1024 ** 3)).toFixed(2) + ' GB',
            used: (disk.used / (1024 ** 3)).toFixed(2) + ' GB',
            free: (disk.size - disk.used) / (1024 ** 3).toFixed(2) + ' GB',
            type: disk.type
        }));

        res.json(storage);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch storage information', details: err.message });
    }
});

