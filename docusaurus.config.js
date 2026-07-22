/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'MistWarp Documentation',
  tagline: 'A comprehensive guide to MistWarp - the advanced Scratch modification platform',
  url: 'https://warp.mistium.com',
  baseUrl: '/docs/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'favicon.ico',
  organizationName: 'MistWarp',
  projectName: 'docs',
  trailingSlash: true,
  clientModules: [
    require.resolve('./src/clientModules/spotlight-key.js'),
    require.resolve('./src/clientModules/sidebar-toggle.js'),
  ],
  themeConfig: {
    navbar: {
      title: '',
      items: [
        {
          type: 'dropdown',
          label: 'Use MistWarp',
          position: 'left',
          items: [
            {to: '/getting-started/introduction', label: 'Getting Started'},
            {to: '/editor/interface', label: 'Using the Editor'},
            {to: '/blocks/overview', label: 'Blocks Reference'},
            {to: '/extensions/overview', label: 'Extensions'},
            {to: '/advanced/cloud-variables', label: 'Advanced Features'}
          ]
        },
        {
          type: 'dropdown',
          label: 'Build & Extend',
          position: 'left',
          items: [
            {to: '/building-extensions/introduction', label: 'Building Extensions'},
            {to: '/packager/overview', label: 'Packager'},
            {to: '/api-reference/overview', label: 'API Reference'}
          ]
        },
        {
          type: 'dropdown',
          label: 'Contribute',
          position: 'left',
          items: [
            {to: '/contributing/overview', label: 'Contributing'},
            {to: '/internals/overview', label: 'Architecture & Internals'}
          ]
        }
      ],
    },
    algolia: {
      // This is all supposed to be public
      appId: 'HORQ9E5CCA',
      apiKey: 'c3873ce4208edb896a31bb3e7c2cbdad',
      indexName: 'mistwarp',
      translations: {
        button: {
          buttonText: 'Search docs',
          buttonAriaLabel: 'Search docs',
        },
      },
    },
    colorMode: {
      // The editor syncs the docs to its own theme, so no in-page toggle.
      disableSwitch: true,
      respectPrefersColorScheme: true,
    },
    prism: {
      theme: require('./code-themes/light'),
      darkTheme: require('./code-themes/dark'),
    },
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
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
