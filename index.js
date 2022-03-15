const fetch = require('node-fetch');
const args = process.argv;
(async ()=>{
    let url = args.find(arg=>arg.includes('--url'))
    url = !!url && url.split('=')[1] || '';
    let words = args.find(arg=>arg.includes('--words'));
    words = !!words && !!words.split('=')[1] && words.split('=')[1] || [];
    if (!!url){
        await fetch(url)
            .then(data=> data.text())
            .then(docs=>{
                let bodyData = /<body.*?>([\s\S]*)<\/body>/.exec(docs)[1];
                if (!!bodyData.split('window.__NUXT_')[0]) {
                    bodyData = bodyData.split('window.__NUXT_')[0];
                }
                bodyData = bodyData.replace(/<[^>]*>/mgi,'');
                words = words.split(',').map(word=>word.trim());
                words.forEach(word => {
                    let wordMatch = docs.match(new RegExp(`${word}`,'g'));
                    console.log(`${word} => `,!!wordMatch && wordMatch.length || 0);
                });
            });
    }else{
        console.log("Enter Valid Url");
    }
})();

// run node index.js --url="https://anatta.io" --words="THIS, is, an, Apple"