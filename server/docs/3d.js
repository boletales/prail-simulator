import * as C from "./control.js";
import * as P from "./main.js";
import SpriteText from 'https://cdn.jsdelivr.net/npm/three-spritetext@1.8.0/+esm';

function v3(v){
  return new THREE.Vector3(-v.x*C.RAILLENGTH, v.z*C.HEIGHTUNIT ,v.y*C.RAILLENGTH);
}

function a3(v){
  return [-v.x*C.RAILLENGTH, v.z*C.HEIGHTUNIT ,v.y*C.RAILLENGTH];
}

export let L = new C.Layout();

const width  = window.screen.availWidth  *0.95;
const height = window.screen.availHeight *0.75;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 8000 );
camera.position.y = 100;
camera.position.z = -60;
camera.lookAt(new THREE.Vector3(0,0,0));

scene.add(camera);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 100, -10);
light.castShadow = true;
light.shadow.camera.position.set(0, 400, -10);
light.shadow.camera.left   = -600;
light.shadow.camera.right  =  600;
light.shadow.camera.top    =  600;
light.shadow.camera.bottom = -600;
light.shadow.mapSize.width  = 8192;
light.shadow.mapSize.height = 8192;
scene.add(light);

//let cameraHelper = new THREE.CameraHelper(light.shadow.camera);
//scene.add(cameraHelper);

const light2 = new THREE.AmbientLight( 0xffffff, 2.8);
scene.add(light2);

{
  const geometry = new THREE.PlaneGeometry( 500, 500);
  const material = new THREE.MeshStandardMaterial( { color: "#ac8", side:THREE.DoubleSide} );
  const plane = new THREE.Mesh( geometry, material );
  plane.receiveShadow = true;
  plane.position.z = 0;
  plane.position.y = -0.1
  plane.rotation.x = Math.PI/2;
  scene.add( plane );
}
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;
//renderer.outputEncoding = THREE.sRGBEncoding;
//renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.setClearColor(0xcceeff, 1);
renderer.setSize( width, height );
document.getElementById("main").appendChild( renderer.domElement );

const controls = new THREE.OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.2;

const tickrate = 1;
let tickcount = 0;

L.setOnTrainSelect((tid) => {
  document.getElementById("trainid").selectedIndex = Array.from(document.getElementById("trainid").childNodes).findIndex(e => e.value == tid);
});
document.getElementById("trainid").onchange = (e => L.selectTrainById(document.getElementById("trainid").value));

let meshrailmemo = [];
let geometryrailmemo = [];
let meshtrainmemo = [];
let materialmemo = [];
let staticgeometrymemo = [];
let staticmeshmemo = [];
let meshsignalmemo = [];
let meshsignalplatememo = [];
let meshinvalidroutememo = [];
let trainnotestrmemo = [];
let railnotestrmemo = [];
let trainflipmemo = [];
let trainnotespritememo = [];
let railnotespritememo = [];
function mergeMeshData(mds){
  return mds.reduce((d, e)=>{
    Object.keys(e.geometry).forEach(c=>{
              if(d.geometry[c] === undefined){
                d.geometry[c] = [];
              }
              d.geometry[c].push(...e.geometry[c]);
          });
    Object.keys(e.geometryshadow).forEach(c=>{
              if(d.geometryshadow[c] === undefined){
                d.geometryshadow[c] = [];
              }
              d.geometryshadow[c].push(...e.geometryshadow[c]);
          });
    d.mesh.push(...e.mesh);
    return d;
  },{geometry: {}, geometryshadow:{}, mesh:[]});
}

let lastupdate = -1;
let scenememo = {rails: [], trains: []};

export function forceUpdateModel(){
  lastupdate = -1;
}

export function clearCache() {
  meshrailmemo.forEach(r => r.forEach(x => {
    Object.keys(x.geometry).forEach(c => x.geometry[c].forEach(g => {g.dispose();}));
    Object.keys(x.geometryshadow).forEach(c => x.geometryshadow[c].forEach(g => {g.dispose();}));
    x.mesh.forEach(m => {scene.remove(m); m.geometry.dispose();});
  }));
  staticgeometrymemo.forEach(g => {g.dispose(); });
  staticmeshmemo.forEach(m => {scene.remove(m); });
  meshsignalmemo.forEach(mss => mss.forEach(ms => ms.forEach(m => {scene.remove(m); m.geometry.dispose()})));
  meshsignalplatememo.forEach(ms => ms.forEach(m => {scene.remove(m); m.geometry.dispose()}));
  meshinvalidroutememo.forEach(ms => ms.forEach(m => {scene.remove(m); m.geometry.dispose()}));
  meshtrainmemo.forEach(t => t.forEach(c => {scene.remove(c);}));
  railnotespritememo.forEach(x=>x.forEach(o=>scene.remove(o)));
  trainnotespritememo.forEach(o=>scene.remove(o));
  meshrailmemo = [];
  geometryrailmemo = [];
  meshtrainmemo = [];
  staticgeometrymemo = [];
  staticmeshmemo = [];
  meshsignalmemo = [];
  meshsignalplatememo = [];
  meshinvalidroutememo = [];
  trainnotestrmemo = [];
  railnotestrmemo = [];
  trainnotespritememo = [];
  railnotespritememo = [];
  trainflipmemo = [];
  scenememo = {rails:[], trains: []};
  lastupdate = -1;
}

function focusJoint () {
  let pos = P.fromJust()(P.getJointAbsPos(L.layout)(L.selectedJoint.nodeid)(L.selectedJoint.jointid));
  if(pos !== undefined){
    let {x, y, z} = v3(pos.coord);
    //camera.position.x = x+  60*Math.sin(pos.angle);
    //camera.position.y = y+ 100;
    //camera.position.z = z+  60*Math.cos(pos.angle);
    camera.position.set(x+  60*Math.sin(Math.PI), y + 100, z+  60*Math.cos(Math.PI));
    camera.lookAt(v3(pos.coord));
  }
}

function focusToPos(pos){
  if(pos !== undefined){
    let {x, y, z} = v3(pos.coord);
    camera.position.set(x+  60*Math.sin(pos.angle), y + 60, z+  60*Math.cos(pos.angle));
    camera.lookAt(v3(pos.coord));
  }
}

const loader = new THREE.FBXLoader();
const models = {};

function loadModel(name){
  return new Promise((res)=> 
    loader.load('./models/'+name+'.fbx', (fbx) => {
      models[name] = fbx;
      models[name].scale.set(1/200,1/200,1/200);
      models[name].position.y = 2.5;
      models[name].position.z = 5;
      res();
    }));
}

