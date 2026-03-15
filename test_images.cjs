const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const getImages = async (query) => {
        await page.goto('https://duckduckgo.com/?q=' + encodeURIComponent(query) + '&iax=images&ia=images');
        await page.waitForTimeout(3000);
        const urls = await page.$$eval('img', imgs => imgs.map(i => i.src).filter(src => src && src.includes('external-content')));
        return urls.slice(0, 4);
    };
    
    const results = {};
    results['Aura'] = await getImages('Tesla Model S Plaid red wallpaper 4k hd');
    results['Haven'] = await getImages('Ferrari SF90 Stradale red wallpaper 4k hd -site:pinterest.com');
    results['Grandeur'] = await getImages('Bugatti Chiron super sport blue wallpaper 4k hd -site:pinterest.com');
    results['Lyric'] = await getImages('Porsche 911 GT3 RS 2024 red wallpaper 4k hd -site:pinterest.com');
    results['Breeze'] = await getImages('Lamborghini Aventador SVJ green wallpaper 4k hd');
    results['Volt'] = await getImages('McLaren P1 orange wallpaper 4k hd');
    results['Pulse'] = await getImages('Aston Martin Valkyrie wallpaper 4k');
    results['AuraHybrid'] = await getImages('Rolls Royce Phantom VIII white 4k wallpaper');
    results['Prestige'] = await getImages('Koenigsegg Jesko Absolut white 4k wallpaper');
    results['Apex'] = await getImages('Pagani Huayra BC blue 4k -site:pinterest.com');
    
    console.log(JSON.stringify(results, null, 2));
    await browser.close();
})();
