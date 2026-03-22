import fs from 'fs';

const mockDataPath = 'src/data/mockData.ts';
let content = fs.readFileSync(mockDataPath, 'utf8');

const carImageMap = {
  'serene-apex': [
    'https://images.unsplash.com/photo-1627454820903-9646d6ca61f5?fm=jpg&q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1661198550180-2ba17bfe108c?fm=jpg&q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1635975231394-61336236b7ba?fm=jpg&q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1688417438893-7d4b4da14a87?fm=jpg&q=80&w=1600&auto=format&fit=crop'
  ],
  'serene-aura': [
    'https://images.unsplash.com/photo-1714538701027-790deaef725b?fm=jpg&q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1731317913350-df41a6c3ab3b?fm=jpg&q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1710929234539-19289cfc5c1c?fm=jpg&q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1720347408602-adcef90d115c?fm=jpg&q=80&w=1600&auto=format&fit=crop'
  ],
  'serene-haven': [
    'https://images.unsplash.com/photo-1740098159737-73673d741ebb?fm=jpg&q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1619114664520-1d1dbf9f224c?fm=jpg&q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618213221550-c32da08997db?fm=jpg&q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1570374910698-6db3d787e6fb?fm=jpg&q=80&w=1600&auto=format&fit=crop'
  ],
  'serene-grandeur': [
    'https://images.unsplash.com/photo-1702558306309-6d51217f9bed?fm=jpg&q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1728458602463-294dd50623e2?fm=jpg&q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1695334692673-1b7176b32407?fm=jpg&q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1695334650970-21f964219461?fm=jpg&q=80&w=1600&auto=format&fit=crop'
  ],
  'serene-prestige': [
    'https://images.unsplash.com/photo-1702558306309-6d51217f9bed?fm=jpg&q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1728458602463-294dd50623e2?fm=jpg&q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1695334692673-1b7176b32407?fm=jpg&q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1695334650970-21f964219461?fm=jpg&q=80&w=1600&auto=format&fit=crop'
  ],
  'serene-volt': [
    'https://images.unsplash.com/photo-1716558964076-1abe07448abf?fm=jpg&q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617704548623-340376564e68?fm=jpg&q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1698514326382-603bb5b273de?fm=jpg&q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1716558964038-79542bf366af?fm=jpg&q=80&w=1600&auto=format&fit=crop'
  ],
  'serene-pulse': [
    'https://images.unsplash.com/photo-1716558964076-1abe07448abf?fm=jpg&q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617704548623-340376564e68?fm=jpg&q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1698514326382-603bb5b273de?fm=jpg&q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1716558964038-79542bf366af?fm=jpg&q=80&w=1600&auto=format&fit=crop'
  ],
  'serene-aura-hybrid': [
    'https://images.unsplash.com/photo-1714538701027-790deaef725b?fm=jpg&q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1731317913350-df41a6c3ab3b?fm=jpg&q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1710929234539-19289cfc5c1c?fm=jpg&q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1720347408602-adcef90d115c?fm=jpg&q=80&w=1600&auto=format&fit=crop'
  ]
};

for (const [slug, images] of Object.entries(carImageMap)) {
  const carRegex = new RegExp(`(id:\\s*'${slug}'[\\s\\S]*?images:\\s*\\[)[\\s\\S]*?(\\])`, 'g');
  content = content.replace(carRegex, (match, p1, p2) => {
    return `${p1}\n      '${images.join("',\n      '")}'\n    ${p2}`;
  });
}

fs.writeFileSync(mockDataPath, content);
console.log('Successfully applied verified full Unsplash URLs to mockData.ts');