function main(){
  L.layout = P.defaultLayout;
  document.getElementById("fakeinput").onkeydown = ()=>{return true;};
  document.getElementById("fakeinput").onchange = ()=>{document.getElementById("fakeinput").value=""};
  let onclickold = renderer.domElement.onclick;
  renderer.domElement.onclick = (e) => {
    //onclickold(e);
    onclick(e);
  };

  Promise.all([
      loadModel("313_Mc")
    , loadModel("313_T")
    , loadModel("312_Tc")
  ]).then(()=>{
    L.load(clearCache);
    tick();
  })
}

function getfps(){
  return (time.length - 1) / (time[time.length-1] - time[0]) * 1000;
}
let time = [];
function tick(){
  tickcount++;
  time.push(new Date().getTime());
  if(time.length > 30){
    time.shift();
  }
  let speed = time.length >= 2 ? Math.min((time[time.length-1]-time[time.length-2])*60/1000, 5) : 1;
  L.tick(speed);
  if(tickcount % tickrate == 0){
    draw(L.layout);
  }
  requestAnimationFrame(tick);
}

function onclick(e){
  let rect = renderer.domElement.getBoundingClientRect();
  const raycaster = new THREE.Raycaster();
  const vector = new THREE.Vector2(
    ((e.clientX - rect.left) / renderer.domElement.width ) *  2 - 1,
    ((e.clientY - rect.top ) / renderer.domElement.height) * -2 + 1
  );
  console.log(vector);

  raycaster.setFromCamera(vector, camera);

  const intersects = raycaster.intersectObjects(scene.children.filter(e => e.isJoint));

  if (intersects.length) {
    L.selectedJoint.nodeid  = L.layout.rails.find((v) => v.instanceid == intersects[0].object.jointInfo.instanceid).nodeid;
    L.selectedJoint.jointid = intersects[0].object.jointInfo.jointid;
  }
}

