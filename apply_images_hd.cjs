const fs = require('fs');

const carImages = {
  "Aura": [
    "https://plus.unsplash.com/premium_photo-1736043345534-47745872fee0?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8dGVzbGElMjBtb2RlbCUyMHN8ZW58MHx8fHwxNzczNTcxNTQwfDA&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8dGVzbGElMjBtb2RlbCUyMHN8ZW58MHx8fHwxNzczNTcxNTQwfDA&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1676856577533-1e8099932f7b?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8dGVzbGElMjBtb2RlbCUyMHN8ZW58MHx8fHwxNzczNTcxNTQwfDA&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1536700503339-1e4b06520771?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8dGVzbGElMjBtb2RlbCUyMHN8ZW58MHx8fHwxNzczNTcxNTQwfDA&ixlib=rb-4.1.0&w=1200&fit=crop&q=80"
  ],
  "Haven": [
    "https://plus.unsplash.com/premium_photo-1737182592338-76f632c413c6?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8ZmVycmFyaSUyMHNmOTB8ZW58MHx8fHwxNzczNTcxNTQxfDA&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1675426513824-25a43c3ae0ba?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8ZmVycmFyaSUyMHNmOTB8ZW58MHx8fHwxNzczNTcxNTQxfDA&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1609138315745-4e44ac3bbd8d?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8ZmVycmFyaSUyMHNmOTB8ZW58MHx8fHwxNzczNTcxNTQxfDA&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1675426513962-1db7e4c707c3?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8ZmVycmFyaSUyMHNmOTB8ZW58MHx8fHwxNzczNTcxNTQxfDA&ixlib=rb-4.1.0&w=1200&fit=crop&q=80"
  ],
  "Grandeur": [
    "https://plus.unsplash.com/premium_photo-1725458936432-9d494b514951?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8YnVnYXR0aSUyMGNoaXJvbnxlbnwwfHx8fDE3NzM1NzE1NDJ8MA&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1627454820516-dc767bcb4d3e?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8YnVnYXR0aSUyMGNoaXJvbnxlbnwwfHx8fDE3NzM1NzE1NDJ8MA&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1627454820903-9646d6ca61f5?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8YnVnYXR0aSUyMGNoaXJvbnxlbnwwfHx8fDE3NzM1NzE1NDJ8MA&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1635975229704-0a420e777a56?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8YnVnYXR0aSUyMGNoaXJvbnxlbnwwfHx8fDE3NzM1NzE1NDJ8MA&ixlib=rb-4.1.0&w=1200&fit=crop&q=80"
  ],
  "Lyric": [
    "https://plus.unsplash.com/premium_photo-1667596089161-c4088d5e7842?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8cG9yc2NoZSUyMDkxMSUyMGd0M3xlbnwwfHx8fDE3NzM1NzE1NDJ8MA&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8cG9yc2NoZSUyMDkxMSUyMGd0M3xlbnwwfHx8fDE3NzM1NzE1NDJ8MA&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1688398658141-d39eda099217?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8cG9yc2NoZSUyMDkxMSUyMGd0M3xlbnwwfHx8fDE3NzM1NzE1NDJ8MA&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1722389515045-d1bb8c22286b?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8cG9yc2NoZSUyMDkxMSUyMGd0M3xlbnwwfHx8fDE3NzM1NzE1NDJ8MA&ixlib=rb-4.1.0&w=1200&fit=crop&q=80"
  ],
  "Breeze": [
    "https://plus.unsplash.com/premium_photo-1700315374384-e1b7b1135487?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8bGFtYm9yZ2hpbmklMjBhdmVudGFkb3J8ZW58MHx8fHwxNzczNTcxNTQzfDA&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1621135802920-133df287f89c?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8bGFtYm9yZ2hpbmklMjBhdmVudGFkb3J8ZW58MHx8fHwxNzczNTcxNTQzfDA&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1618846446712-a4eda2adc05f?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8bGFtYm9yZ2hpbmklMjBhdmVudGFkb3J8ZW58MHx8fHwxNzczNTcxNTQzfDA&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519245659620-e859806a8d3b?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8bGFtYm9yZ2hpbmklMjBhdmVudGFkb3J8ZW58MHx8fHwxNzczNTcxNTQzfDA&ixlib=rb-4.1.0&w=1200&fit=crop&q=80"
  ],
  "Volt": [
    "https://plus.unsplash.com/premium_photo-1687598084021-78885204fb2e?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8bWNsYXJlbiUyMHAxfGVufDB8fHx8MTc3MzU3MTU0M3ww&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1516298252535-cf2ac5147f9b?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8bWNsYXJlbiUyMHAxfGVufDB8fHx8MTc3MzU3MTU0M3ww&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1592199299806-e7349699f6a9?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8bWNsYXJlbiUyMHAxfGVufDB8fHx8MTc3MzU3MTU0M3ww&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1664713907576-1c00104ca1ba?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8bWNsYXJlbiUyMHAxfGVufDB8fHx8MTc3MzU3MTU0M3ww&ixlib=rb-4.1.0&w=1200&fit=crop&q=80"
  ],
  "Pulse": [
    "https://plus.unsplash.com/premium_photo-1680392933691-ddb5a59a2a5f?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8YXVkaSUyMHI4fGVufDB8fHx8MTc3MzU3MTU0NHww&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8YXVkaSUyMHI4fGVufDB8fHx8MTc3MzU3MTU0NHww&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1616617535619-55e3db07bd5b?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8YXVkaSUyMHI4fGVufDB8fHx8MTc3MzU3MTU0NHww&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1616617774879-179911b66e75?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8YXVkaSUyMHI4fGVufDB8fHx8MTc3MzU3MTU0NHww&ixlib=rb-4.1.0&w=1200&fit=crop&q=80"
  ],
  "AuraHybrid": [
    "https://plus.unsplash.com/premium_photo-1669075651967-d2518f4c6e15?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8cm9sbHMlMjByb3ljZXxlbnwwfHx8fDE3NzM1NzE1NDV8MA&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1624804269473-828dcc30a210?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8cm9sbHMlMjByb3ljZXxlbnwwfHx8fDE3NzM1NzE1NDV8MA&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8cm9sbHMlMjByb3ljZXxlbnwwfHx8fDE3NzM1NzE1NDV8MA&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1581966451257-a5c7c5afa833?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8cm9sbHMlMjByb3ljZXxlbnwwfHx8fDE3NzM1NzE1NDV8MA&ixlib=rb-4.1.0&w=1200&fit=crop&q=80"
  ],
  "Prestige": [
    "https://plus.unsplash.com/premium_photo-1701012304365-ef1fb838da0b?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8a29lbmlnc2VnZ3xlbnwwfHx8fDE3NzM1NzE1NDZ8MA&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1596906673164-fffb05b8333d?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8a29lbmlnc2VnZ3xlbnwwfHx8fDE3NzM1NzE1NDZ8MA&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1632993950427-44e4c8f90023?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8a29lbmlnc2VnZ3xlbnwwfHx8fDE3NzM1NzE1NDZ8MA&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1698249173956-43c9c3dcd2f3?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8a29lbmlnc2VnZ3xlbnwwfHx8fDE3NzM1NzE1NDZ8MA&ixlib=rb-4.1.0&w=1200&fit=crop&q=80"
  ],
  "Apex": [
    "https://plus.unsplash.com/premium_photo-1671209878097-b4f7285d6811?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8cGFnYW5pfGVufDB8fHx8MTc3MzU3MTU0Nnww&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1635974631051-d21dbfdc4c8b?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8cGFnYW5pfGVufDB8fHx8MTc3MzU3MTU0Nnww&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1603182128451-2903f01e2ea8?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8cGFnYW5pfGVufDB8fHx8MTc3MzU3MTU0Nnww&ixlib=rb-4.1.0&w=1200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1635974064616-b09505293645?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8cGFnYW5pfGVufDB8fHx8MTc3MzU3MTU0Nnww&ixlib=rb-4.1.0&w=1200&fit=crop&q=80"
  ]
};

