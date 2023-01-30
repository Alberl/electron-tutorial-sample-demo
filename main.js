// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const { Tray, nativeImage, Menu, MenuItem, globalShortcut } = require("electron");
const path = require("path");

let g_bQuit = false;
let mainWindow;
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    // resizable: false,
    // useContentSize: true,

    webPreferences: {
      // sandbox: false, // 在此render进程中禁用沙箱
      nodeIntegration: true, // 在此render进程中启用node
      contextIsolation: false, // 取消上下文隔离
      // 上面2个设置后，就可以在render种直接调用require，否则会提示require is not defined
      preload: path.join(__dirname, "preload.js"),
    },
  });

  //   mainWindow = new BrowserWindow({
  //     width: 800,
  //     height: 600,
  //     frame:false,
  //     transparent: true // 窗口透明
  // });

  // // 鼠标穿透透明的部分
  // mainWindow.setIgnoreMouseEvents(true);

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");
  // in the main process:
  require("@electron/remote/main").initialize();
  require("@electron/remote/main").enable(mainWindow.webContents);

  // const { screen } = require("electron");
  // const primaryDisplay = screen.getPrimaryDisplay();
  // const { width, height } = primaryDisplay.workAreaSize;

  mainWindow.on("close", (e) => {
    if (!g_bQuit) {
      e.preventDefault();
      mainWindow.hide();
    }
  });

  const menu = new Menu();
  menu.append(
    new MenuItem({
      label: "Electron",
      submenu: [
        {
          role: "help",
          accelerator: process.platform === "darwin" ? "Cmd+I" : "Ctrl+I",
          click: () => {
            console.log("Electron shortcuts!");
          },
        },
      ],
    })
  );

  Menu.setApplicationMenu(menu);

  // CommandOrControl 指在 macOS 上使用 Command ，在 Windows/Linux 上使用 Control
  globalShortcut.register("Alt + CommandOrControl + I", () => {
    console.log("Electron global shortcuts!");
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
let tray;
app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  const icon = nativeImage.createFromPath("assets/electron.png");
  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    // { label: "Open", type: "radio", checked: true },
    // { label: "Exit", type: "radio" },
    {
      label: "Open",
      click: async () => {
        mainWindow.show();
      },
    },
    {
      label: "Exit",
      click: async () => {
        g_bQuit = true;
        app.quit();
      },
    },
  ]);

  tray.on("click", function () {
    mainWindow.show(); // 左键单击图标显示应用
  });

  tray.setContextMenu(contextMenu);
  tray.setToolTip("electron application");
  tray.setTitle("This is my title");
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on("move-application", (event, offset) => {
  const pos = mainWindow.getPosition();
  pos[0] = pos[0] + offset.xOffset;
  // pos[1] = pos[1] + offset.yOffset;
  pos[1] += offset.yOffset;
  console.log("pos[0]: " + pos[0] + ", pos[1]: " + pos[1]);

  // mainWindow.setPosition(pos[0], pos[1], true);
  mainWindow.setPosition(pos[0], pos[1]);
});
