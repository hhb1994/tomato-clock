/*
 * @Author: 韩宏斌
 * @Description: this is the description
 * @version: 1.0.0
 * @LastEditors: 韩宏斌
 * @Date: 2021-03-17 14:39:11
 * @LastEditTime: 2021-03-19 17:05:10
 * @FilePath: /electron/renderer.js
 */

const { ipcRenderer } = require("electron");

const Timer = require("timer.js");

let second = 25 * 60;
let timer = new Timer({
  tick: 0.1,
  ontick: function (msec) {
    document.getElementById("sec").innerHTML = formatTime(msec);
    drawProcss(msec);
  },
  onstart: function (msec) {
    document.getElementById("sec").innerHTML = formatTime(msec);
  },
  onend: () => {
    endCount(true);
  },
});

function formatTime(msec) {
  let sec = (msec / 1000).toFixed(0);
  let minutes = String(Math.floor(sec / 60)).padStart(2, 0);
  let seconds = String(sec % 60).padStart(2, 0);
  return `${minutes}:${seconds}`;
}

function beginCount() {
  document.getElementById("start").style.display = "none";
  document.getElementById("end").style.display = "inline";
  document.getElementById("potato").classList.remove("shake");
  document.getElementById("potato").classList.add("rotate");

  timer.start(second);
}

function endCount(type = false) {
  timer.stop();
  document.getElementById("start").style.display = "inline";
  document.getElementById("end").style.display = "none";
  document.getElementById("sec").innerHTML = "计时结束";
  drawProcss(0);
  ipcRenderer.invoke("countend", type);
  document.getElementById("potato").classList.remove("rotate");
  document.getElementById("potato").classList.add("shake");
}

let canvas, ctx;
function drawProcss(msec) {
  ctx.clearRect(0, 0, 400, 400);
  ctx.strokeStyle = "rgba(200,200,200,0.4)";
  ctx.beginPath();
  ctx.arc(200, 200, 170, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#C2F56F";
  ctx.beginPath();
  ctx.arc(
    200,
    200,
    170,
    Math.PI / 2,
    Math.PI * 2 * (msec / 1000 / second) + Math.PI / 2,
    false
  );
  ctx.stroke();
}
window.onload = () => {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  ctx.lineWidth = 3;
  ipcRenderer.on("clickAction", (action, msg) => {
    msg == 1 && (second = 300);
    if (msg != 2) {
      beginCount(second);
    }
  });
};
