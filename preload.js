const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('agentAPI', {
  speak: async (msg) => await ipcRenderer.invoke('speak', msg),
  parseCommand: async (cmd) => await ipcRenderer.invoke('parse-command', cmd),
  chooseFolder: () => ipcRenderer.invoke("choose-folder"),

  // 🔔 Add a notify method
  notify: (title, body) => {
    ipcRenderer.send('show-notification', { title, body });
  }
});
