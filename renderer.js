const { ipcRenderer, dialog } = require("electron");


document.querySelector("#input").addEventListener('click', () => {
    ipcRenderer.send('input-click');
})

document.querySelector('#resize-button').addEventListener('click', () => {
    ipcRenderer.send('resize-click', document.querySelector('#sizeSelector').value);
})

ipcRenderer.on('chosen-dir', (event, path) => {
    document.querySelector('#path').innerHTML = path;
})