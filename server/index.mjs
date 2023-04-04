import * as P   from "./docs/main.js";
import * as C   from "./docs/control.js";
import express  from 'express';
import H        from 'http';
import {Server} from 'socket.io';
import * as fflate from "fflate";
import * as fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';
import { start } from "repl";

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

    this.L.keycontrols.signal.keys.editRailNote.onkey  = ()=>{this.L.editRailNote (this.note);};
    this.L.keycontrols.signal.keys.editTrainNote.onkey = ()=>{this.L.editTrainNote(this.note);};
    this.L.refreshKeybinds();

    this.count = 0;
    this.COUNTMAX = 120;

    this.players = 0;
  }

  startLoop(){
    this.loop = setInterval(()=>{
      if(!this.L.stopped ) this.L.layout = P.layoutTick(this.L.layout);
      this.L.layout = P.layoutUpdate(this.L.layout);
      this.count++;
      if(this.count >= this.COUNTMAX){
        this.sync();
      }
    }, 16);
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
    io.to(this.name).emit("sync", {compressed: Buffer.from(fflate.compressSync(new Uint8Array(Buffer.from(data)))).toString('base64'), clearCache: clearCache});
    fs.writeFileSync(this.file, data);
  }

  onkey(socket, data){
    this.note = data.note;
    this.L.selectedJoint = data.selectedJoint;
    this.L.onkey(data);
    this.sync(false);
    socket.emit("selectedJoint", {selectedJoint: this.L.selectedJoint});
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
  socket.emit("sync", {compressed: Buffer.from(fflate.compressSync(new Uint8Array(Buffer.from(JSON.stringify(P.encodeLayout(rooms[room].L.layout)))))).toString('base64'), clearCache: true});
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



app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.get('/',function(req,res){
    res.sendFile(__dirname+'/docs/index.html');
});
app.get('/online/models/:file',function(req,res){
    res.sendFile(__dirname+'/docs/models/'+req.params.file);
});
app.get('/online/:roomid',function(req,res){
    res.sendFile(__dirname+'/docs/online/index.html');
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

