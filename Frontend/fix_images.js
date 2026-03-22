import fs from 'fs';

const mockDataPath = 'src/data/mockData.ts';
let content = fs.readFileSync(mockDataPath, 'utf8');

// Use more reliable/common Unsplash car IDs
const carImages = {
  'serene-aura': [
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=2070', // Ferrari-esque
    'https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=2070',
    'https://images.unsplash.com/photo-1542362567-b052ef39db92?q=80&w=2070',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070'
  ],
  'serene-grandeur': [
    'https://images.unsplash.com/photo-1631214500115-598fc2cb882e?q=80&w=2070', // Rolls/Bentley
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070',
    'https://images.unsplash.com/photo-1606016159991-d853b0e3b6d0?q=80&w=2070',
    'https://images.unsplash.com/photo-1618172193622-ae2d025f4032?q=80&w=2070'
  ]
};

for (const [id, images] of Object.entries(carImages)) {
  const carRegex = new RegExp(`(id:\\s*'${id}'[\\s\\S]*?images:\\s*\\[)[\\s\\S]*?(\\])`, 'g');
  content = content.replace(carRegex, (match, p1, p2) => {
    return `${p1}\n      '${images.join("',\n      '")}'\n    ${p2}`;
  });
}

fs.writeFileSync(mockDataPath, content);
console.log('Fixed broken image links in mockData.ts');
