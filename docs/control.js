
const RAILLENGTH = 21.4;
const RAILWIDTH = 3.8;
const HEIGHTUNIT = 7.5;

let stopped = false;
let P, layout;
let selectedJoint = {nodeid:0, jointid:1};
let from = 0;
function focusJoint(){
  let pos = P.getJointAbsPos(layout)(selectedJoint.nodeid)(selectedJoint.jointid).value0;
  if(pos !== undefined){
    camera.center = pos.coord;
  }
}


function selectNewestRail(layout){
  selectedJoint.nodeid = layout.rails.length-1;
  selectedJoint.jointid = 0;
}




function selectForward(){
  let r = layout.rails[selectedJoint.nodeid];
  if(r!==undefined){
    let js = r.node.connections.filter(j=>j.from == selectedJoint.jointid);
    if(js.length > 0){
      selectedJoint.nodeid = js[0].nodeid;
      let ns = layout.rails[selectedJoint.nodeid].node.rail.getNewState(js[0].jointid)(layout.rails[selectedJoint.nodeid].node.state);
      selectedJoint.jointid = ns.newjoint;//(js[0].jointid+1) % layout.rails[selectedJoint.nodeid].node.rail.getJoints.length;
      layout.rails[selectedJoint.nodeid].node.state = ns.newstate;
    }
  }
}

function selectJoint(n){
  let r = layout.rails[selectedJoint.nodeid];
  if(r!==undefined){
    let joints =  layout.rails[selectedJoint.nodeid].node.rail.getJoints.length;
    selectedJoint.jointid = (selectedJoint.jointid +(n * (layout.rails[selectedJoint.nodeid].node.rail.flipped ? -1 : 1)) + joints) % joints;
  }
}

function addRail(rail, _f = 0){
  from = _f;
  layout = P.autoAdd(layout)(selectedJoint.nodeid)(selectedJoint.jointid)(rail)(from);
  selectNewestRail(layout);
  selectedJoint.jointid = (from+1) % layout.rails[selectedJoint.nodeid].node.rail.getJoints.length;
  requestSave();
}

function removeRail(){
  if(layout.rails.length>1 && layout.rails[selectedJoint.nodeid] !== undefined){
    layout_ = P.removeRail(layout)(selectedJoint.nodeid);
    rail = layout.rails[selectedJoint.nodeid];
    let js = rail.node.connections.filter(j=>j.from == selectedJoint.jointid);
    let cs = rail.node.connections.filter(j=>j !== undefined);
    if(js.length > 0){
      selectedJoint.nodeid  = js[0].nodeid - (js[0].nodeid < selectedJoint.nodeid ? 0 : 1);
      selectedJoint.jointid = js[0].jointid;
    }else if(cs.length > 0){
      selectedJoint.nodeid  = cs[0].nodeid - (cs[0].nodeid < selectedJoint.nodeid ? 0 : 1);
      selectedJoint.jointid = cs[0].jointid;
    }
    layout = layout_;
    if(layout.rails[selectedJoint.nodeid] === undefined){
      selectNewestRail(layout_);
    }
    requestSave();
  }
}

function flipRail(){
  if(layout.rails.length>1){
    r = layout.rails[selectedJoint.nodeid];
    if(r.node.connections[0] !== undefined){
      layout = P.autoAdd(P.removeRail(layout)(selectedJoint.nodeid))(r.node.connections[0].nodeid)(r.node.connections[0].jointid)(P.flipRail(r.node.rail))(r.node.connections[0].from);
      selectNewestRail(layout);
      selectedJoint.jointid = (from+1) % layout.rails[selectedJoint.nodeid].node.rail.getJoints.length;
      requestSave();
    }
  }
}

function rotateRail(){
  if(layout.rails.length>1){
    r = layout.rails[selectedJoint.nodeid];
    if(r.node.connections[0] !== undefined){
      layout = P.autoAdd(P.removeRail(layout)(selectedJoint.nodeid))(r.node.connections[0].nodeid)(r.node.connections[0].jointid)(r.node.rail)((r.node.connections[0].from + 1) % r.node.rail.getJoints.length);
      selectNewestRail(layout);
      selectedJoint.jointid = (from+1) % layout.rails[selectedJoint.nodeid].node.rail.getJoints.length;
      requestSave();
    }
  }
}