const layerheight = 0.002;
function draw(layout){
  let rails_old = Object.assign(scenememo.rails);
  scenememo.rails = [];
  let existancememo_rails_old = [];
  let existancememo_rails = [];

  let trains_old = Object.assign(scenememo.trains);
  scenememo.trains = [];
  let existancememo_trains_old = [];
  let existancememo_trains = [];

  let ldi = P.layoutDrawInfo(layout);

  if(lastupdate != layout.updatecount){
    lastupdate = layout.updatecount;
    staticgeometrymemo.forEach(g => {g.dispose(); });
    staticgeometrymemo = [];
    let railexists = Array(layout.instancecount).fill(false);
    layout.rails.forEach(r=>railexists[r.nodeid] = true);
    railexists.forEach((e,i) => {if(!e && meshrailmemo[i] !== undefined) meshrailmemo[i].forEach(d => {
      Object.keys(d.geometry).forEach(c => d.geometry[c].forEach(g => g.dispose()));
      d.mesh.forEach(m => m.geometry.dispose());
    })});
    staticmeshmemo.forEach(m => {scene.remove(m); });
    staticmeshmemo = [];
    let data = mergeMeshData(ldi.rails.map(updateRailGeometory));
    Object.keys(data.geometry).forEach(c => {
      if(materialmemo[c] === undefined){
        materialmemo[c] = new THREE.MeshStandardMaterial({color: c, side: THREE.DoubleSide});
      }
      let geometry = THREE.BufferGeometryUtils.mergeBufferGeometries(data.geometry[c])
      let mesh = new THREE.Mesh(geometry, materialmemo[c]);
      staticgeometrymemo.push(geometry);
      staticmeshmemo.push(mesh);
      scene.add(mesh);
    });
    Object.keys(data.geometryshadow).forEach(c => {
      if(materialmemo[c] === undefined){
        materialmemo[c] = new THREE.MeshStandardMaterial({color: c, side: THREE.DoubleSide});
      }
      let geometry = THREE.BufferGeometryUtils.mergeBufferGeometries(data.geometryshadow[c]);
      let mesh = new THREE.Mesh(geometry, materialmemo[c]);
      staticgeometrymemo.push(geometry);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      staticmeshmemo.push(mesh);
      scene.add(mesh);
    });
    data.mesh.forEach((mesh)=>{
      staticmeshmemo.push(mesh);
      scene.add(mesh);
    });
    meshsignalmemo.forEach(mss => mss.forEach(ms => ms.forEach(m => {scene.remove(m); m.geometry.dispose()})));
    meshsignalplatememo.forEach(ms => ms.forEach(m => {scene.remove(m); m.geometry.dispose()}));
    meshinvalidroutememo.forEach(ms => ms.forEach(m => {scene.remove(m); m.geometry.dispose()}));
    ldi.signals.forEach(r => r.forEach(({indication, pos, signal}) => {scene.add(meshSignalPlate(pos, signal.nodeid, signal.jointid)) ;indication.forEach((c,i) => scene.add(meshSignal(pos, signal.nodeid, signal.jointid, i)))}));
    ldi.invalidRoutes.forEach(r => r.forEach(({indication, pos, signal}) => {scene.add(meshInvalidRoute(pos, signal.nodeid, signal.jointid)) ;}));
  }
  
  ldi.signals.forEach(s => s.forEach(({indication, pos, signal}) => {
      indication.forEach((color, i) => meshsignalmemo[signal.nodeid][signal.jointid][i].material = signalMaterials[color]);
      meshsignalplatememo[signal.nodeid][signal.jointid].material = signal.restraint ? signalPlateRestraintMaterial : (signal.manualStop ? signalPlateStoppedMaterial : signalPlateMaterial);
    }));
  
  ldi.rails.forEach((di) => {
    if(railnotestrmemo[di.instance.instanceid] !== di.instance.note){
      updateRailNote(di);
      railnotestrmemo[di.instance.instanceid] = di.instance.note;
    }
  });
  ldi.trains.forEach((di) => {
    scenememo.trains[di.trainid] = meshsTrain(di);
    let note = di.note + ((di.tags.length > 0) ? (" : " + di.tags[0].split("→").slice(0, 1).join("")) : "");
    
    if(document.getElementById("lockon").checked && di.trainid == L.selectedTrain){
      let n = v3(di.cars[0].head.m.coord).clone().sub(v3(di.cars[di.cars.length-1].tail.m.coord)).normalize();
      focusToPos({coord: di.cars[0].head.m.coord, angle: Math.atan2(-n.x, -n.z)});
    }
    
    if(railnotestrmemo[di.trainid] !== note){
      updateTrainNote(di, note);
      railnotestrmemo[di.trainid] = note;
    }
    if(trainflipmemo[di.trainid] != di.flipped){
      updateTrainNote(di, note);
      trainflipmemo[di.trainid] = di.flipped;
    }
  });
  trains_old.forEach(r => {
    existancememo_trains_old[r.trainid] = true;
  });
  scenememo.trains.forEach(r => {
    existancememo_trains[r.trainid] = true;
  });
  existancememo_trains    .forEach((s, i) =>{if(s !== existancememo_trains_old[i] && scenememo.trains[i]!==undefined) scenememo.trains[i].objects.forEach(mesh => scene.add   (mesh))});
  existancememo_trains_old.forEach((s, i) =>{if(s !== existancememo_trains    [i] && trains_old      [i]!==undefined) trains_old      [i].objects.forEach(mesh => scene.remove(mesh))});
  
  updateMeshSelectionMark(layout, L.selectedJoint);

  renderer.render( scene, camera );

  let p = P.fromJust()(P.getJointAbsPos(layout)(L.selectedJoint.nodeid)(L.selectedJoint.jointid));
  if(p === undefined){
    document.getElementById("coord").innerText = C.coordStr(P.poszero.coord) + "   selected: none    " + getfps().toFixed(0) + "fps" ;
  }else{
    document.getElementById("coord").innerText = C.coordStr(p.coord) + "   selected: " + L.selectedJoint.nodeid + "-" + L.selectedJoint.jointid + "    " + getfps().toFixed(0) + "fps" ;
  }
  

  let oldtrainopts = Array.from(document.getElementById("trainid").childNodes);
  oldtrainopts.forEach(e => {if(L.layout.trains.every(t => t.trainid != e.value)){document.getElementById("trainid").removeChild(e)}});
  L.layout.trains.forEach(t => {
    let elem = oldtrainopts.find(e=>e.value == t.trainid);
    if(elem == undefined){
      elem = document.createElement("option");
      elem.textContent = "編成 #" + (t.trainid + 1) + " " + t.note;
      elem.value = t.trainid;
      document.getElementById("trainid").appendChild(elem);
    }else{
      if(elem.textContent != "編成 #" + (t.trainid + 1) + " " + t.note){
        elem.textContent = "編成 #" + (t.trainid + 1) + " " + t.note;
      }
    }
  });
  if(document.getElementById("trainid").value != L.selectedTrain){
    document.getElementById("trainid").selectedIndex = Array.from(document.getElementById("trainid").childNodes).findIndex(e => e.value == L.selectedTrain);
  }
  let train = L.layout.trains.find(t => t.trainid == L.selectedTrain);
  if(train !== undefined){
    if(document.getElementById("lockon").checked) document.getElementById("coord").innerText += "  " + speedStr(train);
    //document.getElementById("trainid").innerText = "編成 #" + (L.selectedTrain+1);
    document.getElementById("speedinfo").innerText = speedStr(train);
    document.getElementById("trainnote").value = train.note;
    document.getElementById("traintags").value = train.tags.join("\n");

    document.getElementById("notchplus").onclick  = ()=> L.onkey({key: L.keycontrols.signal.keys.notchPlus.key[0]     }, {trainid: L.selectedTrain});
    document.getElementById("notchminus").onclick = ()=> L.onkey({key: L.keycontrols.signal.keys.notchMinus.key[0]    }, {trainid: L.selectedTrain});
    document.getElementById("reverse").onclick    = ()=> L.onkey({key: L.keycontrols.signal.keys.notchMinus.key[0]    }, {trainid: L.selectedTrain});
    document.getElementById("trainnote").oninput  = ()=> L.onkey({key: L.keycontrols.signal.keys.editTrainNoteS.key[0]}, {trainid: L.selectedTrain, note: document.getElementById("trainnote").value});
    document.getElementById("traintags").oninput  = ()=> L.onkey({key: L.keycontrols.signal.keys.setTrainTagsS.key[0] }, {trainid: L.selectedTrain, tags: document.getElementById("traintags").value});
    document.getElementById("applyrule").onclick  = ()=> L.onkey({key: L.keycontrols.signal.keys.resetSignalRulePhaseS.key[0] }, {trainid: L.selectedTrain});

    document.getElementById("notchplus").disabled = false;
    document.getElementById("notchminus").disabled = false;
    document.getElementById("reverse").disabled    = train.speed > 0;
    document.getElementById("trainnote").disabled = false;
    document.getElementById("traintags").disabled = false;
    document.getElementById("applyrule").disabled = false;
  }else{
    document.getElementById("notchplus").disabled = true;
    document.getElementById("notchminus").disabled = true;
    document.getElementById("reverse").disabled    = true;
    document.getElementById("trainnote").disabled = true;
    document.getElementById("traintags").disabled = true;
    document.getElementById("applyrule").disabled = true;
  }

  if(L.layout.rails[L.selectedJoint.nodeid] !== undefined){
    document.getElementById("railnote").value   = L.layout.rails[L.selectedJoint.nodeid].note;
    document.getElementById("railnote").oninput      = ()=> L.onkey({key: L.keycontrols.signal.keys.editRailNote.key[0]}, {note: document.getElementById("railnote").value});
    let signal = L.layout.rails[L.selectedJoint.nodeid].signals.find(s => s.jointid == L.selectedJoint.jointid);
    if(signal !== undefined){
      document.getElementById("signalrules").value   = P.encodeSignalRules(signal.rules).join("\n");
      document.getElementById("signalrules").oninput = ()=> L.onkey({key: L.keycontrols.signal.keys.setSignalRules.key[0]}, {rules: document.getElementById("signalrules").value});
      document.getElementById("signalrules").disabled = false;
    }else{
      document.getElementById("signalrules").disabled = true;
    }
  }else{
    document.getElementById("railnote").disabled = true;
    document.getElementById("signalrules").disabled = true;
  }
/*
  <span>列車操作：</span><br>
  <span id="trainid"></span><br>
  <span>ノッチ操作：</span><input type="button" id="notchplus" value="+(j)"><input type="button" id="notchminus" value="-(k)"><span id="speedinfo"><br>
  <label>列車番号：<input id="trainnote"></label><br>
  <label>列車タグ：<textarea id="traintags"></textarea></label><br>
</div>
<div id="railcontrol">
  <span>レール操作：</span><br>
  <label>レール注釈：<input id="railnote"></label><br>
  <label>信号制御：<textarea id="signalrules"></textarea></label><br>
</div>*/
}

function speedStr(train){
  let maxnotch = P.getMaxNotch(L.layout)(train);
  let margin   = P.getMarginFromBrakePattern(L.layout)(train);
  let notchToStr = (n) => (train.notch == 0 ? "N" : (n>0 ? "P"+n : "B"+(-n)));
  return notchToStr(train.notch) + (train.notch < maxnotch ? "" : (" -> " + notchToStr(maxnotch))) + "  " + (train.speed / P.speedScale).toFixed(1) + "km/h  " + "("+margin.toFixed(2)+")";
}

