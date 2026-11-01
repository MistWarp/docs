let loading = null;

export const loadPagefind = baseUrl => {
    if (!loading) {
        loading = import(/* webpackIgnore: true */ `${baseUrl}pagefind/pagefind.js`)
            .then(async pagefind => {
                await pagefind.options({excerptLength: 22});
                pagefind.init();
                return pagefind;
            })
            .catch(error => {
                loading = null;
                throw error;
            });
    }
    return loading;
};

const sectionLabels = [
    ['/editor/code-mode/', 'Code mode'],
    ['/building-extensions/compiled/', 'Compiled extensions'],
    ['/getting-started/', 'Getting started'],
    ['/editor/', 'The editor'],
    ['/blocks/', 'Blocks'],
    ['/advanced/', 'Advanced features'],
    ['/community/', 'Community site'],
    ['/extensions/', 'Using extensions'],
    ['/building-extensions/', 'Building extensions'],
    ['/api-reference/', 'API reference'],
    ['/packager/', 'Packager'],
    ['/contributing/', 'Contributing'],
    ['/internals/', 'Editor internals'],
    ['/backend/', 'Backend']
];

export const sectionFor = url => {
    const match = sectionLabels.find(([prefix]) => url.startsWith(prefix));
    return match ? match[1] : '';
};

const listHeadings = new Set(['See also', 'In this section', 'Next steps']);

const pageTitle = title => title.replace(/\s*\|\s*MistWarp Docs$/, '');

export const toResult = data => {
    const subResults = (data.sub_results || [])
        .filter(sub => sub.url !== data.url && sub.title !== data.meta.title && !listHeadings.has(sub.title))
        .sort((a, b) => (b.locations || []).length - (a.locations || []).length)
        .slice(0, 3)
        .map(sub => ({url: sub.url, title: sub.title, excerpt: sub.excerpt}));
    return {
        url: data.url,
        title: pageTitle(data.meta.title || data.url),
        section: sectionFor(data.url),
        excerpt: data.excerpt,
        subResults
    };
};