let content = fs.readFileSync('src/data/mockData.ts', 'utf-8');

const idMap = {
  "Aura": "serene-aura",
  "Haven": "serene-haven",
  "Grandeur": "serene-grandeur",
  "Lyric": "serene-lyric",
  "Breeze": "serene-breeze",
  "Volt": "serene-volt",
  "Pulse": "serene-pulse",
  "AuraHybrid": "serene-aura-hybrid",
  "Prestige": "serene-prestige",
  "Apex": "serene-apex"
};

const carBlocks = content.split('id: \'serene-');
let newContent = carBlocks[0];

for (let i = 1; i < carBlocks.length; i++) {
  const block = carBlocks[i];
  
  let matchedKey = null;
  for (const [key, id] of Object.entries(idMap)) {
    if (block.startsWith(id.replace('serene-', ''))) {
      matchedKey = key;
      break;
    }
  }

  if (matchedKey && carImages[matchedKey]) {
    const imgsStr = carImages[matchedKey].map(url => `      '${url}'`).join(',\n');
    const newImgsArray = `images: [\n${imgsStr}\n    ],`;
    
    const updatedBlock = block.replace(/images:\s*\[[\s\S]*?\],/, newImgsArray);
    newContent += "id: 'serene-" + updatedBlock;
  } else {
    newContent += "id: 'serene-" + block;
  }
}

fs.writeFileSync('src/data/mockData.ts', newContent);
console.log('Premium Unsplash images updated successfully!');
