const { BrowserView, BrowserWindow, app } = require('electron');

try {
    require('electron-reloader')(module);
} catch (_) {}

const viewPortConfig = {
  url: 'https://de.wikipedia.org/wiki/Tiger',
  rect: { x: 1169, y: 1, pageX: 1808, pageY: 155 },
  browserSettings: { innerWidth: 1833, innerHeight: 971, scrollTop: 0, scrollLeft: 0 }
}

const rect = viewPortConfig.rect;
const width = rect.pageX - rect.x;
const height = rect.pageY - rect.y;

const innerWidth = viewPortConfig.browserSettings.innerWidth;
const innerHeight = viewPortConfig.browserSettings.innerHeight;

const createView = () => {
    const win = new BrowserWindow({ x: 5000, y: 5000, width: 1000, height: 500 });

    const view = new BrowserView();
    // win.addBrowserView(view)

    // view.setBounds({ x: 0, y: 0, width: width, height: height })
    // view.webContents.loadURL(viewPortConfig.url)

    // view.webContents.on('did-finish-load', async () => {
    //     await view.webContents.insertCSS(`html, body {position: relative; width: ${innerWidth}px; height:${innerHeight}px }`)

    //     view.webContents.executeJavaScript(`window.scrollTo(${rect.x}, ${rect.y}) `, true)
    // })

    const secondView = new BrowserView({
        webPreferences: {
            nodeIntegration: true,
            // https://www.electronjs.org/docs/api/webview-tag
            webviewTag: true, // Security warning since Electron 10
            zoomFactor: 1.0,
            enableRemoteModule: true,
        },
    });
    win.addBrowserView(secondView);
    secondView.setBounds({ x: 0, y: 0, width: width, height: height });
    secondView.webContents.loadURL('file://' + __dirname + '/index.html');

    const contents = secondView.webContents;
    contents.on('did-finish-load', async () => {
        contents.executeJavaScript('window.scroll(500, 200) ', true);
        contents.executeJavaScript(`window.scrollTo(${rect.x}, ${rect.y}) `, true)

        contents.executeJavaScript('document.body.style.overflow = "hidden";', true);
        contents.executeJavaScript('document.querySelector("html").scrollTop = window.scrollY;', true);
    });

    app.on('window-all-closed', () => {
        // win.removeBrowserView(secondView)
        win.removeBrowserView(view);
        app.quit();
    });
};

app.whenReady().then(createView);

// let mainWindow;
// let initPath;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// app.allowRendererProcessReuse = true;
// app.on("ready", () => {

//   // https://www.electronjs.org/docs/api/browser-window#class-browserwindow
//   mainWindow = new BrowserWindow({
//     width: 1024,
//     height: 768,
//     //titleBarStyle: 'hidden',
//     //frame: false,
//     backgroundColor: "#fff",
//     webPreferences: {
//       nodeIntegration: true,
//       // https://www.electronjs.org/docs/api/webview-tag
//       webviewTag: true, // Security warning since Electron 10
//       zoomFactor: 1.0,
//       enableRemoteModule: true,
//     },
//   });

//   mainWindow.loadURL("file://" + __dirname + "/index.html");
// });

// // Quit when all windows are closed.
// app.on("window-all-closed", () => {
//   data = {
//     bounds: mainWindow.getBounds(),
//   };
//   fs.writeFileSync(initPath, JSON.stringify(data));
//   app.quit();
// });
