
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
      layout.rails[selectedJoint.nodeid].node.maniputaledBy = -1;
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

function addInvalidRoute(){
  layout = P.addInvalidRoute(layout)(selectedJoint.nodeid)(selectedJoint.jointid);
  requestSave();
}
function addSignal(){
  layout = P.addSignal(layout)(selectedJoint.nodeid)(selectedJoint.jointid);
  requestSave();
}
function removeSignal(){
  layout = P.removeSignal(layout)(selectedJoint.nodeid)(selectedJoint.jointid);
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
    layout.rails[selectedJoint.nodeid].node.maniputaledBy = -1;
    layout = P.forceUpdate(layout);
  }
}

const keycontrols = {
  control : {
    name: "操作",
    keys: {
      remove : {
          onkey: ()=>{removeRail()}
        , text_ja: "レールを削除"
        , softkey: "BS・Del・\\"
        , key    : ["Backspace", "Delete", "\\"]
      },
      rotate : {
          onkey: ()=>{rotateRail()}
        , text_ja: "レールの接合点を変更"
        , softkey: "r"
        , key    : ["r"]
      },
      flip : {
          onkey: ()=>{flipRail()}
        , text_ja: "レールの左右を反転"
        , softkey: "f"
        , key    : ["f"]
      },
      modify : {
          onkey: ()=>{changeState()}
        , text_ja: "レールの状態を変更"
        , softkey: "v"
        , key    : ["v"]
      },
      selectForward: {
          onkey: ()=>{selectForward();}
        , text_ja: "前方のレールを選択"
        , softkey: "↑"
        , key    : ["ArrowUp"]
      },
      selectRight: {
          onkey: ()=>{selectJoint(-1);}
        , text_ja: "右の接合点を選択"
        , softkey: "→"
        , key    : ["ArrowRight"]
      },
      selectLeft: {
          onkey: ()=>{selectJoint(-1);}
        , text_ja: "左の接合点を選択"
        , softkey: "←"
        , key    : ["ArrowLeft"]
      },
      spotRail: {
          onkey: ()=>{  focusJoint();}
        , text_ja: "レール視点"
        , softkey: "4"
        , key    : ["4"]
      },
      pause: {
          onkey: ()=>{  stopped = !stopped;}
        , text_ja: "時間停止・再開"
        , softkey: "[SPACE]"
        , key    : [" "]
      },
    }
  },
  signal: {
    name: "信号・列車",
    keys: {
      addInvalidRoute: {
          onkey: ()=>{addInvalidRoute();}
        , text_ja: "進入禁止追加"
        , softkey: "9"
        , key    : ["9"]
      },
      addSignal: {
          onkey: ()=>{addSignal();}
        , text_ja: "信号追加"
        , softkey: "0"
        , key    : ["0"]
      },
      removeSignal: {
          onkey: ()=>{removeSignal();}
        , text_ja: "信号削除"
        , softkey: "-"
        , key    : ["-"]
      },
      stopSignal: {
          onkey: ()=>{  (() => {
              layout.rails[selectedJoint.nodeid].node.signals.forEach(e => {if(e.jointid == selectedJoint.jointid) e.manualStop = !e.manualStop});
            })();}
        , text_ja: "停止現示（手動）"
        , softkey: "p"
        , key    : ["p"]
      },
      openRouteL: {
          onkey: ()=>{  (() => {
              let signal = layout.rails[selectedJoint.nodeid].node.signals.find(e => e.jointid == selectedJoint.jointid);
              if(signal === undefined) return;
              let routeid = signal.routecond.findIndex(e => e);
              if(routeid === -1) routeid = -2;
              layout = P.tryOpenRouteFor_ffi(layout)(selectedJoint.nodeid)(selectedJoint.jointid)((routeid + signal.indication.length + 1) % signal.indication.length).layout
            })();}
          , text_ja: "進路構成（左）"
          , softkey: "i"
          , key    : ["i"]
        },
      openRouteR: {
          onkey: ()=>{  (() => {
              let signal = layout.rails[selectedJoint.nodeid].node.signals.find(e => e.jointid == selectedJoint.jointid);
              if(signal === undefined) return;
              let routeid = signal.routecond.findIndex(e => e);
              if(routeid === -1) routeid = 1;
              layout = P.tryOpenRouteFor_ffi(layout)(selectedJoint.nodeid)(selectedJoint.jointid)((routeid + signal.indication.length - 1) % signal.indication.length).layout
            })();}
        , text_ja: "進路構成（右）"
        , softkey: "o"
        , key    : ["o"]
      },
      addTrain: {
          onkey: ()=>{  (() => {
            layout = P.addTrainset(layout)(selectedJoint.nodeid)(selectedJoint.jointid)([{type:"313_Mc", flipped:false}, {type:"313_T", flipped:false}, {type:"312_Tc", flipped:false}]);
            layout.trains[layout.trains.length -1].realAcceralation=true;
            layout.trains[layout.trains.length -1].respectSignals=true;
            layout.trains[layout.trains.length -1].notch=5;
          })();}
        , text_ja: "列車追加"
        , softkey: "+"
        , key    : ["+"]
      },
      flipTrain: {
        onkey: ()=>{  (() => {
              let tis = layout.traffic[selectedJoint.nodeid].flat();
              layout.trains = layout.trains.map(c => tis.includes(c.trainid) ? P.flipTrain(c) : c);
            })();}
        , text_ja: "列車反転"
        , softkey: ";"
        , key    : [";"]
      },
      removeTrain: {
          onkey: ()=>{  (() => {
            let tis = layout.traffic[selectedJoint.nodeid].flat();
            layout.trains = layout.trains.filter(c => !tis.includes(c.trainid));
          })();}
        , text_ja: "列車削除"
        , softkey: "*"
        , key    : ["*"]
      },
    },
  },
  basic : {
    name: "基本レール",
    keys: {
      straightRail: {
          onkey: ()=>{addRail(P.straightRail);}
        , text_ja: "直線レール"
        , softkey: "w"
        , key    : ["w"]
      },
      curveLRail: {
          onkey: ()=>{addRail(P.curveLRail);}
        , text_ja: "曲線レール（左）"
        , softkey: "a"
        , key    : ["a"]
      },
      curveRRail: {
          onkey: ()=>{addRail(P.curveRRail);}
        , text_ja: "曲線レール（右）"
        , softkey: "d"
        , key    : ["d"]
      },
      longRail: {
          onkey: ()=>{addRail(P.longRail);}
        , text_ja: "二倍直線レール"
        , softkey: "W"
        , key    : ["W"]
      },
      halfRail: {
          onkey: ()=>{addRail(P.halfRail);}
        , text_ja: "1/2直線レール"
        , softkey: "t"
        , key    : ["t"]
      },
      quarterRail: {
          onkey: ()=>{addRail(P.quarterRail);}
        , text_ja: "1/4直線レール"
        , softkey: "y"
        , key    : ["y"]
      },
      converterRail: {
          onkey: ()=>{addRail(P.converterRail);}
        , text_ja: "1/4直線レール（凹凸変換）"
        , softkey: "Y"
        , key    : ["Y"]
      },
    }
  },
  slopes: {
    name: "勾配レール",
    keys: {
      slopeRailU: {
          onkey: ()=>{addRail(P.slopeRail);}
        , text_ja: "坂道レール（上り）"
        , softkey: "s"
        , key    : ["s"]
      },
      slopeRailD: {
          onkey: ()=>{addRail(P.slopeRail);}
        , text_ja: "坂道レール（下り）"
        , softkey: "S"
        , key    : ["S"]
      },
      slopeCurveLRailU: {
          onkey: ()=>{addRail(P.slopeCurveLRail);}
        , text_ja: "坂曲線レール（左・上り）"
        , softkey: "z"
        , key    : ["z"]
      },
      slopeCurveRRailU: {
          onkey: ()=>{addRail(P.slopeCurveRRail);}
        , text_ja: "坂曲線レール（右・上り）"
        , softkey: "c"
        , key    : ["c"]
      },
      slopeCurveLRailD: {
          onkey: ()=>{addRail(P.slopeCurveRRail, 1);}
        , text_ja: "坂曲線レール（左・下り）"
        , softkey: "Z"
        , key    : ["Z"]
      },
      slopeCurveRRailD: {
          onkey: ()=>{addRail(P.slopeCurveLRail, 1);}
        , text_ja: "坂曲線レール（右・下り）"
        , softkey: "C"
        , key    : ["C"]
      },
    }
  },
  points : {
    name: "非複線分岐レール",
    keys: {
      turnOutLPlusRail: {
          onkey: ()=>{addRail(P.turnOutLPlusRail);}
        , text_ja: "ターンアウトレール（左）"
        , softkey: "q"
        , key    : ["q"]
      },
      turnOutRPlusRail: {
          onkey: ()=>{addRail(P.turnOutRPlusRail);}
        , text_ja: "ターンアウトレール（右）"
        , softkey: "e"
        , key    : ["e"]
      },
      autoTurnOutLPlusRail: {
          onkey: ()=>{addRail(P.autoTurnOutLPlusRail);}
        , text_ja: "自動ターンアウトレール（左）"
        , softkey: "Q"
        , key    : ["Q"]
      },
      autoTurnOutRPlusRail: {
          onkey: ()=>{addRail(P.autoTurnOutRPlusRail);}
        , text_ja: "自動ターンアウトレール（右）"
        , softkey: "E"
        , key    : ["E"]
      },
    }
  },
  double: {
    name: "複線レール",
    keys: {
      outerCurveLRail: {
          onkey: ()=>{addRail(P.outerCurveLRail);}
        , text_ja: "複線外側曲線レール（左）"
      , softkey: "A"
      , key    : ["A"]
      },
      outerCurveRRail: {
          onkey: ()=>{addRail(P.outerCurveRRail);}
        , text_ja: "複線外側曲線レール（右）"
      , softkey: "D"
      , key    : ["D"]
      },
      toDoubleLPlusRail: {
          onkey: ()=>{addRail(P.toDoubleLPlusRail);}
        , text_ja: "単線複線ポイントレール（左）"
        , softkey: "1"
        , key    : ["1"]
      },
      toDoubleRPlusRail: {
          onkey: ()=>{addRail(P.toDoubleRPlusRail);}
        , text_ja: "単線複線ポイントレール（右）"
        , softkey: "3"
        , key    : ["3"]
      },
      doubleWidthSLRail: {
          onkey: ()=>{addRail(P.doubleWidthSLRail);}
        , text_ja: "複線幅S字レール（左）"
        , softkey: "g"
        , key    : ["g"]
      },
      doubleWidthSRRail: {
          onkey: ()=>{addRail(P.doubleWidthSRRail);}
        , text_ja: "複線幅S字レール（右）"
        , softkey: "h"
        , key    : ["h"]
      },
      scissorsRail: {
          onkey: ()=>{addRail(P.scissorsRail);}
        , text_ja: "複線ポイントレール（廃盤）"
        , softkey: "X"
        , key    : ["X"]
      },
    },
  },
  double_adv : {
    name: "複線応用レール",
    keys: {
      doubleTurnoutLPlusRail: {
          onkey: ()=>{addRail(P.doubleTurnoutLPlusRail);}
        , text_ja: "複線ターンアウトレール（左）"
        , softkey: "!"
        , key    : ["!"]
      },
      doubleTurnoutRPlusRail: {
          onkey: ()=>{addRail(P.doubleTurnoutRPlusRail);}
        , text_ja: "複線ターンアウトレール（右）"
        , softkey: "#"
        , key    : ["#"]
      },
      diamondRail: {
          onkey: ()=>{addRail(P.diamondRail);}
        , text_ja: "交差レール"
        , softkey: "x"
        , key    : ["x"]
      },
      doubleToWideLRail: {
          onkey: ()=>{addRail(P.doubleToWideLRail);}
        , text_ja: "複線幅広ポイントレール（左）"
        , softkey: "5"
        , key    : ["5"]
      },
      doubleToWideRRail: {
          onkey: ()=>{addRail(P.doubleToWideRRail);}
        , text_ja: "複線幅広ポイントレール（右）"
        , softkey: "5"
        , key    : ["5"]
      },
      crossoverLRail: {
          onkey: ()=>{addRail(P.crossoverLRail);}
        , text_ja: "複線わたりポイントレール（左）"
        , softkey: "G"
        , key    : ["G"]
      },
      crossoverRRail: {
          onkey: ()=>{addRail(P.crossoverRRail);}
        , text_ja: "複線わたりポイントレール（右）"
        , softkey: "H"
        , key    : ["H"]
      },
    }
  },
};

const keybinds = {};
Object.values(keycontrols).forEach(category => {Object.values(category.keys).forEach(key => key.key.forEach(k => keybinds[k] = key.onkey));});

function onkey(e){
  console.log(e);
  if(keybinds[e.key] !== undefined){
    keybinds[e.key]();
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