function updateRailNote(drawinfo){
  if(railnotespritememo[drawinfo.instance.instanceid] !== undefined){
    railnotespritememo[drawinfo.instance.instanceid].forEach(o=>scene.remove(o));
  }
  if(drawinfo.instance.note != ""){
    let rail = L.layout.rails.find(r=>r.instanceid == drawinfo.instance.instanceid);
    if(rail ==undefined) return;

    let center = drawinfo.joints.map(j=>a3(j.coord)).reduce((a,c) => [a[0]+c[0], a[1]+c[1], a[2]+c[2]], [0,0,0]).map(x => x/drawinfo.joints.length);

    let sprite = new SpriteText(drawinfo.instance.note, 10, "#fff");
    sprite.strokeWidth = 0.5;
    sprite.strokeColor = "#000";
    sprite.material.opacity = 0.1;
    scene.add(sprite);
    let cone = meshNote(center);
    scene.add(cone);
    sprite.position.set(center[0], center[1]+20, center[2]);
    railnotespritememo[drawinfo.instance.instanceid] = [sprite, cone];
  }
}

function updateTrainNote(drawinfo, note){
  let mesh = meshtrainmemo[drawinfo.trainid][drawinfo.flipped ? drawinfo.cars.length-1 : 0];
  if(mesh !== undefined){
    if(trainnotespritememo[drawinfo.trainid] !== undefined){
      meshtrainmemo[drawinfo.trainid].forEach(m => m.remove(trainnotespritememo[drawinfo.trainid]));
    }
    if(note != ""){
      let sprite = new SpriteText(note, 5, "#fff");
      sprite.strokeWidth = 1;
      sprite.strokeColor = "#000";
      sprite.material.opacity = 0.3;
      sprite.position.set(0, 10, 0);
      mesh.add(sprite);
      trainnotespritememo[drawinfo.trainid] = sprite;
    }
  }
}

function updateRailGeometory({rails : rails, additionals: additionals, joints : joints, instance: instance}){
  let instanceid = instance.instanceid;
  let state = instance.state;
  if(meshrailmemo.length <= instanceid){
    for(let i=meshrailmemo.length-1; i<=instanceid; i++) meshrailmemo.push([]);
  }

  if(meshrailmemo[instanceid][state] !== undefined){
    return meshrailmemo[instanceid][state];
  }
  let data = [];
  rails.forEach((p, i) => data.push(meshRailPart(p, i)));
  joints.forEach((p) => {if(p.isPlus) data.push(meshJoint(p)) });
  joints.forEach((p) => {data.push(meshsPier(p))});
  joints.forEach((p, i) => {data.push(meshJointButton(p, instanceid, i))});

  meshrailmemo[instanceid][state] = mergeMeshData(data.flat());
  data = null;
  return meshrailmemo[instanceid][state];
}

function meshRailPart(part, index){
  let geometry = new THREE.BufferGeometry();

  let tmax = P.splitSize(part.shape);
  let points = [];
  for(let i=0;i<=tmax;i++){
    let c = P.getDividingPoint_rel(part.shape.start)(part.shape.end)( C.RAILWIDTH/C.RAILLENGTH/2)(i/tmax*1.02 -0.01).coord;
    c.z += index * layerheight;
    points.push(new a3(c));
  }
  for(let i=0;i<=tmax;i++){
    let c = P.getDividingPoint_rel(part.shape.start)(part.shape.end)(-C.RAILWIDTH/C.RAILLENGTH/2)(i/tmax*1.02 -0.01).coord;
    c.z += index * layerheight;
    points.push(new a3(c));
  }

  let faces = [];
  for(let i=0;i<tmax;i++){
    faces.push([i, i+(tmax+1)+1, i+(tmax+1)  ]);
    faces.push([i, i+1         , i+(tmax+1)+1]);
  }

  let vertices = faces.flatMap(f => f.flatMap(i => points[i])).flat();
  let backpoints = points.map(p => [p[0],p[1]-0.1,p[2]]);
  let vertices2 = faces.flatMap(f => f.reverse().flatMap(i => backpoints[i])).flat();
  geometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(vertices.concat(vertices2)),3));
  geometry.computeVertexNormals();

  let color = part.color;
  if(materialmemo[color] === undefined){
    materialmemo[color] = new THREE.MeshStandardMaterial({color: color, roughness:1.0})
  }
  //let mesh = new THREE.Mesh(geometry, materialmemo[color]);
  //mesh.castShadow = true;
  //mesh.receiveShadow = true;
  //mesh.matrixAutoUpdate = false;
  
  //let mesh = new THREE.Mesh(geometry, materialmemo[color]);
  let data = {mesh: [], geometry: {}, geometryshadow:{}};
  data.geometryshadow[color] = [geometry];
  return data;
}

const jointColor = "#018";
function meshJoint(p){
    let w = C.RAILWIDTH/C.RAILLENGTH;
    let h = 0.1;
    let d = 0.0;
    let points = [
      {x: p.coord.x + Math.sin(p.angle)*w/2 + Math.cos(p.angle)*(  d), y: p.coord.y - Math.cos(p.angle)*w/2 + Math.sin(p.angle)*(  d), z: p.coord.z + layerheight * 10},
      {x: p.coord.x - Math.sin(p.angle)*w/2 + Math.cos(p.angle)*(  d), y: p.coord.y + Math.cos(p.angle)*w/2 + Math.sin(p.angle)*(  d), z: p.coord.z + layerheight * 10},
      {x: p.coord.x                         + Math.cos(p.angle)*(h+d), y: p.coord.y                         + Math.sin(p.angle)*(h+d), z: p.coord.z + layerheight * 10},
    ].map(a3);

    let geometry = new THREE.BufferGeometry();
    let faces = [[0, 1, 2]];
    let vertices = new Float32Array(faces.flatMap(f => f.flatMap(i => points[i])).flat());
    geometry.setAttribute('position',new THREE.BufferAttribute(vertices,3));
    geometry.computeVertexNormals();

    let color = jointColor;
    if(materialmemo[color] === undefined){
      materialmemo[color] = new THREE.MeshBasicMaterial({color: color, side: THREE.DoubleSide});
    }

    let data = {mesh: [], geometry: {}, geometryshadow:{}};
    data.geometry[color] = [geometry];
    return data;

}

