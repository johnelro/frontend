const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("axios", {
  openAI: (topic) => ipcRenderer.invoke('axios.openAI', topic)
});
