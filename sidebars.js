const section = (label, overview, items, collapsed = true) => ({
    type: 'category',
    label,
    link: {type: 'doc', id: overview},
    collapsed,
    items
});

const group = (label, items) => ({
    type: 'category',
    label,
    collapsible: true,
    collapsed: true,
    items
});

module.exports = {
    using: [
        section('Getting started', 'getting-started/introduction', [
            'getting-started/installation',
            'getting-started/quick-start',
            'getting-started/migrating-from-scratch',
            'getting-started/migrating-from-turbowarp'
        ], false),
        section('The editor', 'editor/interface', [
            'editor/menu-bar',
            'editor/stage',
            'editor/sprites',
            'editor/costumes',
            'editor/sounds',
            'editor/workspace',
            'editor/blocks-palette',
            'editor/variables',
            'editor/project-management',
            'editor/backpack',
            'editor/find-bar',
            'editor/bookmarks',
            'editor/shortcuts',
            'editor/settings',
            'editor/addons',
            'editor/themes',
            'editor/debugger',
            'editor/variable-manager',
            'editor/restore-points',
            'editor/git',
            'editor/collaboration'
        ]),
        section('Code mode', 'editor/code-mode/overview', [
            'editor/code-mode/applying',
            'editor/code-mode/extensions',
            'editor/code-mode/debugging'
        ]),
        section('Blocks', 'blocks/overview', [
            'blocks/motion',
            'blocks/looks',
            'blocks/sound',
            'blocks/events',
            'blocks/control',
            'blocks/sensing',
            'blocks/operators',
            'blocks/variables',
            'blocks/my-blocks',
            'blocks/mistwarp-extras'
        ]),
        section('Advanced features', 'advanced/overview', [
            'advanced/javascript',
            'advanced/cloud-variables',
            'advanced/url-parameters',
            'advanced/embedding',
            'advanced/unshared-projects',
            'advanced/cors',
            group('Runtime options', [
                'advanced/custom-fps',
                'advanced/interpolation',
                'advanced/custom-stage-size',
                'advanced/high-quality-pen',
                'advanced/warp-timer',
                'advanced/infinite-clones',
                'advanced/remove-fencing',
                'advanced/remove-limits',
                'advanced/disable-compiler'
            ])
        ]),
        section('Community site', 'community/overview', [
            'community/discovery-and-spaces',
            'community/releases-and-feedback',
            'community/safety-and-account-controls'
        ])
    ],
    extensions: [
        section('Using extensions', 'extensions/overview', [
            'extensions/mistwarp-blocks',
            'extensions/patching',
            'extensions/custom-extension',
            group('Scratch extensions', [
                'extensions/music',
                'extensions/pen',
                'extensions/video-sensing',
                'extensions/face-sensing',
                'extensions/text-to-speech',
                'extensions/translate'
            ]),
            group('Hardware', [
                'extensions/makey-makey',
                'extensions/micro-bit',
                'extensions/ev3',
                'extensions/boost',
                'extensions/wedo2',
                'extensions/force-and-acceleration'
            ])
        ], false),
        section('Building extensions', 'building-extensions/introduction', [
            'building-extensions/in-editor',
            'building-extensions/hello-world',
            'building-extensions/inputs',
            'building-extensions/async',
            'building-extensions/sandbox',
            'building-extensions/unsandboxed',
            'building-extensions/hats',
            'building-extensions/compatibility',
            'building-extensions/custom-c-blocks',
            'building-extensions/block-switches',
            'building-extensions/advanced-block-customization',
            'building-extensions/better-development-server',
            'building-extensions/assorted-apis',
            'building-extensions/share',
            'building-extensions/wrapping-up'
        ], false),
        section('Compiled extensions', 'building-extensions/compiled/overview', [
            'building-extensions/compiled/structure',
            'building-extensions/compiled/first-extension',
            'building-extensions/compiled/patching',
            'building-extensions/compiled/advanced'
        ]),
        section('API reference', 'api-reference/overview', [
            'api-reference/extension-api',
            'api-reference/vm-api',
            'api-reference/runtime',
            'api-reference/threads',
            'api-reference/events',
            'api-reference/block-registration',
            'api-reference/utilities',
            'api-reference/renderer-api',
            'api-reference/audio-api',
            'api-reference/gui-api',
            'api-reference/addon-api'
        ])
    ],
    packager: [
        'packager/overview',
        'packager/embedding',
        'packager/commercial-use',
        'packager/dynamic-stage-resize',
        'packager/special-cloud-behaviors',
        'packager/offline',
        'packager/editor-integration'
    ],
    contributing: [
        'contributing/overview',
        'contributing/project-structure',
        'contributing/building-running',
        'contributing/testing',
        'contributing/guidelines',
        'contributing/deploying',
        section('Editor internals', 'internals/overview', [
            'internals/architecture',
            'internals/components',
            'internals/containers',
            'internals/state',
            'internals/theming',
            'internals/addons-system'
        ], false)
    ],
    backend: [
        'backend/overview',
        'backend/configuration',
        'backend/accounts',
        'backend/safety',
        'backend/payments',
        'backend/storage',
        'backend/community'
    ]
};