let transparentButtonMaterial = new THREE.MeshBasicMaterial({visible: false, side: THREE.DoubleSide});
function meshJointButton(p, instanceid, jointid){
    let w = C.RAILWIDTH/C.RAILLENGTH;
    let h = 0.2;
    let d = -0.2;
    let points = [
      {x: p.coord.x + Math.sin(p.angle)*w/2 + Math.cos(p.angle)*(  d), y: p.coord.y - Math.cos(p.angle)*w/2 + Math.sin(p.angle)*(  d), z: p.coord.z + layerheight * 10},
      {x: p.coord.x - Math.sin(p.angle)*w/2 + Math.cos(p.angle)*(  d), y: p.coord.y + Math.cos(p.angle)*w/2 + Math.sin(p.angle)*(  d), z: p.coord.z + layerheight * 10},
      {x: p.coord.x + Math.sin(p.angle)*w/2 + Math.cos(p.angle)*(h+d), y: p.coord.y - Math.cos(p.angle)*w/2 + Math.sin(p.angle)*(h+d), z: p.coord.z + layerheight * 10},
      {x: p.coord.x - Math.sin(p.angle)*w/2 + Math.cos(p.angle)*(h+d), y: p.coord.y + Math.cos(p.angle)*w/2 + Math.sin(p.angle)*(h+d), z: p.coord.z + layerheight * 10},
    ].map(a3);

    let geometry = new THREE.BufferGeometry();
    let faces = [[0, 1, 2],[1, 2, 3]];
    let vertices = new Float32Array(faces.flatMap(f => f.flatMap(i => points[i])).flat());
    geometry.setAttribute('position',new THREE.BufferAttribute(vertices,3));
    geometry.computeVertexNormals();

    let mesh = new THREE.Mesh(geometry, transparentButtonMaterial);
    mesh.matrixAutoUpdate = false;

    mesh.isJoint = true;
    mesh.jointInfo = {instanceid: instanceid, jointid:jointid};

    let data = {mesh: [mesh], geometry: {}, geometryshadow:{}};
    return data;
}

const signalColors = ["#800", "#f80", "#ff0", "#0f4", "#0ee"];
const signalMaterials = 
  signalColors.map (c => new THREE.MeshBasicMaterial({color: c, side: THREE.DoubleSide}));
const signalPlateMaterial = new THREE.MeshBasicMaterial({color: "#222", side: THREE.DoubleSide});
const signalPlateStoppedMaterial = new THREE.MeshBasicMaterial({color: "#a00", side: THREE.DoubleSide});
const signalPlateRestraintMaterial = new THREE.MeshBasicMaterial({color: "#80d", side: THREE.DoubleSide});
const invalidRouteMaterial = new THREE.MeshBasicMaterial({color: "#500", side: THREE.DoubleSide});
const notePlateMaterial = new THREE.MeshBasicMaterial({color: "#fff", side: THREE.DoubleSide, opacity: 0.5, transparent:true});


function meshNote(realcoord){
  let w = C.RAILWIDTH;
  let edges = 8;
  let px = [realcoord[0], realcoord[1] +  5, realcoord[2]];
  let points = Array(edges).fill(null).map((c,i) =>
    [realcoord[0] + Math.cos(Math.PI*2/edges*i)*(w/3), realcoord[1] + 10, realcoord[2] +  Math.sin(Math.PI*2/edges*i)*(w/3)]
  ).concat([px]);

  let geometry = new THREE.BufferGeometry();
  let faces = Array(edges).fill(null).map((c,i) => [edges, (i+0)%edges, (i+1)%edges]);
  let vertices = new Float32Array(faces.flatMap(f => f.flatMap(i => points[i])).flat());
  geometry.setAttribute('position',new THREE.BufferAttribute(vertices,3));
  geometry.computeVertexNormals();

  let mesh = new THREE.Mesh(geometry, notePlateMaterial);

  return mesh;
}
function meshSignal(p, nodeid, jointid, routeid){
    let w = 0.03;
    let h = 0.2;
    let d = -0.2;
    let dw = -0.07 + 0.05 * routeid;
    let points = [
      {x: p.coord.x + Math.sin(p.angle)*(-dw+w/2) + Math.cos(p.angle)*(  d), y: p.coord.y + Math.cos(p.angle)*(dw-w/2) + Math.sin(p.angle)*(  d), z: p.coord.z + layerheight * 13},
      {x: p.coord.x + Math.sin(p.angle)*(-dw-w/2) + Math.cos(p.angle)*(  d), y: p.coord.y + Math.cos(p.angle)*(dw+w/2) + Math.sin(p.angle)*(  d), z: p.coord.z + layerheight * 13},
      {x: p.coord.x + Math.sin(p.angle)*(-dw+w/2) + Math.cos(p.angle)*(h+d), y: p.coord.y + Math.cos(p.angle)*(dw-w/2) + Math.sin(p.angle)*(h+d), z: p.coord.z + layerheight * 13},
      {x: p.coord.x + Math.sin(p.angle)*(-dw-w/2) + Math.cos(p.angle)*(h+d), y: p.coord.y + Math.cos(p.angle)*(dw+w/2) + Math.sin(p.angle)*(h+d), z: p.coord.z + layerheight * 13},
    ].map(a3);
    let geometry = new THREE.BufferGeometry();
    let faces = [[0, 1, 2],[1, 2, 3]];
    let vertices = new Float32Array(faces.flatMap(f => f.flatMap(i => points[i])).flat());
    geometry.setAttribute('position',new THREE.BufferAttribute(vertices,3));
    geometry.computeVertexNormals();

    let mesh = new THREE.Mesh(geometry, signalMaterials[0]);
    mesh.matrixAutoUpdate = false;


    if(meshsignalmemo.length <= nodeid){
      for(let i=meshsignalmemo.length; i<=nodeid; i++) meshsignalmemo.push([]);
    }
    if(meshsignalmemo[nodeid].length <= jointid){
      for(let i=meshsignalmemo[nodeid].length; i<=jointid; i++) meshsignalmemo[nodeid].push([]);
    }
    meshsignalmemo[nodeid][jointid][routeid] = mesh;

    return mesh;
}
function meshSignalPlate(p, nodeid, jointid){
    let w = C.RAILWIDTH/C.RAILLENGTH;
    let h = 0.2;
    let d = -0.2;
    let points = [
      {x: p.coord.x + Math.sin(p.angle)*(+w/1.6) + Math.cos(p.angle)*(  d), y: p.coord.y + Math.cos(p.angle)*(-w/1.6) + Math.sin(p.angle)*(  d), z: p.coord.z + layerheight * 10},
      {x: p.coord.x + Math.sin(p.angle)*(-w/1.6) + Math.cos(p.angle)*(  d), y: p.coord.y + Math.cos(p.angle)*(+w/1.6) + Math.sin(p.angle)*(  d), z: p.coord.z + layerheight * 10},
      {x: p.coord.x + Math.sin(p.angle)*(+w/2) + Math.cos(p.angle)*(h+d), y: p.coord.y + Math.cos(p.angle)*(-w/2) + Math.sin(p.angle)*(h+d), z: p.coord.z + layerheight * 10},
      {x: p.coord.x + Math.sin(p.angle)*(-w/2) + Math.cos(p.angle)*(h+d), y: p.coord.y + Math.cos(p.angle)*(+w/2) + Math.sin(p.angle)*(h+d), z: p.coord.z + layerheight * 10},
    ].map(a3);

    let geometry = new THREE.BufferGeometry();
    let faces = [[0, 1, 2],[1, 2, 3]];
    let vertices = new Float32Array(faces.flatMap(f => f.flatMap(i => points[i])).flat());
    geometry.setAttribute('position',new THREE.BufferAttribute(vertices,3));
    geometry.computeVertexNormals();

    let mesh = new THREE.Mesh(geometry, signalPlateMaterial);
    mesh.matrixAutoUpdate = false;


    if(meshsignalplatememo.length <= nodeid){
      for(let i=meshsignalplatememo.length; i<=nodeid; i++) meshsignalplatememo.push([]);
    }
    meshsignalplatememo[nodeid][jointid] = mesh;

    return mesh;
}

