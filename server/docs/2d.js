import * as C from "./control.js";
import * as P from "./main.js";

const GUI = new lil.GUI();

export let L = new C.Layout();

Object.values(L.keycontrols).forEach(category => {
  let folder = GUI.addFolder(category.name);
  Object.values(category.keys).forEach(key => {
    folder.add(key, "onkey").name(key.softkey + " : " + key.text_ja);
    folder.close();
  });
});
GUI.folders[0].open();
GUI.folders[2].open();


let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let shapeMemo = {};
let jointMemo = [];

const tickrate = 4;
let tickcount = 0;

function main(){
  L.layout = P.defaultLayout;
  document.onkeydown = (e)=>(L.onkey(e));
  document.getElementById("fakeinput").onkeydown = ()=>{return true;};
  document.getElementById("fakeinput").onchange = ()=>{document.getElementById("fakeinput").value=""};
  canvas.onclick = onclick;
  L.load(()=>undefined);
  tick();
}
function tick(){
  tickcount++;
  if(tickcount % tickrate == 0){
    draw(L.layout, L.camera2d, ctx);
  }
  requestAnimationFrame(tick);
}





function onclick(e){
  let rect = canvas.getBoundingClientRect();
  let click = {
    cx: e.clientX - rect.left,
    cy: e.clientY - rect.top
  };
  console.log(e);

  let dist2min = (C.RAILLENGTH * 0.5 * L.camera2d.zoom) ** 2;
  let d = -0.1;
  let joint;
  jointMemo.forEach(e =>{
    let {cx, cy} = getCanvasCoord({x: e.joint.coord.x + Math.cos(e.joint.angle)*(d), y: e.joint.coord.y + Math.sin(e.joint.angle)*(d), z: e.joint.coord.z},L.camera2d);
    let dist2 = (click.cx - cx) ** 2 + (click.cy - cy) ** 2;
    if(dist2 < dist2min){
      dist2min = dist2;
      joint = e;
    }
  })
  if(joint !== undefined){
    L.selectedJoint.nodeid = joint.nodeid;
    L.selectedJoint.jointid = joint.jointid;
  }
}


function draw(layout, camera, ctx){
  ctx.fillStyle = "#efe"
  ctx.fillRect(0,0,canvas.width, canvas.height);
  jointMemo = [];
  let lde = P.layoutDrawInfo(layout).rails;
  lde.sort((a,b) => a.rails[0].shape.start.coord.z - b.rails[0].shape.start.coord.z);
  lde.forEach(({rails : rails, additionals: additionals, joints : joints}) => {
    rails .forEach(rail=>drawRailPart(rail, camera, ctx));
  });
  lde.forEach(({rails : rails, additionals: additionals, joints : joints, instance : instance}) => {
    let nodeid = instance.nodeid;
    joints.forEach((joint, jointid)=>{
      drawJoint(joint, camera, ctx);
      jointMemo.push({nodeid: nodeid, jointid:jointid, joint:joint});
    });
  });
  drawSelectionMark(layout, L.selectedJoint, camera, ctx);


  let p = P.fromJust()(P.getJointAbsPos(layout)(L.selectedJoint.nodeid)(L.selectedJoint.jointid));
  if(p !== undefined){
    document.getElementById("coord").innerText = C.coordStr(p.coord);
  }
}

function drawRailPart(part, camera, ctx){
  ctx.beginPath();
  let points = shapeToPoints(part.shape);
  if(points.length==0){
    return;
  }
  ctx_moveTo(points[points.length-1],camera, ctx);
  points.forEach(p => ctx_lineTo(p, camera, ctx));
  ctx.fillStyle = part.color;
  ctx.fillStyle = colorChange(ctx.fillStyle, points[0].z/3);
  ctx.fill();
}

function colorChange(c,t){
  let r = parseInt(c.slice(1,3),16);
  let g = parseInt(c.slice(3,5),16);
  let b = parseInt(c.slice(5,7),16);
  return "rgb("+
          + Math.floor(r*(t*0.3+1) + 100*t)
    + "," + Math.floor(g*(t*0.3+1) + 100*t)
    + "," + Math.floor(b*(t*0.3+1) + 100*t)
    +")";    }

