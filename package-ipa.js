const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = process.cwd();
const tempDir = path.join(rootDir, '_build_ipa');
const payloadDir = path.join(tempDir, 'Payload');
const appDir = path.join(payloadDir, 'HBcoffee.app');
const outputIpa = path.join(rootDir, 'HBcoffee.ipa');

console.log('--- ĐANG ĐÓNG GÓI HBCOFFEE.IPA ---');

if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
fs.mkdirSync(appDir, { recursive: true });

// Copy essential files
const filesToCopy = ['index.html', 'style.css', 'game.js', 'audio.js', 'manifest.json', 'sw.js'];
filesToCopy.forEach(f => {
  const src = path.join(rootDir, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(appDir, f));
    console.log(`+ Copied: ${f}`);
  }
});

// Copy directories
['images', 'audio'].forEach(dir => {
  const srcDir = path.join(rootDir, dir);
  if (fs.existsSync(srcDir)) {
    fs.cpSync(srcDir, path.join(appDir, dir), { recursive: true });
    console.log(`+ Copied folder: ${dir}`);
  }
});

// Generate Info.plist
const infoPlistContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>vi</string>
    <key>CFBundleDisplayName</key>
    <string>HBcoffee</string>
    <key>CFBundleExecutable</key>
    <string>HBcoffee</string>
    <key>CFBundleIdentifier</key>
    <string>com.hbcoffee.app</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>HBcoffee</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>LSRequiresIPhoneOS</key>
    <true/>
    <key>UIRequiresFullScreen</key>
    <true/>
    <key>UIStatusBarHidden</key>
    <true/>
    <key>UIViewControllerBasedStatusBarAppearance</key>
    <false/>
    <key>UISupportedInterfaceOrientations</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationLandscapeLeft</string>
        <string>UIInterfaceOrientationLandscapeRight</string>
    </array>
    <key>NSAppTransportSecurity</key>
    <dict>
        <key>NSAllowsArbitraryLoads</key>
        <true/>
    </dict>
</dict>
</plist>`;

fs.writeFileSync(path.join(appDir, 'Info.plist'), infoPlistContent, 'utf8');
console.log('+ Created: Info.plist');

// Also create an executable placeholder entry
fs.writeFileSync(path.join(appDir, 'HBcoffee'), '#!/bin/sh\nexec open index.html\n', { mode: 0o755 });

console.log('Payload ready. Compressing to HBcoffee.ipa...');
const outputZip = path.join(rootDir, 'HBcoffee.zip');
if (fs.existsSync(outputIpa)) fs.unlinkSync(outputIpa);
if (fs.existsSync(outputZip)) fs.unlinkSync(outputZip);

// Compress using PowerShell Compress-Archive to .zip then rename to .ipa
try {
  execSync(`powershell -Command "Compress-Archive -Path '${payloadDir}' -DestinationPath '${outputZip}' -Force"`, { stdio: 'inherit' });
  fs.renameSync(outputZip, outputIpa);
  console.log(`\n🎉 HOÀN THÀNH: Đã tạo thành công gói cài đặt iOS: ${outputIpa}`);
} catch (err) {
  console.error('Error compressing IPA:', err);
}

// Clean up temp
if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
