const fs = require('fs');
const path = require('path');
const https = require('https');
const os = require('os');

const platform = os.platform();
let binaryName = 'mark';

if (platform === 'win32') binaryName = 'mark-windows.exe';
if (platform === 'darwin') binaryName = 'mark-macos';

const downloadName = (platform === 'linux') ? 'mark' : 'mark'; 

const destPath = path.join(__dirname, '..', 'bin', binaryName);

const url = `https://github.com/jh2929/mark-agent-releases/releases/latest/download/${downloadName}`;

console.log(`Downloading MARK-0 binary from: ${url}`);

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        download(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download binary: Status code ${response.statusCode}`));
        return;
      }
      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        try {
          fs.chmodSync(dest, '755');
        } catch (e) {}
        console.log('MARK-0 binary downloaded successfully.');
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

download(url, destPath)
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(`Error downloading binary: ${err.message}`);
    process.exit(1);
  });