function meshInvalidRoute(p, nodeid, jointid){
    let w = C.RAILWIDTH/C.RAILLENGTH;
    let h = 0.2;
    let d = -0.2;
    let points = [
      {x: p.coord.x + Math.sin(p.angle)*(+w/2) + Math.cos(p.angle)*(  d), y: p.coord.y + Math.cos(p.angle)*(-w/2) + Math.sin(p.angle)*(  d), z: p.coord.z + layerheight * 10},
      {x: p.coord.x + Math.sin(p.angle)*(-w/2) + Math.cos(p.angle)*(  d), y: p.coord.y + Math.cos(p.angle)*(+w/2) + Math.sin(p.angle)*(  d), z: p.coord.z + layerheight * 10},
      {x: p.coord.x + Math.sin(p.angle)*(+w/2) + Math.cos(p.angle)*(h+d), y: p.coord.y + Math.cos(p.angle)*(-w/2) + Math.sin(p.angle)*(h+d), z: p.coord.z + layerheight * 10},
      {x: p.coord.x + Math.sin(p.angle)*(-w/2) + Math.cos(p.angle)*(h+d), y: p.coord.y + Math.cos(p.angle)*(+w/2) + Math.sin(p.angle)*(h+d), z: p.coord.z + layerheight * 10},
    ].map(a3);

    let geometry = new THREE.BufferGeometry();
    let faces = [[0, 1, 2],[1, 2, 3]];
    let vertices = new Float32Array(faces.flatMap(f => f.flatMap(i => points[i])).flat());
    geometry.setAttribute('position',new THREE.BufferAttribute(vertices,3));
    geometry.computeVertexNormals();

    let mesh = new THREE.Mesh(geometry, invalidRouteMaterial);
    mesh.matrixAutoUpdate = false;


    if(meshinvalidroutememo.length <= nodeid){
      for(let i=meshinvalidroutememo.length; i<=nodeid; i++) meshinvalidroutememo.push([]);
    }
    meshinvalidroutememo[nodeid][jointid] = mesh;

    return mesh;
}

