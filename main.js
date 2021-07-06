// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const path = require('path');
var Jimp = require('jimp');
let filepath;

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,    
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

    ipcMain.on('input-click', () => {
        dialog.showOpenDialog({properties: ['openDirectory']}).then((result) => {
            filepath = result.filePaths[0];
            mainWindow.webContents.send('chosen-dir', filepath);
            
        })   
    })

    ipcMain.on('resize-click', (event, data) => {
      console.log(data)
      if (filepath == undefined) {
        console.log("no path")
        dialog.showMessageBox({message:"Veuillez sélectionner un dossier d'image !", title: "pas de dossier !" } );
        
      }
      else if(data == "") {
        dialog.showMessageBox({message:"Veuillez sélectionner un format d'image !", title: "pas de taille !" } );
      }
      else {
        dialog.showMessageBox({message:"Êtes vous sûr.e de vouloir continuer ?", 
                                title: "Confirmation", 
                                type: "question", 
                                buttons: ["oui", "non"], 
                                cancelId: 1 })
                                .then(result => {
                                  if (result.response === 0) {
                                    mkdirp(filepath + '-Resized').then(made => {
                                      console.log(`made directories, starting with ${made}`);
                                      const srcDir = filepath;
                                      const destDir = made;
                                      fs.readdir(srcDir, function (err, files) {
                                          if (err) {
                                              return console.log('Unable to scan directory: ' + err);
                                          } 
                                          //listing all files using forEach
                                          files.forEach(async file => {
                                              return Jimp.read(srcDir + "\\" + file)
                                              .then(image => {
                                                return image
                                                  .resize(data == "1" ? 350
                                                          :data == "2" ? 500
                                                          :data == "3" ? 750
                                                          :data == "4" ? 1250
                                                          :data == "5" ? 1600
                                                          : 2000
                                                          ,
                                                          data == "1" ? 350
                                                          :data == "2" ? 500
                                                          :data == "3" ? 750
                                                          :data == "4" ? 1600
                                                          :data == "5" ? 1900
                                                          : 2500
                                                          )
                                                  .write(destDir + "\\" + file);
                                              })
                                          })
                                        });
                                    });
                                  }
                                });
        
      }
      
    })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

function resizeFiles(path) {

}

