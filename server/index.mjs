import * as P   from "./docs/main.js";
import * as C   from "./docs/control.js";
import express  from 'express';
import H        from 'http';
import {Server} from 'socket.io';
import * as fflate from "fflate";
import * as fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app=express();
const http=H.createServer(app);
const io=new Server(http);

class OnlineControler {
  constructor (name){
    this.escaped = encodeURIComponent(name);
    this.name = this.escaped;
    this.file = "./data/data_"+this.escaped+".json";
    this.L = new C.Layout();

    if(!fs.existsSync(this.file)){
      fs.writeFileSync(this.file, JSON.stringify(P.encodeLayout(this.L.layout)));
    }
    this.L.loadfrom(()=>null, fs.readFileSync(this.file));

    this.L.refreshKeybinds();

    this.L.save = () => {};

    this.count = 0;
    this.COUNTMAX = 120/4;

    this.players = 0;
  }

  startLoop(){
    this.loop = setInterval(()=>{
      this.L.tick(4.0);
 
      this.count++;
      if(this.count >= this.COUNTMAX){
        this.sync();
      }
    }, 66);
  }

  onconnect(){
    if(this.players == 0){
      this.startLoop();
    }
    this.players++;
  }

  ondisconnect(){
    this.players--;
    if(this.players <= 0){
      clearInterval(this.loop);
    }
  }

  sync(clearCache){
    //console.log("sync " + L.layout.updatecount);
    this.count = 0;
    let data = JSON.stringify(P.encodeLayout(this.L.layout));
    io.to(this.name).emit("sync", getPayload(this.L));
    fs.writeFileSync(this.file, data);
  }

  onkey(socket, data){
    this.L.selectedJoint = data.selectedJoint;
    this.L.selectedTrain = data.selectedTrain;
    this.L.onkey({key:data.key}, data.data);
    this.L.layout = P.layoutUpdate(this.L.layout);
    this.sync(false);
    socket.emit("selectedJoint", {selectedJoint: this.L.selectedJoint, selectedTrain: this.L.selectedTrain});
  }

  onupload(socket, data){
    this.L.loadfrom(()=>null, data.payload);
    this.sync(true);
  }
}

let rooms = {};
let players = {};

function onconnect(socket, room){
  if(rooms[room] === undefined){
    rooms[room] = new OnlineControler(room);
  }
  socket.join(rooms[room].name);

  players[socket.id] = room;
  rooms[room].onconnect();
  socket.emit("sync", getPayload(rooms[room].L, true));
}

function getPayload(layoutctl, clearCache = false){
  return {
      stopped: layoutctl.stopped
    , respectSignals: layoutctl.respectSignals
    , compressed: Buffer.from(fflate.compressSync(new Uint8Array(Buffer.from(JSON.stringify(P.encodeLayout(layoutctl.layout)))))).toString('base64')
    , clearCache: clearCache
  };
}

function ondisconnect(socket, data){
  if(players[socket.id] !== undefined && rooms[players[socket.id]] !== undefined){
    rooms[players[socket.id]].ondisconnect();
  }
}

function onkey(socket, data){
  if(players[socket.id] !== undefined && rooms[players[socket.id]] !== undefined){
    rooms[players[socket.id]].onkey(socket, data);
  }
}

function onupload(socket, data){
  if(players[socket.id] !== undefined && rooms[players[socket.id]] !== undefined){
    rooms[players[socket.id]].onupload(socket, data);
  }
}

function safeSendFile(res, documentRoot, file){
  let fullpath = path.join(documentRoot, file);
  if(fullpath.normalize().startsWith(documentRoot.normalize())){
    res.sendFile(fullpath);
  } else {
    res.status(404).send('Not Found');
  }
}

const documentRoot = path.join(__dirname, 'docs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/',function(req,res){
  safeSendFile(res, documentRoot, 'index.html');
});
app.get('/online/models/:file',function(req,res){
  safeSendFile(res, documentRoot, 'models/'+req.params.file);
});
app.get('/online/load.js',function(req,res){
  safeSendFile(res, documentRoot, 'online/load.js');
});
app.get('/online/:roomid',function(req,res){
  safeSendFile(res, documentRoot, 'online/index.html');
});
app.get('/preset/data/:file',function(req,res){
  safeSendFile(res, documentRoot, 'preset/data/'+req.params.file);
});
app.get('/preset/models/:file',function(req,res){
  safeSendFile(res, documentRoot, 'models/'+req.params.file);
});
app.get('/preset/load.js',function(req,res){
  safeSendFile(res, documentRoot, 'preset/load.js');
});
app.get('/preset/:id',function(req,res){
  safeSendFile(res, documentRoot, 'preset/index.html');
});

app.use(express.static('docs'));

io.on('connection',function(socket){
    socket.on("join", data=>{
      onconnect(socket, data.room);
    });

    socket.on("key",data=>{
      onkey(socket, data);
    });

    socket.on("upload",data=>{
      onupload(socket, data);
    });

    socket.on('disconnect',data=>{
      ondisconnect(socket, data);
    });
});

http.listen(process.env.PORT || 8080);
console.log('It works!!');