const jointColor = "#018";
function drawJoint(p, camera, ctx){
  ctx.beginPath();
  if(p !== undefined && p.isPlus){
    let w = C.RAILWIDTH/C.RAILLENGTH;
    let h = 0.1;
    let d = 0.0;
    let points = [
      {x: p.coord.x + Math.sin(p.angle)*w/2 + Math.cos(p.angle)*(  d), y: p.coord.y - Math.cos(p.angle)*w/2 + Math.sin(p.angle)*(  d), z: p.coord.z},
      {x: p.coord.x - Math.sin(p.angle)*w/2 + Math.cos(p.angle)*(  d), y: p.coord.y + Math.cos(p.angle)*w/2 + Math.sin(p.angle)*(  d), z: p.coord.z},
      {x: p.coord.x                         + Math.cos(p.angle)*(h+d), y: p.coord.y                         + Math.sin(p.angle)*(h+d), z: p.coord.z},
    ];
    if(points.length==0){
      return;
    }
    ctx_moveTo(points[points.length-1],camera, ctx);
    points.forEach(p => ctx_lineTo(p, camera, ctx));
    ctx.fillStyle = jointColor;
    ctx.fillStyle = colorChange(ctx.fillStyle, points[0].z/2);
    ctx.fill();
  }
}

function easeFlash(_t){
  const a = 0.5;
  let t = _t%1;
  return t*(a*2-t)/(a*a);
}

const selectionColor = "#ffff00";
function drawSelectionMark(layout, selectedJoint, camera, ctx){
  ctx.beginPath();
  let p = P.fromJust()(P.getJointAbsPos(layout)(selectedJoint.nodeid)(selectedJoint.jointid));
  if(p !== undefined){
    let w = 0.1;
    let h = 0.1;
    let d = -0.15;
    let points = [
      {x: p.coord.x + Math.sin(p.angle)*w/2 + Math.cos(p.angle)*(  d), y: p.coord.y - Math.cos(p.angle)*w/2 + Math.sin(p.angle)*(  d), z: p.coord.z},
      {x: p.coord.x - Math.sin(p.angle)*w/2 + Math.cos(p.angle)*(  d), y: p.coord.y + Math.cos(p.angle)*w/2 + Math.sin(p.angle)*(  d), z: p.coord.z},
      {x: p.coord.x                         + Math.cos(p.angle)*(h+d), y: p.coord.y                         + Math.sin(p.angle)*(h+d), z: p.coord.z},
    ];
    if(points.length==0){
      return;
    }
    ctx_moveTo(points[points.length-1],camera, ctx);
    points.forEach(p => ctx_lineTo(p, camera, ctx));
    ctx.fillStyle = selectionColor + ("00"+(Math.floor(easeFlash(tickcount/60 /1)*255)).toString(16)).slice(-2);
    ctx.fill();
  }
}

function shapeToPoints(shape){
  let shapestr = JSON.stringify(shape);
  if (!shapeMemo.hasOwnProperty(shapestr)){
    let tmax = 10;
    let points = [];
    for(let i=0;i<=tmax;i++){
      points.push(P.getDividingPoint_rel(shape.start)(shape.end)( C.RAILWIDTH/C.RAILLENGTH/2)(i/tmax*1.02 -0.01).coord);
    }
    for(let i=tmax;i>=0;i--){
      points.push(P.getDividingPoint_rel(shape.start)(shape.end)(-C.RAILWIDTH/C.RAILLENGTH/2)(i/tmax*1.02 -0.01).coord);
    }
    shapeMemo[shapestr] = points;
  }
  return shapeMemo[JSON.stringify(shape)];
}

function getCanvasCoord(coord, camera){
  return {
    cx: canvas.width /2 + (camera.matrix.cx.x * (coord.x -camera.center.x) + camera.matrix.cx.y * (coord.y -camera.center.y) + camera.matrix.cx.z * (coord.z -camera.center.z)) * camera.zoom,
    cy: canvas.height/2 + (camera.matrix.cy.x * (coord.x -camera.center.x) + camera.matrix.cy.y * (coord.y -camera.center.y) + camera.matrix.cy.z * (coord.z -camera.center.z)) * camera.zoom
  };
}

function ctx_moveTo(coord, camera, ctx){
  let {cx,cy} = getCanvasCoord(coord, camera);
  ctx.moveTo(cx, cy);
}

function ctx_lineTo(coord, camera, ctx){
  let {cx,cy} = getCanvasCoord(coord, camera);
  ctx.lineTo(cx, cy);
}



export function download(){
  d = document.createElement("a"); d.download="layout.json"; d.href=window.URL.createObjectURL(new Blob([localStorage.getItem("L.layout")], {"type":"application/json"})); d.click();
}

export function upload(){
  let files = document.getElementById("upload").files;
  if(files.length > 0){
    files[0].text().then(L.loadfrom.bind(L, ()=>undefined));
  }
}



main();