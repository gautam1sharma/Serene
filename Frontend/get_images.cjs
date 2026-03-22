const https = require('https');
const http = require('http');

function fetchWikiImages(title) {
    return new Promise((resolve) => {
        const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=images&format=json`;
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const parsed = JSON.parse(data);
                const pages = parsed.query.pages;
                let imageTitles = [];
                for (let k in pages) {
                    if (pages[k].images) {
                        imageTitles = pages[k].images
                            .filter(i => i.title.toLowerCase().endsWith('.jpg') || i.title.toLowerCase().endsWith('.jpeg'))
                            .map(i => i.title);
                    }
                }
                
                imageTitles = imageTitles.slice(0, 4);
                if(imageTitles.length === 0) return resolve([]);
                
                const iiUrls = [];
                let count = 0;
                for (let it of imageTitles) {
                    const ii_url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(it)}&prop=imageinfo&iiprop=url&format=json`;
                    https.get(ii_url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (r) => {
                        let ii_data = '';
                        r.on('data', chunk => ii_data += chunk);
                        r.on('end', () => {
                            const ii_parsed = JSON.parse(ii_data);
                            const ipages = ii_parsed.query.pages;
                            for (let ik in ipages) {
                                if (ipages[ik].imageinfo) {
                                    iiUrls.push(ipages[ik].imageinfo[0].url);
                                }
                            }
                            count++;
                            if (count === imageTitles.length) resolve(iiUrls);
                        });
                    });
                }
            });
        });
    });
}

(async () => {
    const cars = {
        'Aura': 'Tesla_Model_S',
        'Haven': 'Ferrari_SF90_Stradale',
        'Grandeur': 'Bugatti_Chiron',
        'Lyric': 'Porsche_911_GT3',
        'Breeze': 'Lamborghini_Aventador',
        'Volt': 'McLaren_P1',
        'Pulse': 'Bugatti_Veyron',
        'AuraHybrid': 'Rolls-Royce_Phantom_VIII',
        'Prestige': 'Koenigsegg_Jesko',
        'Apex': 'Pagani_Huayra'
    };
    const results = {};
    for (const [key, val] of Object.entries(cars)) {
        results[key] = await fetchWikiImages(val);
    }
    console.log(JSON.stringify(results, null, 2));
})();