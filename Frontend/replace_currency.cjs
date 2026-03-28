const fs = require('fs');
const path = require('path');

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
          }
          if (!--pending) done(null, results);
        }
      });
    });
  });
}

walk('src', function(err, results) {
  if (err) throw err;
  results.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    if (content.includes('.toLocaleString()')) {
      content = content.replace(/\.toLocaleString\(\)/g, ".toLocaleString('en-IN')");
      changed = true;
    }
    if (content.includes('$$')) {
      content = content.replace(/\$\$\{/g, '?${');
      changed = true;
    }
    if (content.includes('$')) {
        let newContent = content.replace(/'\$'/g, "'?'").replace(/"\$"/g, '"?"').replace(/>\$/g, '>?').replace(/> \$/g, '> ?').replace(/`\$/g, '`?');
        if (newContent !== content) {
            content = newContent;
            changed = true;
        }
    }
    
    // special cases for $28,500 formats replacing directly
    content = content.replace(/\$([0-9,]+)/g, '?$1');
    if (fs.readFileSync(file, 'utf8') !== content) changed = true;

    if (changed) {
      fs.writeFileSync(file, content);
      console.log('Updated', file);
    }
  });
});
