const {execSync} = require('node:child_process');
const redirects = require('./redirects.js');

const hasFullHistory = (() => {
  try {
    return execSync('git rev-parse --is-shallow-repository', {stdio: ['ignore', 'pipe', 'ignore']})
      .toString()
      .trim() === 'false';
  } catch (e) {
    return false;
  }
})();

const embeddedFlag = () => ({
  name: 'mw-embedded-flag',
  injectHtmlTags: () => ({
    headTags: [
      {
        tagName: 'script',
        innerHTML: 'try{if(window.parent!==window)document.documentElement.setAttribute("data-embedded","")}catch(e){}'
      }
    ]
  })
});

/** @type {import('@docusaurus/types').Config} */
module.exports = {
  title: 'MistWarp Docs',
  tagline: 'Guides and reference for the MistWarp editor, extensions, packager and backend.',
  url: 'https://mistwarp.org',
  baseUrl: '/docs/',
  trailingSlash: true,
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw'
    }
  },
  favicon: 'favicon.ico',
  organizationName: 'MistWarp',
  projectName: 'docs',
  clientModules: [
    require.resolve('./src/clientModules/spotlight-key.js')
  ],
  themeConfig: {
    navbar: {
      title: 'MistWarp Docs',
      hideOnScroll: false,
      items: [
        {type: 'docSidebar', sidebarId: 'using', label: 'Using MistWarp', position: 'left'},
        {type: 'docSidebar', sidebarId: 'extensions', label: 'Extensions', position: 'left'},
        {type: 'docSidebar', sidebarId: 'packager', label: 'Packager', position: 'left'},
        {type: 'docSidebar', sidebarId: 'contributing', label: 'Contributing', position: 'left'},
        {type: 'docSidebar', sidebarId: 'backend', label: 'Backend', position: 'left'},
        {type: 'search', position: 'right'},
        {href: 'https://github.com/MistWarp/docs', label: 'GitHub', position: 'right', className: 'mw-navbar-github'}
      ]
    },
    docs: {
      sidebar: {
        autoCollapseCategories: true
      }
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 3
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true
    },
    prism: {
      theme: require('./code-themes/light'),
      darkTheme: require('./code-themes/dark')
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          editUrl: 'https://github.com/MistWarp/docs/edit/master/',
          breadcrumbs: true,
          showLastUpdateTime: hasFullHistory
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ],
  plugins: [
    embeddedFlag,
    './plugins/search-index.js',
    ['@docusaurus/plugin-client-redirects', {redirects}]
  ]
};
