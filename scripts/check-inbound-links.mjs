import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const build = path.join(root, 'build');
const listFile = path.join(import.meta.dirname, 'inbound-links.json');
const write = process.argv.includes('--write');

const findScratchGui = () => {
    if (process.env.SCRATCH_GUI_DIR) {
        const dir = path.resolve(process.env.SCRATCH_GUI_DIR);
        if (fs.existsSync(path.join(dir, 'src/lib/help/index.js'))) return dir;
        console.error(`SCRATCH_GUI_DIR is ${dir}, which is not a scratch-gui checkout.`);
        process.exit(1);
    }
    for (let dir = root; dir !== path.dirname(dir); dir = path.dirname(dir)) {
        const candidate = path.join(dir, 'scratch-gui');
        if (fs.existsSync(path.join(candidate, 'src/lib/help/index.js'))) return candidate;
    }
    return null;
};

const sourceFiles = dir => fs.readdirSync(dir, {recursive: true, withFileTypes: true})
    .filter(entry => entry.isFile() && /\.(jsx?|tsx?|mjs|html)$/.test(entry.name))
    .map(entry => path.join(entry.parentPath, entry.name))
    .filter(file => !/[\\/](addons|packager)[\\/]/.test(path.relative(dir, file)));

const normalize = link => {
    const [, pathPart, anchor] = link.match(/^([^?#]*)(?:\?[^#]*)?(?:#(.*))?$/);
    const bare = pathPart.replace(/^\/docs(?=\/|$)/, '').replace(/^\/?/, '/');
    const page = bare.endsWith('/') ? bare : `${bare}/`;
    return anchor ? `${page}#${anchor}` : page;
};

const extract = gui => {
    const found = new Map();
    const add = (link, file) => {
        const key = normalize(link);
        if (!found.has(key)) found.set(key, path.relative(gui, file));
    };
    const help = path.join(gui, 'src/lib/help/index.js');
    for (const [, docsPath] of fs.readFileSync(help, 'utf8').matchAll(/docsPath:\s*'([^']+)'/g)) add(docsPath, help);
    const docsLink = path.join(gui, 'src/components/tw-documentation-link/documentation-link.jsx');
    const pages = fs.readFileSync(docsLink, 'utf8').match(/DOCS_PAGES\s*=\s*\{([^}]*)\}/);
    if (pages) for (const [, page] of pages[1].matchAll(/:\s*'([^']+)'/g)) add(page, docsLink);
    const patterns = [
        /\$\{DOCS_BASE\}(\/[\w\-/#]*)/g,
        /mistwarp\.org\/docs(\/[\w\-/#]*)/g,
        /['"`](\/docs(?:\/[\w\-/#]*)?)['"`]/g
    ];
    for (const file of sourceFiles(path.join(gui, 'src'))) {
        const text = fs.readFileSync(file, 'utf8');
        for (const pattern of patterns) for (const [, link] of text.matchAll(pattern)) add(link, file);
    }
    return found;
};

const pageFile = page => path.join(build, page, 'index.html');

const target = link => {
    const [page, anchor] = link.split('#');
    if (!fs.existsSync(pageFile(page))) return {ok: false, reason: 'no page'};
    let html = fs.readFileSync(pageFile(page), 'utf8');
    const redirect = html.match(/http-equiv="refresh" content="0; url=([^"]+)"/);
    let final = page;
    if (redirect) {
        final = normalize(redirect[1]).split('#')[0];
        if (!fs.existsSync(pageFile(final))) return {ok: false, reason: `redirects to missing ${final}`};
        html = fs.readFileSync(pageFile(final), 'utf8');
    }
    if (anchor && !html.includes(`id="${anchor}"`)) return {ok: false, reason: `${final} has no #${anchor}`};
    return {ok: true, redirect: redirect ? final : null};
};

if (!fs.existsSync(path.join(build, 'index.html'))) {
    console.error('No build found. Run npm run build first.');
    process.exit(1);
}

const committed = JSON.parse(fs.readFileSync(listFile, 'utf8'));
const gui = findScratchGui();
const links = new Map(committed.links.map(link => [link, 'inbound-links.json']));

if (gui) {
    const extracted = extract(gui);
    const missing = [...extracted.keys()].filter(link => !links.has(link));
    for (const [link, file] of extracted) links.set(link, file);
    if (write) {
        committed.links = [...links.keys()].sort();
        fs.writeFileSync(listFile, `${JSON.stringify(committed, null, 2)}\n`);
        console.log(`Wrote ${committed.links.length} links to ${path.relative(root, listFile)}`);
    } else if (missing.length) {
        console.log(`${missing.length} links in ${gui} are not in inbound-links.json yet. Run npm run check -- --write to add them.`);
    }
    console.log(`Read ${extracted.size} inbound links from ${gui}`);
} else {
    console.log('No scratch-gui checkout found, so only the committed list is checked.');
}

const failures = [];
let redirects = 0;
for (const [link, source] of links) {
    const result = target(link);
    if (!result.ok) failures.push(`${link} (${source}): ${result.reason}`);
    else if (result.redirect) redirects += 1;
}

if (failures.length) {
    console.error(`${failures.length} inbound links do not resolve:\n  ${failures.join('\n  ')}`);
    console.error('Keep the page at that path, or add a redirect in redirects.js.');
    process.exit(1);
}
console.log(`All ${links.size} inbound links resolve (${redirects} through redirects).`);
