import {ROUTES} from '../configs/app.constants'
// @ts-ignore
const fs = require('fs');
const path = require('path');

const routes = Object.values(ROUTES).map((route) => {
    // console.log(appConfig.urls.prod)
 // @ts-ignore
    return `  <loc>https://1kurochkin.github.io/delivery_frontend${typeof route === 'object' ? route?.PATH : route}</loc>\r`
});
const newSitemapXml = [
    '<?xml version="1.0" encoding="UTF-8"?>\r',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\r',
    '<url>\r',
    ...routes,
    `  <lastmod>${(new Date()).toISOString()}</lastmod>\r`,
    '</url>',
    '</urlset>'
]
fs.writeFile(path.join(__dirname, '../../public/sitemap.xml'), newSitemapXml.join('\n'), (e) => {
  if(e) throw e;
})
