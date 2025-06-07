const fs = require('fs');
const path = require('path');

// A minimal valid 1x1 transparent PNG
const base64PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../src/icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate icons for different sizes
const sizes = [16, 32, 48, 128];
const pngBuffer = Buffer.from(base64PNG, 'base64');

sizes.forEach(size => {
    const iconPath = path.join(iconsDir, `icon${size}.png`);
    fs.writeFileSync(iconPath, pngBuffer);
    console.log(`Created ${iconPath}`);
}); 