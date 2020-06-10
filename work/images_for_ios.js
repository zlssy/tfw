const { ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');
const dir2 = '2.0x';
const dir3 = '3.0x';

function change(dirPath, cb) {
  let dir = path.resolve(dirPath);
  let num = 0;
  let total = 0;
  let d2 = path.resolve(dir, dir2);
  let d3 = path.resolve(dir, dir3);
  if (!fs.statSync(d2).isDirectory()) {
    fs.mkdirSync(d2);
  }
  if (!fs.statSync(d3).isDirectory()) {
    fs.mkdirSync(d3);
  }
  fs.readdir(dir, (err, files) => {
    let needRemove = 0;
    total = files.length;
    if (files.length) {
      files.map(function (file) {
        if (file.includes('@2x')) {
          needRemove++;
          num++;
          fs.rename(path.resolve(dir, file), path.resolve(dir, dir2, file.replace('@2x', '')), (mErr) => {
            needRemove--;
            if (needRemove === 0) {
              console.log('处理完成。');
              cb({ num, total });
            }
          });
        }
        else if (file.includes('@3x')) {
          needRemove++;
          num++;
          fs.rename(path.resolve(dir, file), path.resolve(dir, dir3, file.replace('@3x', '')), (mErr) => {
            needRemove--;
            if (needRemove === 0) {
              console.log('处理完成。');
              cb({ num, total });
            }
          });
        }
        else {
          if (needRemove == 0) {
            cb({ num: needRemove, total });
          }
        }
      });
    }
    else {
      cb({ num: 0, total });
    }
  });
}

// change('../../xhApp/images/house');
function dealDir() {
  console.log('running');
  ipcRenderer.send('open-directory-dialog');
  ipcRenderer.on('selectedItem', (e, path) => {
    change(path, (ret) => {
      console.log(ret);
      let { num, total } = ret;
      console.log(num, total);
      info(`处理成功，扫描个${total}个文件，共影响${num}个文件。`);
    });
  });
}

function info(msg) {
  writeTxt('result', msg);
}

function writeTxt(id, info) {
  let el = document.getElementById(id);
  el.innerHTML = info;
}