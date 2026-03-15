const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    async function getUnsplash(query) {
        await page.goto(`https://unsplash.com/s/photos/${query}?license=free`);
        await page.waitForTimeout(4000);
        const urls = await page.$$eval('img', imgs => 
            imgs.map(i => i.src)
                .filter(src => src && src.includes('images.unsplash.com/photo-'))
                .map(src => {
                    const url = new URL(src);
                    return url.origin + url.pathname + '?w=1200&q=80&fm=jpg&crop=entropy&cs=tinysrgb';
                })
        );
        return [...new Set(urls)].slice(0, 4);
    }

    const results = {};
    results['Aura'] = await getUnsplash('tesla-model-s');
    results['Haven'] = await getUnsplash('ferrari');
    results['Grandeur'] = await getUnsplash('bugatti');
    results['Lyric'] = await getUnsplash('porsche-911');
    results['Breeze'] = await getUnsplash('lamborghini');
    results['Volt'] = await getUnsplash('mclaren');
    results['Pulse'] = await getUnsplash('audi-r8');
    results['AuraHybrid'] = await getUnsplash('tesla-model-x');
    results['Prestige'] = await getUnsplash('rolls-royce');
    results['Apex'] = await getUnsplash('mercedes-amg');

    console.log(JSON.stringify(results, null, 2));

    await browser.close();
})();