'use strict';

var app = require('app');
var Menu = require("menu");
var BrowserWindow = require('browser-window');
var ipc = require('ipc');

require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function() {
    app.quit();
});

app.on('ready', function() {

  mainWindow = new BrowserWindow({
    title: 'MdNote',
    frame: true,
    width: 800,
    height: 600,
    "min-width": 800,
    "min-height": 600,
    resizable: true,
    center: true,
    show: true,
    icon: 'file://' + __dirname + '/assets/icon.ico'
  });
  
  mainWindow.loadUrl('file://' + __dirname + '/index.html');
  
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
  
  var template = [
  {
        label: app.getName(),
        submenu: [
        { type: 'separator' },
        { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: function() { app.quit(); } },
        ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
    ]
  },
  {
    label: 'Window',
    role: 'window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: 'Toggle Full Screen',
        accelerator: (function() {
          if (process.platform == 'darwin')
            return 'Ctrl+Command+F';
          else
            return 'F11';
        })(),
        click: function(item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        }
      },
    ]
  },
  {
    label: 'Help',
    role: 'help',
    submenu: [
      {
        label: 'Official Page',
        click: function() { require('shell').openExternal('http://md-note.com/') }
      },
      {
        label: 'Check Update',
        click: function() { require('shell').openExternal('http://md-note.com/versions') }
      },
      {
        label: 'Licence',
        click: function() { require('shell').openExternal('http://md-note.com/info/license') }
      },
      {
        label: 'Version = 1.0.0',
      },
    ]
  }];
  if (process.platform == 'darwin') {
    template[1].submenu.unshift({
      label: 'Undo',
      accelerator: 'CmdOrCtrl+Z',
      role: 'undo'
    },
    {
      label: 'Redo',
      accelerator: 'Shift+CmdOrCtrl+Z',
      role: 'redo'
    },
    {
      type: 'separator'
    });
    template[1].submenu.push({
      label: 'Select All',
      accelerator: 'CmdOrCtrl+A',
      role: 'selectall'
    });
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
    
});
    
