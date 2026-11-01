const fs = require('node:fs');
const path = require('node:path');

const loader = /src[\\/]theme[\\/]SearchBar[\\/]pagefind\.js$/;
const unusedBundles = /^pagefind-(ui|component-ui|modular-ui|highlight)\./;

const docPages = outDir => fs.readdirSync(outDir, {recursive: true})
    .filter(file => file.endsWith('index.html') && !file.startsWith('pagefind'))
    .map(file => ({file, content: fs.readFileSync(path.join(outDir, file), 'utf8')}))
    .filter(page => page.content.includes('theme-doc-markdown'))
    .map(page => ({
        url: `/${page.file.split(path.sep).join('/').replace(/index\.html$/, '')}`,
        content: page.content
    }));

module.exports = function searchIndex() {
    return {
        name: 'mw-search-index',
        configureWebpack(config, isServer) {
            return isServer ? {module: {rules: [{test: loader, parser: {exprContextCritical: false}}]}} : {};
        },
        async postBuild({outDir}) {
            const pagefind = await import('pagefind');
            const {index, errors} = await pagefind.createIndex({
                rootSelector: '.theme-doc-markdown',
                excludeSelectors: ['.hash-link'],
                forceLanguage: 'en'
            });
            if (!index) throw new Error(`Pagefind could not start: ${errors.join(', ')}`);
            const pages = docPages(outDir);
            for (const page of pages) {
                const added = await index.addHTMLFile({url: page.url, content: page.content});
                if (added.errors.length) throw new Error(`Pagefind could not index ${page.url}: ${added.errors.join(', ')}`);
            }
            const written = await index.writeFiles({outputPath: path.join(outDir, 'pagefind')});
            if (written.errors.length) throw new Error(`Pagefind could not write the index: ${written.errors.join(', ')}`);
            await pagefind.close();
            for (const file of fs.readdirSync(written.outputPath)) {
                if (unusedBundles.test(file)) fs.rmSync(path.join(written.outputPath, file));
            }
            console.log(`[search] Indexed ${pages.length} pages into ${path.relative(process.cwd(), written.outputPath)}`);
        }
    };
};
