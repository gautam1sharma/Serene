const fs = require('fs');
const path = require('path');

function replaceHashLinks(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes('node_modules')) {
        replaceHashLinks(fullPath);
      }
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('href="#"')) {
        content = content.replace(/href="#"/g, 'href="#!" onClick={(e) => e.preventDefault()}');
        fs.writeFileSync(fullPath, content);
        console.log("Fixed links in", fullPath);
      }
    }
  }
}

replaceHashLinks('./src');