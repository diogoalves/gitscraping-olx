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
        
        await Deno.writeTextFile(output, `${now},${url},${title},${subtitle},${price}
`, {append: true});
    }
    
    // Step 3: Clean downloaded json
    await removeFile(filename)

} catch(error) {
    console.log(error);
}

