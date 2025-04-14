const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, 'example.txt');






// 📄 1. CREATE / WRITE FILE

async function createFile() {
    try {
      await fs.writeFile(filePath, 'Hello, Node.js!');
      console.log('File created successfully.');
    } catch (err) {
      console.error('Error creating file:', err);
    }
  }
  



//   📖 2. READ FILE

async function readFile() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    console.log('File contents:', data);
  } catch (err) {
    console.error('Error reading file:', err);
  }
}
// ✏️ 3. UPDATE FILE (Append or Overwrite)

async function appendToFile() {
  try {
    await fs.appendFile(filePath, '\nAppended content!');
    console.log('Content appended.');
  } catch (err) {
    console.error('Error appending to file:', err);
  }
}

async function updateFile() {
  try {
    await fs.writeFile(filePath, 'Overwritten content.');
    console.log('File updated.');
  } catch (err) {
    console.error('Error updating file:', err);
  }
}


// ❌ 4. DELETE FILE

async function deleteFile() {
  try {
    await fs.unlink(filePath);
    console.log('File deleted.');
  } catch (err) {
    console.error('Error deleting file:', err);
  }
}