import React from 'react';
import clsx from 'clsx';
import ColorModeToggle from '@theme-original/ColorModeToggle';

export default function ColorModeToggleWrapper(props) {
    return <ColorModeToggle {...props} className={clsx(props.className, 'mw-color-toggle')} />;
}
