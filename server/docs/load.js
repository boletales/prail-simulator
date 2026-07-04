import {download, L, clearCache, forceUpdateModel} from "../3d.js";
import * as P from "../main.js";
window.P = P;

window.upload = upload;
window.download = download;
window.L = L;
window.save = ()=>{L.save()};

function upload(){
  let files = document.getElementById("upload").files;
  if(files.length > 0){
    files[0].text().then(t => L.loadfrom(()=>(clearCache()), t));
  }
}

document.getElementById("minicontrols").onkeydown = (e)=>{e.stopPropagation(); true;};

document.onkeydown = ((e)=>{
  L.onkey(e, {trainid: L.selectedTrain});
});
L.refreshKeybinds();

clearCache();

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
    }, "onkey").name((key.softkey.startsWith("extra_") ? "" : key.softkey + " : ") + key.text_ja);
    folder.close();
  });
});
GUI.folders[0].open();
GUI.folders[2].open();

GUI.domElement.style.opacity = 0.7;

document.getElementById("respectSignals").oninput = ()=>{
  L.onkey({key: "extra_respectSignals"});
}

fetch("./preset/presets.json").then(res=>res.json()).then(presets=>{
  let select = document.getElementById("presets");
  select.innerHTML = "";
  {
    let option = document.createElement("option");
    option.value = "";
    option.textContent = "―― 作例を読み込む ――";
    select.appendChild(option);
  }
  presets.forEach(preset=>{
    let option = document.createElement("option");
    option.value = preset.file;
    option.textContent = preset.name;
    select.appendChild(option);
  });
  select.onchange = ()=>{
    let file = select.value;
    if(file === "") return;
    if(confirm("作例「"+select.options[select.selectedIndex].textContent+"」を読み込みます。現在のレイアウトは失われます。よろしいですか？")){
      fetch("./preset/layout/"+file).then(res=>res.text()).then(t=>{
        L.loadfrom(()=>(clearCache()), t);
      });
    }else{
      select.value = "";
    }
  };
  
  let presetParam = new URLSearchParams(window.location.search).get("preset");
  if(presetParam){
    let preset = presets.find(p=>p.file === presetParam);
    if(preset){
      select.value = preset.file;
      fetch("./preset/layout/"+preset.file).then(res=>res.text()).then(t=>{
        L.loadfrom(()=>(clearCache()), t);
      });
    }
  }
});