const moved = {
    '/getting-started/editor-tour': '/editor/interface',
    '/editor/custom-blocks': '/blocks/my-blocks',
    '/editor/packaging': '/packager/overview',
    '/building-extensions/apis/scratch-api': '/api-reference/extension-api',
    '/building-extensions/apis/utility-apis': '/api-reference/utilities',
    '/building-extensions/apis/vm-api': '/api-reference/vm-api',
    '/building-extensions/apis/audio-api': '/api-reference/audio-api',
    '/building-extensions/apis/renderer-api': '/api-reference/renderer-api',
    '/internals/themes': '/internals/theming'
};

const sectionRoots = {
    '/getting-started': '/getting-started/introduction',
    '/editor': '/editor/interface',
    '/editor/code-mode': '/editor/code-mode/overview',
    '/blocks': '/blocks/overview',
    '/advanced': '/advanced/overview',
    '/community': '/community/overview',
    '/extensions': '/extensions/overview',
    '/building-extensions': '/building-extensions/introduction',
    '/building-extensions/apis': '/api-reference/overview',
    '/building-extensions/compiled': '/building-extensions/compiled/overview',
    '/api-reference': '/api-reference/overview',
    '/packager': '/packager/overview',
    '/contributing': '/contributing/overview',
    '/internals': '/internals/overview',
    '/backend': '/backend/overview'
};

module.exports = Object.entries({...moved, ...sectionRoots}).map(([from, to]) => ({from, to}));
