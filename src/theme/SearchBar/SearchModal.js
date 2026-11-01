import React, {useEffect, useMemo, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useHistory} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import {containsTerm, loadPagefind, shorterQueries, toResult} from './pagefind';
import {SearchIcon} from './icons';
import styles from './styles.module.css';

const PAGE_SIZE = 8;
const FEW = 3;
const IDLE = {status: 'idle', results: [], fallback: null, total: 0};

const flatten = (results, fallback) => results.flatMap(result => [
    {key: result.url, url: result.url, result, fallback},
    ...result.subResults.map(sub => ({key: sub.url, url: sub.url, sub, result, fallback}))
]);

const findFallback = async (pagefind, term, exclude) => {
    for (const query of shorterQueries(term)) {
        const search = await pagefind.search(query);
        const hits = search.results.filter(hit => !exclude.has(hit.id));
        if (hits.length) return {query, hits};
    }
    return null;
};

const useSearch = (query, baseUrl) => {
    const [state, setState] = useState(IDLE);
    const [limit, setLimit] = useState(PAGE_SIZE);

    useEffect(() => setLimit(PAGE_SIZE), [query]);

    useEffect(() => {
        const term = query.trim();
        if (!term) {
            setState(IDLE);
            return undefined;
        }
        let cancelled = false;
        setState(previous => ({...previous, status: 'loading'}));
        loadPagefind(baseUrl)
            .then(async pagefind => {
                const search = await pagefind.debouncedSearch(term, {}, 120);
                if (cancelled || !search) return;
                const hits = search.results;
                const loaded = await Promise.all(hits.slice(0, Math.max(limit, FEW)).map(hit => hit.data()));
                const exact = loaded.filter(data => containsTerm(data, term));
                const weak = loaded.filter(data => !containsTerm(data, term));
                const exactTotal = hits.length - weak.length;
                const fallback = exactTotal < FEW ?
                    await findFallback(pagefind, term, new Set(hits.map(hit => hit.id))) :
                    null;
                const room = Math.max(limit - exact.length, 0);
                const fallbackPages = fallback ?
                    await Promise.all(fallback.hits.slice(0, room).map(hit => hit.data())) :
                    [];
                if (cancelled) return;
                const close = [...fallbackPages, ...weak].slice(0, room);
                setState({
                    status: 'done',
                    results: exact.slice(0, limit).map(toResult),
                    fallback: close.length ? {query: fallback ? fallback.query : term, results: close.map(toResult)} : null,
                    total: hits.length + (fallback ? fallback.hits.length : 0)
                });
            })
            .catch(() => {
                if (!cancelled) setState({...IDLE, status: 'unavailable'});
            });
        return () => {
            cancelled = true;
        };
    }, [query, limit, baseUrl]);

    return {...state, showMore: () => setLimit(value => value + PAGE_SIZE)};
};

const statusText = (term, search, shown) => {
    if (!term || search.status === 'idle' || search.status === 'loading') return '';
    if (search.status === 'unavailable') return 'Search is unavailable.';
    const exact = search.results.length;
    if (search.fallback && !exact) return `No exact matches for ${term}. Showing close matches for ${search.fallback.query}.`;
    if (search.fallback) return `${exact} ${exact === 1 ? 'page' : 'pages'} found, plus close matches for ${search.fallback.query}.`;
    if (!shown) return `No pages match ${term}.`;
    return `${search.total} ${search.total === 1 ? 'page' : 'pages'} found.`;
};

