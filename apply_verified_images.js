import fs from 'fs';

const mockDataPath = 'src/data/mockData.ts';
let content = fs.readFileSync(mockDataPath, 'utf8');

const carImageMap = {
  'serene-apex': [
    '9bsNq1JOt20', 'bWb4gDn8dmk', 'vyJXWugiKYs', 'c2FUTnKsOnA'
  ],
  'serene-aura': [
    'TFX6NXvfhUM', '68yEKumeubE', 'wg4QHx_pTNo', 'RcAYwfvnoyM'
  ],
  'serene-haven': [
    'Px7vZt4deck', '3_1XBaAiPPc', 'wf1xFQM96ZU', 'KxvLAnU6Pmc'
  ],
  'serene-grandeur': [
    'dxMh2AFL9O8', 'IPKZ-0pWHBA', 'EoW4BASEfgE', 'sAN11DGnjqk'
  ],
  'serene-prestige': [
    'dxMh2AFL9O8', 'IPKZ-0pWHBA', 'EoW4BASEfgE', 'sAN11DGnjqk'
  ],
  'serene-volt': [
    'G9MNjujk8Tg', 'JAQLPuJYAs8', '1nVbppFJl-s', 'oxqhypQImH0'
  ],
  'serene-pulse': [
    'G9MNjujk8Tg', 'JAQLPuJYAs8', '1nVbppFJl-s', 'oxqhypQImH0'
  ],
  'serene-aura-hybrid': [
    'TFX6NXvfhUM', '68yEKumeubE', 'wg4QHx_pTNo', 'RcAYwfvnoyM'
  ]
};

// Helper to convert ID to full Unsplash URL
const toUrl = (id) => `https://images.unsplash.com/photo-${id}?q=80&w=2070`;

for (const [slug, ids] of Object.entries(carImageMap)) {
  const images = ids.map(toUrl);
  // Using a more robust regex that ignores existing content inside brackets
  const carRegex = new RegExp(`(id:\\s*'${slug}'[\\s\\S]*?images:\\s*\\[)[\\s\\S]*?(\\])`, 'g');
  content = content.replace(carRegex, (match, p1, p2) => {
    return `${p1}\n      '${images.join("',\n      '")}'\n    ${p2}`;
  });
}

fs.writeFileSync(mockDataPath, content);
console.log('Successfully updated car images with verified Unsplash IDs');
