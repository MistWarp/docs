module.exports = {
  // Main sidebar with all sections organized
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/introduction',
        'getting-started/installation',
        'getting-started/migrating-from-scratch'
      ]
    },
    {
      type: 'category',
      label: 'Development',
      collapsed: true,
      items: [
        'development/home',
        'development/getting-started',
        'development/project-structure',
        'development/building-running',
        'development/testing',
        'development/contributing',
        {
          type: 'category',
          label: 'Extension Development',
          collapsed: true,
          items: [
            'development/extensions/introduction',
            'development/extensions/hello-world',
            'development/extensions/inputs',
            'development/extensions/async',
            'development/extensions/sandbox',
            'development/extensions/unsandboxed',
            'development/extensions/better-development-server',
            'development/extensions/assorted-apis',
            'development/extensions/utility-apis',
            'development/extensions/vm-api',
            'development/extensions/renderer-api',
            'development/extensions/audio-api',
            'development/extensions/scratch-api',
            'development/extensions/hidden-apis',
            'development/extensions/hats',
            'development/extensions/compatibility',
            'development/extensions/share',
            'development/extensions/docsURI-demo',
            'development/extensions/wrapping-up'
          ]
        },
        {
          type: 'category',
          label: 'Compiled Extensions',
          collapsed: true,
          items: [
            'development/compiled-extensions/overview',
            'development/compiled-extensions/structure',
            'development/compiled-extensions/patching',
            'development/compiled-extensions/first-extension',
            'development/compiled-extensions/advanced'
          ]
        },
        'development/globals',
        'development/scratchx'
      ]
    },
    {
      type: 'category',
      label: 'GUI Internals',
      collapsed: true,
      items: [
        'gui-internals/home',
        'gui-internals/architecture',
        {
          type: 'category',
          label: 'Addons',
          collapsed: true,
          items: [
            'gui-internals/addons/home',
          ]
        },
        {
          type: 'category',
          label: 'Core Components',
          collapsed: true,
          items: [
            'gui-internals/components/gui-component',
            'gui-internals/components/menu-bar',
            'gui-internals/components/blocks',
            'gui-internals/components/stage',
            'gui-internals/components/sprite-selector',
            'gui-internals/components/sound-tab',
            'gui-internals/components/costume-tab',
            'gui-internals/components/modals'
          ]
        },
        {
          type: 'category',
          label: 'Containers',
          collapsed: true,
          items: [
            'gui-internals/containers/overview',
            'gui-internals/containers/gui-container'
          ]
        },
        {
          type: 'category',
          label: 'State Management',
          collapsed: true,
          items: [
            'gui-internals/state/home',
            'gui-internals/state/reducers',
            'gui-internals/state/selectors',
            'gui-internals/state/middleware',
            'gui-internals/state/debugging'
          ]
        },
        {
          type: 'category',
          label: 'Theming & Styling',
          collapsed: true,
          items: [
            'gui-internals/theming/home',
            'gui-internals/theming/accent-colors',
            'gui-internals/theming/gui-themes',
            'gui-internals/theming/block-themes'
          ]
        }
      ]
    },
    {
      type: 'category',
      label: 'Packager',
      collapsed: true,
      items: [
        'packager/home',
        'packager/embedding',
        'packager/commercial-use',
        'packager/dynamic-stage-resize',
        'packager/special-cloud-behaviors',
        'packager/offline'
      ]
    },
    {
      type: 'category',
      label: 'Website Features',
      collapsed: true,
      items: [
        'website/how-it-works',
        'website/embedding',
        'website/javascript',
        'website/turbowarp-blocks',
        'website/url-parameters',
        'website/cloud-variables',
        'website/unshared-projects',
        'website/scratch-accounts',
        'website/cors',
        'website/translate',
        'website/4.4',
        'website/donate',
        'website/return',
        {
          type: 'category',
          label: 'Settings',
          collapsed: true,
          items: [
            'website/settings/overview',
            'website/settings/custom-stage-size',
            'website/settings/custom-fps',
            'website/settings/infinite-clones',
            'website/settings/remove-fencing',
            'website/settings/high-quality-pen',
            'website/settings/interpolation',
            'website/settings/disable-compiler',
            'website/settings/warp-timer',
            'website/settings/remove-misc-limits'
          ]
        }
      ]
    },
    {
      type: 'category',
      label: 'API Reference',
      collapsed: true,
      items: [
        'api-reference/home',
        'api-reference/overview',
        'api-reference/gui-api',
        'api-reference/vm-api',
        'api-reference/extension-api',
        'api-reference/addon-api',
        'api-reference/events',
        'api-reference/utilities'
      ]
    }
  ]
};
