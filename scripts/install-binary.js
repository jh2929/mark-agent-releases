const fs = require('fs');
const path = require('path');
const https = require('https');
const os = require('os');

const platform = os.platform();
let binaryName = 'mark';

// We map all platforms to 'mark' for Linux since we are packaging it now, 
// but define it dynamically for future extensions
if (platform === 'win32') binaryName = 'mark-windows.exe';
if (platform === 'darwin') binaryName = 'mark-macos';

// For simplicity, download 'mark' (the Linux binary) if no win/mac binaries are present
const downloadName = (platform === 'linux') ? 'mark' : 'mark'; 

const destPath = path.join(__dirname, '..', 'bin', binaryName);

const url = `https://github.com/jh2929/mark-agent-releases/releases/latest/download/${downloadName}`;

console.log(`Downloading MARK-0 binary from: ${url}`);

function download(url, dest) {
  const file = fs.createWriteStream(dest);
  https.get(url, (response) => {
    if (response.statusCode === 302 || response.statusCode === 301) {
      download(response.headers.location, dest);
      return;
    }
    if (response.statusCode !== 200) {
      console.error(`Failed to download binary: Status code ${response.statusCode}`);
      process.exit(1);
    }
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      try {
        fs.chmodSync(dest, '755');
      } catch (e) {}
      console.log('MARK-0 binary downloaded successfully.');
    });
  }).on('error', (err) => {
    fs.unlink(dest, () => {});
    console.error(`Error downloading binary: ${err.message}`);
    process.exit(1);
  });
}

download(url, destPath);