export default function SearchModal({initialQuery = '', onClose}) {
    const {siteConfig: {baseUrl}} = useDocusaurusContext();
    const history = useHistory();
    const {withBaseUrl} = useBaseUrlUtils();
    const [query, setQuery] = useState(initialQuery);
    const [active, setActive] = useState(0);
    const inputRef = useRef(null);
    const dialogRef = useRef(null);
    const listRef = useRef(null);
    const search = useSearch(query, baseUrl);
    const items = useMemo(() => [
        ...flatten(search.results, false),
        ...(search.fallback ? flatten(search.fallback.results, true) : [])
    ], [search.results, search.fallback]);
    const firstFallback = items.findIndex(item => item.fallback);

    useEffect(() => {
        inputRef.current.focus();
        loadPagefind(baseUrl).catch(() => {});
        const {overflow} = document.body.style;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = overflow;
        };
    }, [baseUrl]);

    useEffect(() => setActive(0), [search.results, search.fallback]);

    useEffect(() => {
        const node = listRef.current && listRef.current.querySelector('[aria-selected="true"]');
        if (node) node.scrollIntoView({block: 'nearest'});
    }, [active]);

    const open = url => {
        onClose();
        history.push(withBaseUrl(url));
    };

    const onKeyDown = event => {
        if (event.key === 'Escape') {
            event.preventDefault();
            onClose();
        } else if (event.key === 'ArrowDown' && items.length) {
            event.preventDefault();
            setActive(index => (index + 1) % items.length);
        } else if (event.key === 'ArrowUp' && items.length) {
            event.preventDefault();
            setActive(index => (index - 1 + items.length) % items.length);
        } else if (event.key === 'Enter' && items[active]) {
            event.preventDefault();
            open(items[active].url);
        } else if (event.key === 'Tab') {
            const focusable = [...dialogRef.current.querySelectorAll('input, button')];
            const index = focusable.indexOf(document.activeElement);
            const next = (index + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
            event.preventDefault();
            focusable[next].focus();
        }
    };

    const optionProps = (item, className) => {
        const index = items.indexOf(item);
        return {
            id: `mw-search-option-${index}`,
            role: 'option',
            'aria-selected': index === active,
            className: clsx(className, index === active && styles.active),
            to: item.url,
            tabIndex: -1,
            onClick: onClose,
            onMouseMove: () => index !== active && setActive(index)
        };
    };

    const term = query.trim();
    const status = statusText(term, search, items.length);

    return createPortal(
        <div className={styles.backdrop} onMouseDown={event => event.target === event.currentTarget && onClose()}>
            <div ref={dialogRef} className={styles.dialog} role="dialog" aria-modal="true" aria-label="Search the docs" onKeyDown={onKeyDown}>
                <div className={styles.field}>
                    <SearchIcon className={styles.fieldIcon} />
                    <input
                        ref={inputRef}
                        className={styles.input}
                        type="search"
                        value={query}
                        onChange={event => setQuery(event.target.value)}
                        placeholder="Search the docs"
                        aria-label="Search the docs"
                        role="combobox"
                        aria-expanded={items.length > 0}
                        aria-controls={items.length ? 'mw-search-results' : undefined}
                        aria-activedescendant={items.length ? `mw-search-option-${active}` : undefined}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        enterKeyHint="go"
                    />
                    <button type="button" className={styles.close} onClick={onClose}>Close</button>
                </div>

                <div className={styles.body} ref={listRef}>
                    {!term && <p className={styles.message}>Search page titles, headings and text across every section.</p>}
                    {term && search.status === 'unavailable' && (
                        <p className={styles.message}>
                            The search index is missing. It is generated by <code>npm run build</code>, so search does not work in <code>npm start</code>.
                        </p>
                    )}
                    {term && search.status === 'done' && !items.length && (
                        <p className={styles.message}>No pages match <strong>{term}</strong>.</p>
                    )}
                    {term && search.status === 'done' && search.fallback && !search.results.length && (
                        <p className={styles.notice}>
                            No exact matches for <strong>{term}</strong>. Showing close matches for <strong>{search.fallback.query}</strong>.
                        </p>
                    )}
                    {items.length > 0 && (
                        <ul id="mw-search-results" className={styles.results} role="listbox" aria-label="Results">
                            {items.map((item, index) => (
                                <li key={item.key} role="presentation">
                                    {index === firstFallback && index > 0 && (
                                        <p className={styles.groupLabel} aria-hidden="true">Close matches for <strong>{search.fallback.query}</strong></p>
                                    )}
                                    {item.sub ? (
                                        <Link {...optionProps(item, styles.subResult)}>
                                            <span className={styles.subTitle}>{item.sub.title}</span>
                                            <span className={styles.excerpt} dangerouslySetInnerHTML={{__html: item.sub.excerpt}} />
                                        </Link>
                                    ) : (
                                        <Link {...optionProps(item, styles.result)}>
                                            {item.result.section && <span className={styles.section}>{item.result.section}</span>}
                                            <span className={styles.title}>{item.result.title}</span>
                                            {!item.result.subResults.length && (
                                                <span className={styles.excerpt} dangerouslySetInnerHTML={{__html: item.result.excerpt}} />
                                            )}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                    {search.total > search.results.length + (search.fallback ? search.fallback.results.length : 0) && (
                        <button type="button" className={styles.more} onClick={search.showMore}>
                            Show more results
                        </button>
                    )}
                    <div className={styles.srOnly} role="status" aria-live="polite">{status}</div>
                </div>

                <div className={styles.footer} aria-hidden="true">
                    <span><kbd>↑</kbd> <kbd>↓</kbd> to move</span>
                    <span><kbd>Enter</kbd> to open</span>
                    <span><kbd>Esc</kbd> to close</span>
                </div>
            </div>
        </div>,
        document.body
    );
}
