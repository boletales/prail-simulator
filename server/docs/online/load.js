import {download, L, clearCache, forceUpdateModel} from "../3d.js";
import * as P from "../main.js";
window.P = P;

window.upload = upload;
window.download = download;
window.L = L;
window.save = ()=>{L.save()};

document.getElementById("minicontrols").onkeydown = (e)=>{e.stopPropagation(); true;};

let socket = io.connect();

L.setSyncMethod((key, data, selectedJoint, selectedTrain)=>{
  socket.emit("key", {"key" : key, "data":data, "selectedJoint":selectedJoint, "selectedTrain":L.selectedTrain});
});

socket.on("sync",data=>{
  let selectedJoint = L.selectedJoint;
  let selectedTrain = L.selectedTrain;
  L.stopped = data.stopped;
  L.respectSignals = data.respectSignals;
  document.getElementById("respectSignals").checked = data.respectSignals;
  L.loadfrom(()=>(data.clearCache ? clearCache() : forceUpdateModel()), fflate.strFromU8(fflate.decompressSync(Uint8Array.from(Array.prototype.map.call(atob(data.compressed), (x) => x.charCodeAt(0))))))
  L.selectedJoint = selectedJoint;
  L.selectedTrain = selectedTrain;
  console.log("sync");
});
socket.on("selectedJoint",data=>{
  L.selectedJoint = data.selectedJoint;
  L.selectedTrain = data.selectedTrain;
});
document.onkeydown = ((e)=>{
  L.onkey(e, {trainid: L.selectedTrain});
});
L.refreshKeybinds();

clearCache();

function upload(){
  let files = document.getElementById("upload").files;
  if(files.length > 0){
    files[0].text().then(t => socket.emit("upload", {payload: t}));
  }
}

const GUI = new lil.GUI({ title : 'コントロールパネル', touchStyles: false });
window.GUI = GUI;

Object.values(L.keycontrols).forEach(category => {
  let folder = new lil.GUI( { parent: GUI, title: category.name, touchStyles: false } );
  Object.values(category.keys).forEach(key => {
    if(key.skip) return;
    folder.add({
      "onkey": (()=>{
        L.onkey({key:key.key[0]});
      })
    }, "onkey").name(key.softkey + " : " + key.text_ja);
    folder.close();
  });
});
GUI.folders[0].open();
GUI.folders[2].open();

GUI.domElement.style.opacity = 0.7;

document.getElementById("respectSignals").oninput = ()=>{
  L.onkey({key: "extra_respectSignals"});
}

socket.emit("join", {room: location.pathname.replace(/\/$/,"").replace(/.*\//g,"")});