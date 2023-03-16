'use strict';

import { BrowserWindow } from 'electron';

// default window settings
const defaultProps = {
    width: 1500,
    height: 750,
    show: false,
    autoHideMenuBar: true,

    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
    },
};

export class Window extends BrowserWindow {
    constructor(file: string) {
        // calls new BrowserWindow with these props
        super({ ...defaultProps });

        this.loadFile(file);
        this.webContents.openDevTools();

        // gracefully show when ready to prevent flickering
        this.once('ready-to-show', () => {
            this.show();
        });
    }
}
