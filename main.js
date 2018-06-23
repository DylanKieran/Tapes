const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu} = electron;

let mainWindow;
let newPlaylistWindow;

// Listen for app to be ready
app.on('ready', function(){
    // Create new window
    mainWindow = new BrowserWindow({});
    // Load html file into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    // Quit app when closed
    mainWindow.on('closed', function(){
        app.quit();
    });

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert menu
    Menu.setApplicationMenu(mainMenu);
})

// Handle new playlist window
function createPlaylistWindow()
{
    // Create new window
    newPlaylistWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Create Playlist'
    });
    // Load html file into window
    newPlaylistWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'newPlaylistWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    // Garbage collection handle
    newPlaylistWindow.on('close', function(){
        newPlaylistWindow = null;
    });
}

// Create menu template
const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
            {
                label: 'New Playlist',
                click(){
                    createPlaylistWindow();
                }
            },
            {
                label: 'Quit',
                accelorator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

// If mac, add empty object to menu (avoids issue of mac users seeing 'Electron' rather than 'File')
if(process.platform == 'darwin')
{
    mainMenuTemplate.unshift({});
}

// Add developer tools item if not in prod
if(process.env.NODE_ENV !== 'production')
{
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelorator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}