import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import SearchModal from './SearchModal';
import {SearchIcon} from './icons';
import styles from './styles.module.css';

const OPEN_EVENT = 'mw:open-search';

const isEditable = target => target instanceof HTMLElement &&
    (target.isContentEditable || /^(input|textarea|select)$/i.test(target.tagName));

const useShortcutHint = () => {
    const [hint, setHint] = useState(null);
    useEffect(() => {
        if (document.documentElement.hasAttribute('data-embedded')) setHint('/');
        else setHint(/mac|iphone|ipad/i.test(navigator.platform) ? '⌘ K' : 'Ctrl K');
    }, []);
    return hint;
};

export function SearchLauncher({className}) {
    const hint = useShortcutHint();
    return (
        <button
            type="button"
            className={clsx(styles.launcher, className)}
            onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
        >
            <SearchIcon className={styles.launcherIcon} />
            <span className={styles.launcherText}>Search the docs</span>
            {hint && <kbd className={styles.hint}>{hint}</kbd>}
        </button>
    );
}

export default function SearchBar() {
    const [open, setOpen] = useState(false);
    const hint = useShortcutHint();
    const returnFocus = useRef(null);
    const isOpen = useRef(false);

    const show = useCallback(() => {
        if (isOpen.current) return;
        isOpen.current = true;
        returnFocus.current = document.activeElement;
        setOpen(true);
    }, []);

    const hide = useCallback(() => {
        isOpen.current = false;
        setOpen(false);
        const target = returnFocus.current;
        if (target && typeof target.focus === 'function') target.focus();
    }, []);

    useEffect(() => {
        const onKeyDown = event => {
            const key = event.key && event.key.toLowerCase();
            if ((event.metaKey || event.ctrlKey) && key === 'k') {
                event.preventDefault();
                show();
            } else if (key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !isEditable(event.target)) {
                event.preventDefault();
                show();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener(OPEN_EVENT, show);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener(OPEN_EVENT, show);
        };
    }, [show]);

    return (
        <>
            <button type="button" className={styles.button} onClick={show} aria-label="Search the docs">
                <SearchIcon className={styles.buttonIcon} />
                <span className={styles.buttonText}>Search</span>
                {hint && <kbd className={styles.hint}>{hint}</kbd>}
            </button>
            {open && <SearchModal onClose={hide} />}
        </>
    );
}