const pierColor = "#dddd00";
function meshsPier(p){
  const pierWidth      = 9.5/C.RAILLENGTH;
  const pierLength     = 2.0/C.RAILLENGTH;
  const pierMarginH    = 0.1/C.HEIGHTUNIT;
  const pierThicknessH = 1.0/C.HEIGHTUNIT;
  const pierThicknessW = 1.0/C.RAILLENGTH;
  const minipierThicknessW = 2.0/C.RAILLENGTH;

  let meshs = [];
  let vs = [];
  let z = 0;
  for(; z+0.01<Math.floor(p.coord.z); z++){
    let points = [
      {x: p.coord.x + Math.sin(p.angle)*pierWidth/2                    + Math.cos(p.angle)*pierLength/2, y: p.coord.y - Math.cos(p.angle)*pierWidth/2                    + Math.sin(p.angle)*pierLength/2, z: z + 1 - pierMarginH    - layerheight * 2},
      {x: p.coord.x - Math.sin(p.angle)*pierWidth/2                    + Math.cos(p.angle)*pierLength/2, y: p.coord.y + Math.cos(p.angle)*pierWidth/2                    + Math.sin(p.angle)*pierLength/2, z: z + 1 - pierMarginH    - layerheight * 2},
      {x: p.coord.x - Math.sin(p.angle)*pierWidth/2                    - Math.cos(p.angle)*pierLength/2, y: p.coord.y + Math.cos(p.angle)*pierWidth/2                    - Math.sin(p.angle)*pierLength/2, z: z + 1 - pierMarginH    - layerheight * 2},
      {x: p.coord.x + Math.sin(p.angle)*pierWidth/2                    - Math.cos(p.angle)*pierLength/2, y: p.coord.y - Math.cos(p.angle)*pierWidth/2                    - Math.sin(p.angle)*pierLength/2, z: z + 1 - pierMarginH    - layerheight * 2},
      {x: p.coord.x + Math.sin(p.angle)*(pierWidth/2 - pierThicknessW) + Math.cos(p.angle)*pierLength/2, y: p.coord.y - Math.cos(p.angle)*(pierWidth/2 - pierThicknessW) + Math.sin(p.angle)*pierLength/2, z: z + 1 - pierMarginH    - layerheight * 2},
      {x: p.coord.x - Math.sin(p.angle)*(pierWidth/2 - pierThicknessW) + Math.cos(p.angle)*pierLength/2, y: p.coord.y + Math.cos(p.angle)*(pierWidth/2 - pierThicknessW) + Math.sin(p.angle)*pierLength/2, z: z + 1 - pierMarginH    - layerheight * 2},
      {x: p.coord.x - Math.sin(p.angle)*(pierWidth/2 - pierThicknessW) - Math.cos(p.angle)*pierLength/2, y: p.coord.y + Math.cos(p.angle)*(pierWidth/2 - pierThicknessW) - Math.sin(p.angle)*pierLength/2, z: z + 1 - pierMarginH    - layerheight * 2},
      {x: p.coord.x + Math.sin(p.angle)*(pierWidth/2 - pierThicknessW) - Math.cos(p.angle)*pierLength/2, y: p.coord.y - Math.cos(p.angle)*(pierWidth/2 - pierThicknessW) - Math.sin(p.angle)*pierLength/2, z: z + 1 - pierMarginH    - layerheight * 2},
      {x: p.coord.x + Math.sin(p.angle)*pierWidth/2                    + Math.cos(p.angle)*pierLength/2, y: p.coord.y - Math.cos(p.angle)*pierWidth/2                    + Math.sin(p.angle)*pierLength/2, z: z + 1 - pierThicknessH - layerheight * 2},
      {x: p.coord.x - Math.sin(p.angle)*pierWidth/2                    + Math.cos(p.angle)*pierLength/2, y: p.coord.y + Math.cos(p.angle)*pierWidth/2                    + Math.sin(p.angle)*pierLength/2, z: z + 1 - pierThicknessH - layerheight * 2},
      {x: p.coord.x - Math.sin(p.angle)*pierWidth/2                    - Math.cos(p.angle)*pierLength/2, y: p.coord.y + Math.cos(p.angle)*pierWidth/2                    - Math.sin(p.angle)*pierLength/2, z: z + 1 - pierThicknessH - layerheight * 2},
      {x: p.coord.x + Math.sin(p.angle)*pierWidth/2                    - Math.cos(p.angle)*pierLength/2, y: p.coord.y - Math.cos(p.angle)*pierWidth/2                    - Math.sin(p.angle)*pierLength/2, z: z + 1 - pierThicknessH - layerheight * 2},
      {x: p.coord.x + Math.sin(p.angle)*(pierWidth/2 - pierThicknessW) + Math.cos(p.angle)*pierLength/2, y: p.coord.y - Math.cos(p.angle)*(pierWidth/2 - pierThicknessW) + Math.sin(p.angle)*pierLength/2, z: z + 1 - pierThicknessH - layerheight * 2},
      {x: p.coord.x - Math.sin(p.angle)*(pierWidth/2 - pierThicknessW) + Math.cos(p.angle)*pierLength/2, y: p.coord.y + Math.cos(p.angle)*(pierWidth/2 - pierThicknessW) + Math.sin(p.angle)*pierLength/2, z: z + 1 - pierThicknessH - layerheight * 2},
      {x: p.coord.x - Math.sin(p.angle)*(pierWidth/2 - pierThicknessW) - Math.cos(p.angle)*pierLength/2, y: p.coord.y + Math.cos(p.angle)*(pierWidth/2 - pierThicknessW) - Math.sin(p.angle)*pierLength/2, z: z + 1 - pierThicknessH - layerheight * 2},
      {x: p.coord.x + Math.sin(p.angle)*(pierWidth/2 - pierThicknessW) - Math.cos(p.angle)*pierLength/2, y: p.coord.y - Math.cos(p.angle)*(pierWidth/2 - pierThicknessW) - Math.sin(p.angle)*pierLength/2, z: z + 1 - pierThicknessH - layerheight * 2},
      {x: p.coord.x + Math.sin(p.angle)*pierWidth/2                    + Math.cos(p.angle)*pierLength/2, y: p.coord.y - Math.cos(p.angle)*pierWidth/2                    + Math.sin(p.angle)*pierLength/2, z: z                      - layerheight * 2},
      {x: p.coord.x - Math.sin(p.angle)*pierWidth/2                    + Math.cos(p.angle)*pierLength/2, y: p.coord.y + Math.cos(p.angle)*pierWidth/2                    + Math.sin(p.angle)*pierLength/2, z: z                      - layerheight * 2},
      {x: p.coord.x - Math.sin(p.angle)*pierWidth/2                    - Math.cos(p.angle)*pierLength/2, y: p.coord.y + Math.cos(p.angle)*pierWidth/2                    - Math.sin(p.angle)*pierLength/2, z: z                      - layerheight * 2},
      {x: p.coord.x + Math.sin(p.angle)*pierWidth/2                    - Math.cos(p.angle)*pierLength/2, y: p.coord.y - Math.cos(p.angle)*pierWidth/2                    - Math.sin(p.angle)*pierLength/2, z: z                      - layerheight * 2},
      {x: p.coord.x + Math.sin(p.angle)*(pierWidth/2 - pierThicknessW) + Math.cos(p.angle)*pierLength/2, y: p.coord.y - Math.cos(p.angle)*(pierWidth/2 - pierThicknessW) + Math.sin(p.angle)*pierLength/2, z: z                      - layerheight * 2},
      {x: p.coord.x - Math.sin(p.angle)*(pierWidth/2 - pierThicknessW) + Math.cos(p.angle)*pierLength/2, y: p.coord.y + Math.cos(p.angle)*(pierWidth/2 - pierThicknessW) + Math.sin(p.angle)*pierLength/2, z: z                      - layerheight * 2},
      {x: p.coord.x - Math.sin(p.angle)*(pierWidth/2 - pierThicknessW) - Math.cos(p.angle)*pierLength/2, y: p.coord.y + Math.cos(p.angle)*(pierWidth/2 - pierThicknessW) - Math.sin(p.angle)*pierLength/2, z: z                      - layerheight * 2},
      {x: p.coord.x + Math.sin(p.angle)*(pierWidth/2 - pierThicknessW) - Math.cos(p.angle)*pierLength/2, y: p.coord.y - Math.cos(p.angle)*(pierWidth/2 - pierThicknessW) - Math.sin(p.angle)*pierLength/2, z: z                      - layerheight * 2},
    ].map(a3);

    let faces = [
        [0,  1,  2]
      , [0,  2,  3]
      , [0,  1,  9]
      , [0,  9,  8]
      , [3,  2, 10]
      , [3, 10, 11]
      , [0,  4, 20]
      , [0, 20, 16]
      , [1,  5, 21]
      , [1, 21, 17]
      , [2,  6, 22]
      , [2, 22, 18]
      , [3,  7, 23]
      , [3, 23, 19]
      , [0,  3, 19]
      , [0, 19, 16]
      , [1,  2, 18]
      , [1, 18, 17]
    ];
    vs = vs.concat(faces.flatMap(f => f.flatMap(i => points[i])).flat());
  }
  for(; z*4+0.01<Math.floor(p.coord.z*4); z+=0.25){
    let points = [
      {x: p.coord.x + Math.sin(p.angle)*pierWidth/2                        + Math.cos(p.angle)*pierLength/2, y: p.coord.y - Math.cos(p.angle)*pierWidth/2                        + Math.sin(p.angle)*pierLength/2, z: z + 0.25 - pierMarginH - layerheight * 2},
      {x: p.coord.x - Math.sin(p.angle)*pierWidth/2                        + Math.cos(p.angle)*pierLength/2, y: p.coord.y + Math.cos(p.angle)*pierWidth/2                        + Math.sin(p.angle)*pierLength/2, z: z + 0.25 - pierMarginH - layerheight * 2},
      {x: p.coord.x - Math.sin(p.angle)*pierWidth/2                        - Math.cos(p.angle)*pierLength/2, y: p.coord.y + Math.cos(p.angle)*pierWidth/2                        - Math.sin(p.angle)*pierLength/2, z: z + 0.25 - pierMarginH - layerheight * 2},
      {x: p.coord.x + Math.sin(p.angle)*pierWidth/2                        - Math.cos(p.angle)*pierLength/2, y: p.coord.y - Math.cos(p.angle)*pierWidth/2                        - Math.sin(p.angle)*pierLength/2, z: z + 0.25 - pierMarginH - layerheight * 2},
      {x: p.coord.x + Math.sin(p.angle)*pierWidth/2                        + Math.cos(p.angle)*pierLength/2, y: p.coord.y - Math.cos(p.angle)*pierWidth/2                        + Math.sin(p.angle)*pierLength/2, z: z + 0    - pierMarginH - layerheight * 2},
      {x: p.coord.x - Math.sin(p.angle)*pierWidth/2                        + Math.cos(p.angle)*pierLength/2, y: p.coord.y + Math.cos(p.angle)*pierWidth/2                        + Math.sin(p.angle)*pierLength/2, z: z + 0    - pierMarginH - layerheight * 2},
      {x: p.coord.x - Math.sin(p.angle)*pierWidth/2                        - Math.cos(p.angle)*pierLength/2, y: p.coord.y + Math.cos(p.angle)*pierWidth/2                        - Math.sin(p.angle)*pierLength/2, z: z + 0    - pierMarginH - layerheight * 2},
      {x: p.coord.x + Math.sin(p.angle)*pierWidth/2                        - Math.cos(p.angle)*pierLength/2, y: p.coord.y - Math.cos(p.angle)*pierWidth/2                        - Math.sin(p.angle)*pierLength/2, z: z + 0    - pierMarginH - layerheight * 2},
    ].map(a3);

    let faces = [
        [0,  1,  2]
      , [0,  2,  3]
      , [0,  3,  7]
      , [0,  7,  4]
      , [2,  1,  5]
      , [2,  5,  6]
      , [1,  0,  4]
      , [1,  4,  5]
      , [3,  2,  6]
      , [3,  6,  7]
    ];
    vs = vs.concat(faces.flatMap(f => f.flatMap(i => points[i])).flat());
  }

  if(vs.length > 0){
    let geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(vs),3));
    geometry.computeVertexNormals();

    let color = pierColor;
    if(materialmemo[color] === undefined){
      materialmemo[color] = new THREE.MeshStandardMaterial({color: color, side: THREE.DoubleSide});
    }

    let data = {mesh: [], geometry: {}, geometryshadow:{}};
    data.geometry[color] = [geometry];
    return data;
  }

  return [];
}

