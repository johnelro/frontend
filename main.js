
// Imported Modules
const { app, Menu, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const axios = require('axios');
const dotenv = require('dotenv').config();
const FormData = require('form-data');
const fs = require('fs');

// Global Varialbes
const isDev = true;
const isMac = process.platform === 'darwin';
const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'App logs',
    submenu: [
      {
        label: 'Application Logs',
        click: applogsWindow,
      },
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
]

// Main Window
const createWindow = () => {
  const main = new BrowserWindow({
    width: isDev ? 1200 : 600,
    height: 750,
    icon: path.join(__dirname, "/renderer/images/mylogo.ico"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  // Devtool for main window
  // if (isDev) {
  //   main.webContents.openDevTools();
  // }

  main.loadFile(path.join(__dirname, "./renderer/index.html"));
};

//applogs window
function applogsWindow () {
  const logs = new BrowserWindow({
    width:650,
    height: 800,
    icon: path.join(__dirname, "/renderer/images/mylogo.ico"),
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  
logs.setMenuBarVisibility(false);

//DevTool for applogs window
// if (isDev) {
//   logs.webContents.openDevTools();
// }

logs.loadFile(path.join(__dirname, "./renderer/logs.html"));
}


app.whenReady().then(() => {
  // Initialize functions
  ipcMain.handle('axios.openAI', openAI);
  ipcMain.handle('axios.backendLaravel', backendLaravel);
  ipcMain.handle('axios.backendLaravelAPI', backendLaravelAPI);
  ipcMain.handle('axios.backendLaravelDelete', backendLaravelDelete);
  ipcMain.handle('axios.tesseract', tesseract);

  // Create Main Window
  createWindow();

  // Start Window
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Close Window
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Main functions
// Axios OpenAI API
async function openAI(event, topic){
  let res = null;

  const env = dotenv.parsed;

  await axios({
      method: 'post',
      url: 'https://api.openai.com/v1/completions',
      data: {
        model: "text-davinci-003",
        prompt: topic,
        temperature: 0.3,
        max_tokens: 250, //original value 150
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
    },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + env.APIKEY_OPENAI
      }
    })
    .then(function (response) {
      res = response.data;
    })
    .catch(function (error) {
      res = error;
    });
  return res;
}

// Login 
// Read application logs
// Axios Laravel API
async function backendLaravel(event, method, path, data = null, token = ''){
  let result = null;

  await axios({
      method: method,
      url: 'http://backend.test/api/' + path,
      headers: ( token == '' ? { 
            'Accept': 'application/json',
        } : {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        } ),
      data: data
    }).then(function (response) {
      result = response.data;
    })
    .catch(function (error) {
      result = error.response.data;
    });

  return result;
}

// Axios Tesseract API
async function tesseract(event, filepath){
  let result = null;

  var formData = new FormData();
  formData.append("image", fs.createReadStream(filepath));

  await axios.post('http://backend.test/api/ocr', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(function (response) {
      result = response.data;
    })
    .catch(function (error) {
      result = error.response.data;
    });

  return result;
}

// Store prompts and AI response to backend DB
async function backendLaravelAPI(event, method, data){

  await axios({
      method: method,
      url: 'http://backend.test/api/prompts',
      headers: { 
            'Accept': 'application/json',
        },
      data: data
    }).then(function (response) {
      result = response.data;
    })
    .catch(function (error) {
      result = error.response.data;
    });

  return result;
}

// Delete specific id in app logs
async function backendLaravelDelete(event, id='', token = ''){
  let result = null;

  await axios({
      method: 'delete',
      url: 'http://backend.test/api/prompts/' + id,
      headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    }).then(function (response) {
      result = response.data;
    })
    .catch(function (error) {
      result = error.response.data;
    });

  return result;
}
