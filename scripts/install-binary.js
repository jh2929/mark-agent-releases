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

const pkg = require('../package.json');
const url = `https://github.com/jh2929/mark-agent-cli/releases/download/v${pkg.version}/${downloadName}`;

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
      const totalBytes = parseInt(response.headers['content-length'], 10);
      let downloadedBytes = 0;
      
      response.on('data', (chunk) => {
        downloadedBytes += chunk.length;
        if (totalBytes) {
          const percent = ((downloadedBytes / totalBytes) * 100).toFixed(1);
          process.stdout.write(`\rDownloading: ${percent}% (${(downloadedBytes / 1024 / 1024).toFixed(1)} MB / ${(totalBytes / 1024 / 1024).toFixed(1)} MB)`);
        } else {
          process.stdout.write(`\rDownloading: ${(downloadedBytes / 1024 / 1024).toFixed(1)} MB`);
        }
      });

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('\nMARK-0 binary downloaded successfully.');
        try {
          fs.chmodSync(dest, '755');
        } catch (e) {}
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
    console.error(`\nError downloading binary: ${err.message}`);
    process.exit(1);
  });