function changeState(){
  if(layout.rails[selectedJoint.nodeid] !== undefined){
    layout.rails[selectedJoint.nodeid].node.state = (layout.rails[selectedJoint.nodeid].node.state+1) % layout.rails[selectedJoint.nodeid].node.rail.getStates.length;
  }
}
function onkey(e){
  console.log(e);
  switch (e.key) {
    case "Backspace":
      removeRail();
      break;
    case "Delete":
      removeRail();
      break;
    case "\\":
      removeRail();
      break;
    case "r":
      rotateRail();
      break;
    case "f":
      flipRail();
      break;
    case "v":
      changeState();
      break;
    case "ArrowUp":
      selectForward();
      break;
    case "ArrowRight":
      selectJoint(-1);
      break;
    case "ArrowLeft":
      selectJoint(1);
      break;
    case "w":
      addRail(P.straightRail);
      break;
    case "W":
      addRail(P.longRail);
      break;
    case "s":
      addRail(P.slopeRail);
      break;
    case "S":
      addRail(P.slopeRail, 1);
      break;
    case "a":
      addRail(P.curveLRail);
      break;
    case "d":
      addRail(P.curveRRail);
      break;
    case "A":
      addRail(P.outerCurveLRail);
      break;
    case "D":
      addRail(P.outerCurveRRail);
      break;
    case "z":
      addRail(P.slopeCurveLRail);
      break;
    case "c":
      addRail(P.slopeCurveRRail);
      break;
    case "Z":
      addRail(P.slopeCurveRRail, 1);
      break;
    case "C":
      addRail(P.slopeCurveLRail, 1);
      break;
    case "q":
      addRail(P.turnOutLPlusRail);
      break;
    case "e":
      addRail(P.turnOutRPlusRail);
      break;
    case "Q":
      addRail(P.autoTurnOutLPlusRail);
      break;
    case "E":
      addRail(P.autoTurnOutRPlusRail);
      break;
    case "1":
      addRail(P.toDoubleLPlusRail);
      break;
    case "3":
      addRail(P.toDoubleRPlusRail);
      break;
    case "!":
      addRail(P.doubleTurnoutLPlusRail);
      break;
    case "#":
      addRail(P.doubleTurnoutRPlusRail);
      break;
    case "x":
      addRail(P.scissorsRail);
      break;
    case "5":
      addRail(P.doubleToWideLRail);
      break;
    case "6":
      addRail(P.doubleToWideRRail);
      break;
    case "t":
      addRail(P.halfRail);
      break;
    case "y":
      addRail(P.quarterRail);
      break;
    case "Y":
      addRail(P.converterRail);
      break;
    
    
    case "4":
      focusJoint();
      break;
    case " ":
      stopped = !stopped;
      break;
  
    default:
      break;
  }
}
let savetimer = 0;
const savecooldown = 2000;
function requestSave(){
  let time = new Date().getTime();
  savetimer = time;
  setTimeout(trySave, savecooldown + 500);
}
function trySave(){
  let time = new Date().getTime();
  if(time - savetimer > savecooldown){
    save();
    savetimer = time;
  }
}

function save(){
  localStorage.setItem("layout", JSON.stringify(P.encodeLayout(layout)));
  console.log("data saved");
}

function load(){
  let item = localStorage.getItem("layout");
  if(item !== null){
    loadfrom(item);
  }
}

function clearCache(){

}


function loadfrom(text){
  clearCache();
  layout = P.decodeLayout(JSON.parse(text));
  selectedJoint = {nodeid:0, jointid:1};
}

function download(){
  d = document.createElement("a"); d.download="layout.json"; d.href=window.URL.createObjectURL(new Blob([localStorage.getItem("layout")], {"type":"application/json"})); d.click();
}

function upload(){
  let files = document.getElementById("upload").files;
  if(files.length > 0){
    files[0].text().then(loadfrom);
  }
}

function decomposeFraction(x){
  const u1 = 0.5 ;
  const u2 = Math.sqrt(2)/2;

  let tmp = Infinity;
  let smallest = -1;
  for(let i = -30; i<=30; i++){
    let t_ = (x-u2*i) - Math.round((x-u2*i)/u1)*u1;
    if(Math.abs(t_) < tmp){
      tmp = Math.abs(t_);
      smallest = i;
    }
  }

  return smallest+"α +" + tmp.toFixed(2);
}

function coordStr(coord){
  return "(" + coord.x.toFixed(2) + "," + coord.y.toFixed(2) + "," + coord.z.toFixed(2) + ")" + " :: " + "(" + decomposeFraction(coord.x) + ", " + decomposeFraction(coord.y) + ")"
}