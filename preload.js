const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('agentAPI', {
  speak: async (msg) => await ipcRenderer.invoke('speak', msg),
  parseCommand: async (cmd) => await ipcRenderer.invoke('parse-command', cmd),
});
