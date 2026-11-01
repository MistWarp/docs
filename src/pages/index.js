import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {SearchLauncher} from '@theme/SearchBar';
import styles from './index.module.css';

const sections = [
    {
        title: 'Using MistWarp',
        to: '/getting-started/introduction',
        description: 'Learn the editor, every block category, and the features MistWarp adds to Scratch.',
        links: [
            {label: 'Quick start', to: '/getting-started/quick-start'},
            {label: 'The editor', to: '/editor/interface'},
            {label: 'Blocks', to: '/blocks/overview'},
            {label: 'Advanced features', to: '/advanced/overview'}
        ]
    },
    {
        title: 'Extensions',
        to: '/extensions/overview',
        description: 'Add blocks from the extension library, or write your own in JavaScript.',
        links: [
            {label: 'Using extensions', to: '/extensions/overview'},
            {label: 'Building extensions', to: '/building-extensions/introduction'},
            {label: 'API reference', to: '/api-reference/overview'}
        ]
    },
    {
        title: 'Packager',
        to: '/packager/overview',
        description: 'Turn a project into a single HTML file, a zip, or a desktop app.',
        links: [
            {label: 'Overview', to: '/packager/overview'},
            {label: 'Embedding', to: '/packager/embedding'},
            {label: 'Commercial use', to: '/packager/commercial-use'}
        ]
    },
    {
        title: 'Contributing',
        to: '/contributing/overview',
        description: 'Build MistWarp from source, run the tests, and learn how the editor is put together.',
        links: [
            {label: 'Building and running', to: '/contributing/building-running'},
            {label: 'Guidelines', to: '/contributing/guidelines'},
            {label: 'Editor internals', to: '/internals/overview'}
        ]
    },
    {
        title: 'Backend',
        to: '/backend/overview',
        description: 'How mistwarp-api handles accounts, storage, payments and moderation.',
        links: [
            {label: 'Overview', to: '/backend/overview'},
            {label: 'Configuration', to: '/backend/configuration'},
            {label: 'Projects and storage', to: '/backend/storage'}
        ]
    }
];

const popular = [
    {label: 'Cloud variables', to: '/advanced/cloud-variables'},
    {label: 'URL parameters', to: '/advanced/url-parameters'},
    {label: 'Custom stage size', to: '/advanced/custom-stage-size'},
    {label: 'Keyboard shortcuts', to: '/editor/shortcuts'},
    {label: 'Code mode', to: '/editor/code-mode/overview'},
    {label: 'Unsandboxed extensions', to: '/building-extensions/unsandboxed'}
];

export default function Home() {
    return (
        <Layout
            title="MistWarp documentation"
            description="Guides and reference for the MistWarp editor, extensions, packager and backend."
        >
            <main className={styles.page}>
                <header className={styles.intro}>
                    <Heading as="h1" className={styles.title}>MistWarp documentation</Heading>
                    <p className={styles.lead}>
                        Guides and reference for the MistWarp editor, extensions, packager, and the code behind them.
                        New here? Start with the <Link to="/getting-started/introduction">introduction</Link>.
                    </p>
                    <SearchLauncher className={styles.search} />
                </header>

                <section className={styles.sections} aria-label="Sections">
                    {sections.map(section => (
                        <article key={section.title} className={styles.card}>
                            <Heading as="h2" className={styles.cardTitle}>
                                <Link to={section.to}>{section.title}</Link>
                            </Heading>
                            <p className={styles.cardText}>{section.description}</p>
                            <ul className={styles.cardLinks}>
                                {section.links.map(link => (
                                    <li key={link.to}><Link to={link.to}>{link.label}</Link></li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </section>

                <section className={styles.popular}>
                    <Heading as="h2" className={styles.popularTitle}>Popular pages</Heading>
                    <ul className={styles.popularList}>
                        {popular.map(link => (
                            <li key={link.to}><Link to={link.to}>{link.label}</Link></li>
                        ))}
                    </ul>
                </section>
            </main>
        </Layout>
    );
}
