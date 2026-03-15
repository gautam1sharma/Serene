const fs = require('fs');
let html = fs.readFileSync('new frontend/customer dashboard/code.html', 'utf8');
const start = html.indexOf('<main');
const end = html.indexOf('</main>') + 7;
html = html.substring(start, end)
  .replace(/class=/g, 'className=')
  .replace(/for=/g, 'htmlFor=')
  .replace(/<!--/g, '{/*')
  .replace(/-->/g, '*/}')
  .replace(/readonly/g, 'readOnly')
  .replace(/<img([^>]*)>/g, '<img$1 />')
  .replace(/<circle([^>]*)>/g, '<circle$1 />')
  .replace(/<path([^>]*)>/g, '<path$1 />')
  .replace(/<input([^>]*)>/g, '<input$1 />')
  .replace(/viewbox/g, 'viewBox')
  .replace(/stroke-width/g, 'strokeWidth')
  .replace(/stroke-linecap/g, 'strokeLinecap')
  .replace(/stroke-linejoin/g, 'strokeLinejoin')
  .replace(/stroke-dasharray/g, 'strokeDasharray')
  .replace(/clip-rule/g, 'clipRule')
  .replace(/fill-rule/g, 'fillRule');

fs.writeFileSync('test.tsx', `import React from 'react';\n\nexport const Test = () => (\n  ${html}\n);\n`);
console.log('done!');
