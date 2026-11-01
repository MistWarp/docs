import React, {useEffect, useMemo, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useHistory} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import {loadPagefind, toResult} from './pagefind';
import {SearchIcon} from './icons';
import styles from './styles.module.css';

const PAGE_SIZE = 8;

const flatten = results => results.flatMap(result => [
    {key: result.url, url: result.url, result},
    ...result.subResults.map(sub => ({key: sub.url, url: sub.url, sub, result}))
]);

const useSearch = (query, baseUrl) => {
    const [state, setState] = useState({status: 'idle', results: [], total: 0});
    const [limit, setLimit] = useState(PAGE_SIZE);

    useEffect(() => setLimit(PAGE_SIZE), [query]);

    useEffect(() => {
        const term = query.trim();
        if (!term) {
            setState({status: 'idle', results: [], total: 0});
            return undefined;
        }
        let cancelled = false;
        setState(previous => ({...previous, status: 'loading'}));
        loadPagefind(baseUrl)
            .then(pagefind => pagefind.debouncedSearch(term, {}, 120))
            .then(async search => {
                if (cancelled || !search) return;
                const pages = await Promise.all(search.results.slice(0, limit).map(hit => hit.data()));
                if (cancelled) return;
                setState({status: 'done', results: pages.map(toResult), total: search.results.length});
            })
            .catch(() => {
                if (!cancelled) setState({status: 'unavailable', results: [], total: 0});
            });
        return () => {
            cancelled = true;
        };
    }, [query, limit, baseUrl]);

    return {...state, showMore: () => setLimit(value => value + PAGE_SIZE)};
};

export default function SearchModal({onClose}) {
    const {siteConfig: {baseUrl}} = useDocusaurusContext();
    const history = useHistory();
    const {withBaseUrl} = useBaseUrlUtils();
    const [query, setQuery] = useState('');
    const [active, setActive] = useState(0);
    const inputRef = useRef(null);
    const listRef = useRef(null);
    const search = useSearch(query, baseUrl);
    const items = useMemo(() => flatten(search.results), [search.results]);

    useEffect(() => {
        inputRef.current.focus();
        loadPagefind(baseUrl).catch(() => {});
        const {overflow} = document.body.style;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = overflow;
        };
    }, [baseUrl]);

    useEffect(() => setActive(0), [search.results]);

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
            event.preventDefault();
            inputRef.current.focus();
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
            onClick: onClose,
            onMouseMove: () => index !== active && setActive(index)
        };
    };

    const term = query.trim();

    return createPortal(
        <div className={styles.backdrop} onMouseDown={event => event.target === event.currentTarget && onClose()}>
            <div className={styles.dialog} role="dialog" aria-modal="true" aria-label="Search the docs" onKeyDown={onKeyDown}>
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
                        aria-controls="mw-search-results"
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
                    {term && search.status === 'done' && !search.results.length && (
                        <p className={styles.message}>No pages match <strong>{term}</strong>.</p>
                    )}
                    {search.results.length > 0 && (
                        <ul id="mw-search-results" className={styles.results} role="listbox" aria-label="Results">
                            {items.map(item => (
                                <li key={item.key} role="presentation">
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
                    {search.total > search.results.length && (
                        <button type="button" className={styles.more} onClick={search.showMore}>
                            Show more results ({search.total - search.results.length} left)
                        </button>
                    )}
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
