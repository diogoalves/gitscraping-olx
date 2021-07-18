import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts"
import { format } from "https://deno.land/std@0.101.0/datetime/mod.ts";
import { removeFile } from 'https://deno.land/x/flat/mod.ts'


// Step 1: Initialize var and read the downloaded page
const now = format(new Date(), "dd/MM/yyyy HH:mm:ss.SSS");
const output = 'honda-fit-jundiai.csv'
const filename = Deno.args[0]

try {
    const data = await Deno.readTextFile(filename);
    const doc = new DOMParser().parseFromString(data, 'text/html');
    const ads = doc.querySelector("#ad-list").querySelectorAll("a");

    // Step 2. Write extracted fields
    for (const ad of ads) {
        const url = ad.getAttribute('href');
        const title = ad.querySelector('h2').getAttribute('title');
        const subtitle = ad.querySelector('span[color="dark"]').textContent;
        const price = ad.querySelector('span[color="graphite"]').textContent;
        
        // Step 2.1. Follow ad url to get more info
        const res = await fetch(url);
        const subdata = await res.text();
        const subdocument = new DOMParser().parseFromString(subdata, 'text/html');
        const description = subdocument.querySelectorAll('span[color="dark"][font-weight="400"]')[1].textContent.replace(/(\r\n|\n|\r)/gm," ");
        const model = subdocument.querySelector('a[href="https://sp.olx.com.br/sao-paulo-e-regiao/regiao-de-jundiai/autos-e-pecas/carros-vans-e-utilitarios/honda/fit"]').textContent
        const year = subdocument.querySelector('a[href^="https://sp.olx.com.br/sao-paulo-e-regiao/regiao-de-jundiai/autos-e-pecas/carros-vans-e-utilitarios/honda/fit/"]').textContent

        await Deno.writeTextFile(output, `${now},${url},${title},${subtitle},${price},"${description}",${model},${year}
`, {append: true});
    }
    
    // Step 3: Clean downloaded json
    await removeFile(filename)

} catch(error) {
    console.log(error);
}

