const fs = require('fs');

const carImages = {
  "Aura": [
    "https://upload.wikimedia.org/wikipedia/commons/6/62/2017_Nissan_LEAF_%28ZE0_MY17%29_hatchback_%282018-11-02%29_01.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/1/1d/2016_Tesla_Model_S_75_Rear.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/a/ab/2017_Tesla_Model_X_100D_in_Catalina_White%2C_Front_Left%2C_04-30-2023.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/5/5d/2016_Tesla_Model_S_75_Front.jpg"
  ],
  "Haven": [
    "https://upload.wikimedia.org/wikipedia/commons/c/c4/2023_Ferrari_SF90_4.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/6/61/2023_Ferrari_SF90_2.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/d/dc/Ferrari_SF90_Assetto_Fiorano_1.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/b/bf/2024_Ferrari_SF90_XX_Stradale_in_Bianco_Artico%2C_front_left.jpg"
  ],
  "Grandeur": [
    "https://upload.wikimedia.org/wikipedia/commons/6/6d/2020_Bugatti_Chiron_Sport_in_Nocturne_and_Atlantic_Blue%2C_front_left.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/a/ae/2020_Bugatti_Chiron_Super_Sport_300%2B_Prototype.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/f/fa/2020_Bugatti_Chiron_Super_Sport_300%2B_Rear.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/e/ea/2021_Bugatti_Chiron_Super_Sport_8.0_Front.jpg"
  ],
  "Lyric": [
    "https://upload.wikimedia.org/wikipedia/commons/b/b5/2004_Porsche_996_GT3_RSR_%2848452625362%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/b/b4/13_Matthew_Turnbull_%28VIC%29%2C_Porsche_GT3_Cup.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/a/a2/2003_LHD_GT3_RS_white_and_blue_%287921190936%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/9/97/17_WEC_Nur_27.jpg"
  ],
  "Breeze": [
    "https://upload.wikimedia.org/wikipedia/commons/9/9d/2015_Lamborghini_Aventador_LP700-4_Pirelli_Edition_6.5_Rear.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/8/83/2015_Lamborghini_Aventador_LP700-4_Pirelli_Edition_6.5_Front.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/3/38/2012-03-07_Motorshow_Geneva_4614-edit.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/5/5f/2013_Lamborghini_Aventador_LP700-4_BS_O24.jpg"
  ],
  "Volt": [
    "https://upload.wikimedia.org/wikipedia/commons/1/11/2022_McLaren_P1_Spider.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/c/c8/2013_McLaren_P1_MSO_Rear_LC24.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/7/72/FoS20162016_0624_123606AA_%2827851727806%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/d/d6/2018_McLaren_P1_GTR_interior.jpg"
  ],
  "Pulse": [
    "https://upload.wikimedia.org/wikipedia/commons/2/24/2014-03-04_Geneva_Motor_Show_1400_%28cropped%29.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/3/3c/2014-03-04_Geneva_Motor_Show_0905_%28cropped%29.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/9/92/13-06-2008_-_SC08_Bugatti_EB_16.4_Veyron_Interior.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/4/43/2013-03-05_Geneva_Motor_Show_7897_%28cropped%29.JPG"
  ],
  "AuraHybrid": [
    "https://upload.wikimedia.org/wikipedia/commons/d/db/Geneva_International_Motor_Show_2018%2C_Le_Grand-Saconnex_%281X7A9741%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/d/dc/Rolls-Royce_Phantom_VIII_Back_Genf_2018.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/1/1c/2019_Rolls-Royce_Phantom_V12_Automatic_6.75.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/a/aa/Rolls-Royce_Phantom%2C_Geneva_International_Motor_Show_2018%2C_Le_Grand-Saconnex_%281X7A1220%29.jpg"
  ],
  "Prestige": [
    "https://upload.wikimedia.org/wikipedia/commons/0/09/Jesko_Koenigsegg_Genf_2019_1Y7A5892_%28cropped%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/9/9f/GIMS_2019%2C_Le_Grand-Saconnex_%28GIMS0833%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/1/1b/Jesko_Saidar_Spear.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/f/f3/Koenigsegg%2C_GIMS_2019%2C_Le_Grand-Saconnex_%28GIMS1051%29.jpg"
  ],
  "Apex": [
    "https://upload.wikimedia.org/wikipedia/commons/9/9f/2013-03-05_Geneva_Motor_Show_7881.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/c/cc/2017_Pagani_Huayra_BC_in_Verde_McLaren%2C_front_right.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/7/73/2022_Pagani_Huayra_R_in_Matte_Exposed_Carbon_%28no._232%29%2C_rear_left.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/d/d1/2022_Pagani_Huayra_Codalunga.jpg"
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

// Replace images for each car
const carBlocks = content.split('id: \'serene-');
let newContent = carBlocks[0];

for (let i = 1; i < carBlocks.length; i++) {
  const block = carBlocks[i];
  
  // Figure out which car this is
  let matchedKey = null;
  for (const [key, id] of Object.entries(idMap)) {
    if (block.startsWith(id.replace('serene-', ''))) {
      matchedKey = key;
      break;
    }
  }

  if (matchedKey && carImages[matchedKey]) {
    // Find the images array
    const imgsStr = carImages[matchedKey].map(url => `      '${url}'`).join(',\n');
    const newImgsArray = `images: [\n${imgsStr}\n    ],`;
    
    // Replace the images array in this block
    const updatedBlock = block.replace(/images:\s*\[[\s\S]*?\],/, newImgsArray);
    newContent += "id: 'serene-" + updatedBlock;
  } else {
    newContent += "id: 'serene-" + block;
  }
}

fs.writeFileSync('src/data/mockData.ts', newContent);
console.log('Images updated successfully!');