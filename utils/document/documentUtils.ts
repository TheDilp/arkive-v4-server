import fs from "fs";
import { launch } from "puppeteer";

function createHTML(body: string) {
  const css = fs.readFileSync("./public/output.css").toString();

  const finalHtml = `

    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
    <style type="text/css" rel="stylesheet">
    ${css}
    </style>
    </head>
    <body>
    <div class="remirror-editor Prosemirror staticRenderContainer">${body}</div>
    </body>
    </html>
    `;

  return finalHtml;
}

export async function createPDF(body: string) {
  const html = createHTML(body);
  // const outputPath = "output.pdf";

  // Launch a headless browser
  const browser = await launch();
  const page = await browser.newPage();

  await page.setContent(html);

  const buffer = await page.pdf({ format: "A4" });

  // Close the browser
  await browser.close();

  return buffer;
}