function easeFlash(_t){
  const a = 0.5;
  let t = _t%1;
  return t*(a*2-t)/(a*a);
}

const selectionColor = "#ffff00";
const selectionMaterial = new THREE.MeshBasicMaterial({color: selectionColor, transparent:true, side: THREE.DoubleSide});
const meshSelectionMark = (()=>{
    let w = 0.1;
    let h = 0.1;
    let d = -0.15;
    let points = [
      {x: + Math.sin(0)*w/2 + Math.cos(0)*(  d), y: - Math.cos(0)*w/2 + Math.sin(0)*(  d), z: 0 + layerheight * 12},
      {x: - Math.sin(0)*w/2 + Math.cos(0)*(  d), y: + Math.cos(0)*w/2 + Math.sin(0)*(  d), z: 0 + layerheight * 12},
      {x:                   + Math.cos(0)*(h+d), y:                   + Math.sin(0)*(h+d), z: 0 + layerheight * 12},
    ].map(a3);

    let geometry = new THREE.BufferGeometry();
    let faces = [[0, 1, 2]];
    let vertices = new Float32Array(faces.flatMap(f => f.flatMap(i => points[i])).flat());
    geometry.setAttribute('position',new THREE.BufferAttribute(vertices,3));
    geometry.computeVertexNormals();

    let mesh = new THREE.Mesh(geometry, selectionMaterial);

    return mesh;
})();
scene.add(meshSelectionMark);

function updateMeshSelectionMark(layout, selectedJoint){
  let p = P.fromJust()(P.getJointAbsPos(layout)(selectedJoint.nodeid)(selectedJoint.jointid));
  if(p !== undefined){
    //camera.lookAt(v3(p.coord));
    let a = a3(p.coord);
    meshSelectionMark.position.set(a[0], a[1], a[2]);
    meshSelectionMark.rotation.y = p.angle;
  }

  selectionMaterial.opacity = easeFlash(tickcount/60 /1);
}



function meshsTrain({cars, trainid, flipped}){
  let setpos = (c,i)=>{
    let chead = v3(c.head.m.coord);
    let ctail = v3(c.tail.m.coord);
    let n = chead.clone().sub(ctail).normalize();

    if(flipped){
      meshtrainmemo[trainid][cars.length-i-1].children.forEach(c=>c.position.z = 2);
      meshtrainmemo[trainid][cars.length-i-1].position.copy(chead);
      meshtrainmemo[trainid][cars.length-i-1].rotation.copy(new THREE.Euler( Math.asin(-n.y), Math.atan2( n.x,  n.z), 0, 'ZYX' ));
    }else{
      meshtrainmemo[trainid][i].children.forEach(c=>c.position.z = 8);
      meshtrainmemo[trainid][i].position.copy(chead);
      meshtrainmemo[trainid][i].rotation.copy(new THREE.Euler( Math.asin( n.y), Math.atan2(-n.x, -n.z), 0, 'ZYX' ));
    }
  };
  if(meshtrainmemo.length <= trainid){
    for(let i=meshtrainmemo.length; i<=trainid; i++) meshtrainmemo.push([]);
  }
  if(meshtrainmemo[trainid].length == cars.length){
    cars.forEach(setpos);
    return {
        trainid
      , objects: meshtrainmemo[trainid]
    };
  }
  cars.forEach((c,i) => {
      let obj = new THREE.Object3D();

      if(models.hasOwnProperty(c.type.type)){
        obj.add(models[c.type.type].clone(true));
      }else{
        const geometry = new THREE.BoxGeometry( 3.8, 5.0, 10.0 );
        const material = new THREE.MeshStandardMaterial( { color: 0x442200 * (6 - i) } );
        const cube = new THREE.Mesh( geometry, material );
        cube.position.set(0, 3.0, -8.0);
        obj.add(cube);
      }

      meshtrainmemo[trainid][i] = obj;
    });

  cars.forEach(setpos);

  return {
      trainid
    , objects: meshtrainmemo[trainid]
  };
}

export function download(){
  L.save();
  let d = document.createElement("a");
  d.download="layout.json";
  d.href=window.URL.createObjectURL(new Blob([localStorage.getItem("layout")], {"type":"application/json"}));
  d.click();
}

export function upload(){
  let files = document.getElementById("upload").files;
  if(files.length > 0){
    files[0].text().then(L.loadfrom.bind(L, clearCache));
  }
}



main();