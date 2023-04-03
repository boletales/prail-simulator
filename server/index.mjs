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

let note;
let L = new C.Layout();
L.loadfrom(()=>null, fs.readFileSync("./data.json"));
L.keycontrols.signal.keys.editRailNote.onkey  = ()=>{L.editRailNote (note);};
L.keycontrols.signal.keys.editTrainNote.onkey = ()=>{L.editTrainNote(note);};
L.refreshKeybinds();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.get('/',function(req,res){
    res.sendFile(__dirname+'/docs/index.html');
});

app.use(express.static('docs'));

io.on('connection',function(socket){
    socket.join("all");

    socket.emit("sync", {compressed: Buffer.from(fflate.compressSync(new Uint8Array(Buffer.from(JSON.stringify(P.encodeLayout(L.layout)))))).toString('base64'), clearCache: true});

    socket.on("key",data=>{
      note = data.note;
      L.selectedJoint = data.selectedJoint;
      L.onkey(data);
      sync(false);
      socket.emit("selectedJoint", {selectedJoint: L.selectedJoint})
    });

    socket.on("upload",data=>{
      L.loadfrom(()=>null, data.payload);
      sync(true);
    });

    socket.on('disconnect',data=>{});
});

function sync(clearCache){
  //console.log("sync " + L.layout.updatecount);
  count = 0;
  let data = JSON.stringify(P.encodeLayout(L.layout));
  io.emit("sync", {compressed: Buffer.from(fflate.compressSync(new Uint8Array(Buffer.from(data)))).toString('base64'), clearCache: clearCache});
  fs.writeFileSync("./data.json", data)
}

http.listen(process.env.PORT || 8080);
console.log('It works!!');

let count = 0;
const COUNTMAX = 120;
setInterval(()=>{
  if(!L.stopped ) L.layout = P.layoutTick(L.layout);
  L.layout = P.layoutUpdate(L.layout);
  count++;
  if(count >= COUNTMAX){
    sync();
  }
}, 16);
