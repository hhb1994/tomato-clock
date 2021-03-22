/*
 * @Author: 韩宏斌
 * @Description: this is the description
 * @version: 1.0.0
 * @LastEditors: 韩宏斌
 * @Date: 2021-03-16 15:37:02
 * @LastEditTime: 2021-03-19 15:55:09
 * @FilePath: /electron/main.js
 */

const { app, BrowserWindow, Notification, ipcMain } = require("electron");

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 600,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // devTools: false,
      backgroundColor: "#EC513B",
    },
  });
  win.loadFile("index.html");
  // win.setProgressBar(0.5);

  // ipcHandle();
}

let notification;
function ipcHandle() {
  ipcMain.handle("countend", (e, a) => {
    notification = new Notification({
      title: "计时结束",
      // body: `${a ? "该休息啦" : "还要继续吗"}`,
      actions: [
        {
          type: "button",
          text: "继续工作",
        },
        {
          type: "button",
          text: "休息一会儿",
        },
        {
          type: "button",
          text: "爷累了",
        },
      ],
    });
    notification.show();

    notification.on("action", (e, index) => {
      win.webContents.send("clickAction", index);
    });
    notification.on("click", (e, index) => {
      win.webContents.send("clickAction", 0);
    });
    notification.on("close", (e, index) => {
      win.webContents.send("clickAction", 2);
    });
  });
}
app.whenReady().then(() => {
  createWindow();
  ipcHandle();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
