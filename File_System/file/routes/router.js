
const express=require("express")
const fs = require('fs')
const si = require('systeminformation');
const router=express.Router()
const path = require('path');



router.get("/" , (req,res)=>{
    res.send("Hello World")
  })




// create a file and read file syystem path

router.post('/create-file', (req, res) => {
    const { fileName, content } = req.body;

    // Validate input
    if (!fileName || !content) {
        return res.status(400).json({ error: 'fileName and content are required!' });
    }

 

    // Write content to the file
    fs.writeFile(fileName, content, (err) => {
        if (err) {
            console.error('Error creating file:', err);
            return res.status(500).json({ error: 'Failed to create file' });
        }
        res.status(200).json({ message: `File '${fileName}' created successfully!` });
    });
});



// delete file system  ......................

router.delete('/delete-file', async (req, res) => {
    const { fileName } = req.body;

    if (!fileName) {
        return res.status(400).json({ error: 'fileName is required!' });
    }

    try {
        await fs.unlink(fileName);
        res.status(200).json({ message: `File '${fileName}' deleted successfully!` });
    } catch (err) {
        console.error('Error deleting file:', err);
        if (err.code === 'ENOENT') {
            return res.status(404).json({ error: `File '${fileName}' not found.` });
        }
        res.status(500).json({ error: 'Failed to delete file' });
    }
})



// readfile system  ......................................



router.post('/reads', async (req, res) => {
    const { fileName } = req.body;

    if (!fileName) {
        return res.status(400).json({ error: 'File name is required!' });
    }

    try {
        // Set the directory where your files are stored (e.g., 'files' directory)
        const filePath = path.join(__dirname, 'files', fileName); // Use path.join to form the file path

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: `File '${fileName}' not found.` });
        }

        // Read the file content
        const data = await fs.promises.readFile(filePath, 'utf8');

        // Send the content and file path in the response
        res.status(200).json({ content: data, filePath: filePath });
    } catch (err) {
        console.error('Error reading file:', err);
        res.status(500).json({ error: 'Failed to read the file.' });
    }
});






/////////// ::::::::::::: ======== Storage :::::::::::::::

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




module.exports=router