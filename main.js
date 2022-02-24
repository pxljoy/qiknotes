const {app, BrowserWindow, ipcMain, Tray} = require('electron');
const path = require('path');

const Store = require('electron-store');
const store = new Store();

// const debug = require('electron-debug');

// debug();

let tray = undefined
let window = undefined

// Don't show the app in the doc
app.dock.hide()

app.on('ready', () => {
  createTray()
  createWindow()
})

const createTray = () => {
  tray = new Tray(path.join(__dirname, './src/assets/sunTemplate.png'))
  tray.on('click', function (event) {
    toggleWindow()
  });
}

const getWindowPosition = () => {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  return {x: x, y: y};
}

const createWindow = () => {
  window = new BrowserWindow({
    width: 360,
    height: 450,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: false,
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true
    },
    name: 'QikNotes',
    backgroundColor: '#2f3437',
  })
  window.loadURL(`file://${path.join(__dirname, 'public/index.html')}`)

  // Hide the window when it loses focus
  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide()
    }
  })

  window.webContents.on('did-finish-load', () => {
    window.webContents.send('receive-store', store.store);
    // console.log('READY!');
  });

  ipcMain.on('update-store-key', (_, { key, value}) => {
    console.log('update-store-key', key, value);
    store.set(key, value);
    window.webContents.send('receive-store', store.store);
  });

  ipcMain.on('get-store-key', (_, key) => {
    store.set(key, value);
    window.webContents.send('receive-store-key', store.get(key));
  });

  ipcMain.on('get-store', () => {
    window.webContents.send('receive-store', store.store);
  });
}

const toggleWindow = () => {
  window.isVisible() ? window.hide() : showWindow();
}

const showWindow = () => {
  const position = getWindowPosition();
  window.setPosition(position.x, position.y, false);

  window.setVisibleOnAllWorkspaces(true); // put the window on all screens
  window.focus(); // focus the window up front on the active screen
  window.setVisibleOnAllWorkspaces(false); // disable all screen behavior

  window.show();
}

ipcMain.on('show-window', () => {
  showWindow();
})
