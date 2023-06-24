const { contextBridge, ipcRenderer } = require("electron");
const Toastify = require('toastify-js');

contextBridge.exposeInMainWorld("axios", {
  openAI: (sentence, tools) => ipcRenderer.invoke('axios.openAI', sentence, tools),
  backendLaravel: (...args) => ipcRenderer.invoke('axios.backendLaravel', ...args),
  backendLaravelAPI: (...args) => ipcRenderer.invoke('axios.backendLaravelAPI', ...args),
  backendLaravelDelete: (...args) => ipcRenderer.invoke('axios.backendLaravelDelete', ...args),
  tesseract: (image) => ipcRenderer.invoke('axios.tesseract', image),

});

contextBridge.exposeInMainWorld("Toastify", {
  showToast: (options) => Toastify(options).showToast()
});
