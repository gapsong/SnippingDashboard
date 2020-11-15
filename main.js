const { BrowserView, BrowserWindow, app } = require('electron')
function twoViews() {
    const win = new BrowserWindow({ width: 800, height: 600 })

    const view = new BrowserView()
    win.addBrowserView(view)
    view.setBounds({ x: 0, y: 0, width: 400, height: 300 })
    view.webContents.loadURL('https://soundcloud.com')

    view.webContents.on('did-finish-load', async () => {
        await view.webContents.insertCSS('html, body {width: 4000px; }')

        view.webContents.executeJavaScript('window.scroll(5000, 200) ', true)
    })

    const secondView = new BrowserView()
    win.addBrowserView(secondView)
    secondView.setBounds({ x: 400, y: 0, width: 400, height: 300 })
    secondView.webContents.loadURL('https://www.github.com')

    const contents = secondView.webContents
    contents.on('did-finish-load', async () => {
        await contents.insertCSS('html, body {width: 4000px; }')

        contents.executeJavaScript('window.scroll(500, 200) ', true)
        contents.executeJavaScript('document.body.style.overflow = "hidden";', true)
        contents.executeJavaScript('document.querySelector("html").scrollTop = window.scrollY;', true)
    })

    app.on('window-all-closed', () => {
        win.removeBrowserView(secondView)
        win.removeBrowserView(view)
        app.quit()
    })
}

app.whenReady().then(twoViews)
