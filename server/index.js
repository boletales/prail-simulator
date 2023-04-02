const P = require("./docs/main.js");
const C = require("./docs/control.js");
const C = require("./docs/control.js");
const express=require('express');
const app=express();
const http=require('http').createServer(app);
const socketIO=require('socket.io');
const io=socketIO.listen(http);