import { L } from "./3d.js";
import * as P from "./main.js"
const RAILLENGTH = 21.4;
const RAILWIDTH = 3.8;
const HEIGHTUNIT = 7.5;

class Layout {
  constructor(){
    this.stopped = false;
    this.respectSignals = true;
    this.layout  = P.defaultLayout;
    this.selectedJoint = {nodeid:0, jointid:1};
    this.selectedTrain = -1;
    this.from = 0;
    this.savetimer = 0;
    this.savecooldown = 2000;
    this.keycontrols = {
      control : {
        name: "操作",
        keys: {
          remove : {
              onkey: ()=>this.removeRail()
            , text_ja: "レールを削除"
            , softkey: "BS・Del・\\"
            , key    : ["Backspace", "Delete", "\\"]
          },
          rotate : {
              onkey: ()=>this.rotateRail()
            , text_ja: "レールの接合点を変更"
            , softkey: "r"
            , key    : ["r"]
          },
          flip : {
              onkey: ()=>this.flipRail()
            , text_ja: "レールの左右を反転"
            , softkey: "f"
            , key    : ["f"]
          },
          modify : {
              onkey: ()=>this.changeState()
            , text_ja: "レールの状態を変更"
            , softkey: "v"
            , key    : ["v"]
          },
          selectForward: {
              onkey: ()=>this.selectForward()
            , text_ja: "前方のレールを選択"
            , softkey: "↑"
            , key    : ["ArrowUp"]
          },
          selectRight: {
              onkey: ()=>{this.selectJoint(-1);}
            , text_ja: "右の接合点を選択"
            , softkey: "→"
            , key    : ["ArrowRight"]
          },
          selectLeft: {
              onkey: ()=>{this.selectJoint(-1);}
            , text_ja: "左の接合点を選択"
            , softkey: "←"
            , key    : ["ArrowLeft"]
          },
          spotRail: {
              onkey: ()=>this.focusJoint()
            , text_ja: "レール視点"
            , softkey: "4"
            , key    : ["4"]
          },
          pause: {
              onkey: ()=>{ this.stopped = !this.stopped;}
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
              onkey: ()=>this.addInvalidRoute()
            , text_ja: "進入禁止追加"
            , softkey: "9"
            , key    : ["9"]
          },
          addSignal: {
              onkey: ()=>this.addSignal()
            , text_ja: "信号追加"
            , softkey: "0"
            , key    : ["0"]
          },
          removeSignal: {
              onkey: ()=>this.removeSignal()
            , text_ja: "信号削除"
            , softkey: "-"
            , key    : ["-"]
          },
          stopSignal: {
              onkey: ()=>this.manualStop()
            , text_ja: "停止現示（手動）"
            , softkey: "p"
            , key    : ["p"]
          },
          openRouteL: {
              onkey: ()=>this.openRouteL()
              , text_ja: "進路構成（左）"
              , softkey: "i"
              , key    : ["i"]
            },
          openRouteR: {
              onkey: ()=>this.openRouteR()
            , text_ja: "進路構成（右）"
            , softkey: "o"
            , key    : ["o"]
          },
          addTrain: {
              onkey: ()=>this.addTrain()
            , text_ja: "列車追加"
            , softkey: "+"
            , key    : ["+"]
          },
          flipTrain: {
              onkey: ()=>this.flipTrain()
            , text_ja: "列車反転"
            , softkey: ";"
            , key    : [";"]
          },
          removeTrain: {
              onkey: ()=>this.removeTrain()
            , text_ja: "列車削除"
            , softkey: "*"
            , key    : ["*"]
          },
          selectTrain: {
              onkey: (data)=>this.selectTrain()
            , text_ja: "列車選択"
            , softkey: "u"
            , key    : ["u"]
          },
          respectSignals: {
              onkey: ()=>{ this.toggleRespectSignals();}
            , text_ja: "信号走行↔信号無視"
            , softkey: "extra_respectSignals"
            , key    : ["extra_respectSignals"]
            , skip   : true
          },
          editTrainNote: {
              onkey: (data)=>this.editTrainNote(data.note)
            , text_ja: "列車注釈"
            , softkey: "extra_edittrainote"
            , key    : ["extra_edittrainote"]
            , skip   : true
          },
          editRailNote: {
              onkey: (data)=>this.editRailNote(data.note)
            , text_ja: "線路注釈"
            , softkey: "extra_editrailnote"
            , key    : ["extra_editrailnote"]
            , skip   : true
          },
          removeTrainS: {
              onkey: (data)=>{ this.layout.trains = L.layout.trains.filter(t => t.trainid != data.trainid)}
            , text_ja: "選択列車削除"
            , softkey: "extra_removetrain"
            , key    : ["extra_removetrain"]
            , skip   : true
          },
          flipTrainS: {
              onkey: (data)=>{ this.layout.trains = this.layout.trains.map(c => {if(c.trainid == data.trainid && c.speed < 0.01){return P.flipTrain(c)}else{return c;}});}
            , text_ja: "選択列車反転"
            , softkey: "extra_reverse"
            , key    : ["extra_reverse", "l"]
            , skip   : true
          },
          setNotchS: {
              onkey: (data)=>{ this.layout.trains.forEach(c => {if(c.trainid == data.trainid){c.notch = data.notch}});}
            , text_ja: "ノッチ変更"
            , softkey: "extra_setnotch"
            , key    : ["extra_setnotch"]
            , skip   : true
          },
          notchPlus: {
              onkey: (data)=>{ this.layout.trains.forEach(c => {if(c.trainid == data.trainid){c.notch = Math.min(5, c.notch+1)}});}
            , text_ja: "ノッチ上げ"
            , softkey: "j"
            , key    : ["extra_notchplus", "j"]
            , skip   : true
          },
          notchMinus: {
              onkey: (data)=>{ this.layout.trains.forEach(c => {if(c.trainid == data.trainid){c.notch = Math.max(-8, c.notch-1)}});}
            , text_ja: "ノッチ下げ"
            , softkey: "k"
            , key    : ["extra_notchminus", "k"]
            , skip   : true
          },
          setTrainTagsS: {
              onkey: (data)=>{ this.layout.trains.forEach(c => {if(c.trainid == data.trainid){c.tags = data.tags.split("\n")}});}
            , text_ja: "列車タグ設定"
            , softkey: "extra_settraintag"
            , key    : ["extra_settraintag"]
            , skip   : true
          },
          setSignalRules: {
              onkey: (data)=>{ this.setSignalRules(data.rules)}
            , text_ja: "信号タグ設定"
            , softkey: "extra_setsignaltag"
            , key    : ["extra_setsignaltag"]
            , skip   : true
          },
        },
      },
      basic : {
        name: "基本レール",
        keys: {
          straightRail: {
              onkey: ()=>{this.addRail(P.straightRail);}
            , text_ja: "直線レール"
            , softkey: "w"
            , key    : ["w"]
          },
          curveLRail: {
              onkey: ()=>{this.addRail(P.curveLRail);}
            , text_ja: "曲線レール（左）"
            , softkey: "a"
            , key    : ["a"]
          },
          curveRRail: {
              onkey: ()=>{this.addRail(P.curveRRail);}
            , text_ja: "曲線レール（右）"
            , softkey: "d"
            , key    : ["d"]
          },
          longRail: {
              onkey: ()=>{this.addRail(P.longRail);}
            , text_ja: "二倍直線レール"
            , softkey: "W"
            , key    : ["W"]
          },
          halfRail: {
              onkey: ()=>{this.addRail(P.halfRail);}
            , text_ja: "1/2直線レール"
            , softkey: "t"
            , key    : ["t"]
          },
          quarterRail: {
              onkey: ()=>{this.addRail(P.quarterRail);}
            , text_ja: "1/4直線レール"
            , softkey: "y"
            , key    : ["y"]
          },
          converterRail: {
              onkey: ()=>{this.addRail(P.converterRail);}
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
              onkey: ()=>{this.addRail(P.slopeRail);}
            , text_ja: "坂道レール（上り）"
            , softkey: "s"
            , key    : ["s"]
          },
          slopeRailD: {
              onkey: ()=>{this.addRail(P.slopeRail, 1);}
            , text_ja: "坂道レール（下り）"
            , softkey: "S"
            , key    : ["S"]
          },
          slopeCurveLRailU: {
              onkey: ()=>{this.addRail(P.slopeCurveLRail);}
            , text_ja: "坂曲線レール（左・上り）"
            , softkey: "z"
            , key    : ["z"]
          },
          slopeCurveRRailU: {
              onkey: ()=>{this.addRail(P.slopeCurveRRail);}
            , text_ja: "坂曲線レール（右・上り）"
            , softkey: "c"
            , key    : ["c"]
          },
          slopeCurveLRailD: {
              onkey: ()=>{this.addRail(P.slopeCurveRRail, 1);}
            , text_ja: "坂曲線レール（左・下り）"
            , softkey: "Z"
            , key    : ["Z"]
          },
          slopeCurveRRailD: {
              onkey: ()=>{this.addRail(P.slopeCurveLRail, 1);}
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
              onkey: ()=>{this.addRail(P.turnOutLPlusRail);}
            , text_ja: "ターンアウトレール（左）"
            , softkey: "q"
            , key    : ["q"]
          },
          turnOutRPlusRail: {
              onkey: ()=>{this.addRail(P.turnOutRPlusRail);}
            , text_ja: "ターンアウトレール（右）"
            , softkey: "e"
            , key    : ["e"]
          },
          autoTurnOutLPlusRail: {
              onkey: ()=>{this.addRail(P.autoTurnOutLPlusRail);}
            , text_ja: "自動ターンアウトレール（左）"
            , softkey: "Q"
            , key    : ["Q"]
          },
          autoTurnOutRPlusRail: {
              onkey: ()=>{this.addRail(P.autoTurnOutRPlusRail);}
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
              onkey: ()=>{this.addRail(P.outerCurveLRail);}
            , text_ja: "複線外側曲線レール（左）"
          , softkey: "A"
          , key    : ["A"]
          },
          outerCurveRRail: {
              onkey: ()=>{this.addRail(P.outerCurveRRail);}
            , text_ja: "複線外側曲線レール（右）"
          , softkey: "D"
          , key    : ["D"]
          },
          toDoubleLPlusRail: {
              onkey: ()=>{this.addRail(P.toDoubleLPlusRail);}
            , text_ja: "単線複線ポイントレール（左）"
            , softkey: "1"
            , key    : ["1"]
          },
          toDoubleRPlusRail: {
              onkey: ()=>{this.addRail(P.toDoubleRPlusRail);}
            , text_ja: "単線複線ポイントレール（右）"
            , softkey: "3"
            , key    : ["3"]
          },
          doubleWidthSLRail: {
              onkey: ()=>{this.addRail(P.doubleWidthSLRail);}
            , text_ja: "複線幅S字レール（左）"
            , softkey: "g"
            , key    : ["g"]
          },
          doubleWidthSRRail: {
              onkey: ()=>{this.addRail(P.doubleWidthSRRail);}
            , text_ja: "複線幅S字レール（右）"
            , softkey: "h"
            , key    : ["h"]
          },
          scissorsRail: {
              onkey: ()=>{this.addRail(P.scissorsRail);}
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
              onkey: ()=>{this.addRail(P.doubleTurnoutLPlusRail);}
            , text_ja: "複線ターンアウトレール（左）"
            , softkey: "!"
            , key    : ["!"]
          },
          doubleTurnoutRPlusRail: {
              onkey: ()=>{this.addRail(P.doubleTurnoutRPlusRail);}
            , text_ja: "複線ターンアウトレール（右）"
            , softkey: "#"
            , key    : ["#"]
          },
          diamondRail: {
              onkey: ()=>{this.addRail(P.diamondRail);}
            , text_ja: "交差レール"
            , softkey: "x"
            , key    : ["x"]
          },
          doubleToWideLRail: {
              onkey: ()=>{this.addRail(P.doubleToWideLRail);}
            , text_ja: "複線幅広ポイントレール（左）"
            , softkey: "5"
            , key    : ["5"]
          },
          doubleToWideRRail: {
              onkey: ()=>{this.addRail(P.doubleToWideRRail);}
            , text_ja: "複線幅広ポイントレール（右）"
            , softkey: "6"
            , key    : ["6"]
          },
          crossoverLRail: {
              onkey: ()=>{this.addRail(P.crossoverLRail);}
            , text_ja: "複線わたりポイントレール（左）"
            , softkey: "G"
            , key    : ["G"]
          },
          crossoverRRail: {
              onkey: ()=>{this.addRail(P.crossoverRRail);}
            , text_ja: "複線わたりポイントレール（右）"
            , softkey: "H"
            , key    : ["H"]
          },
        }
      },
    };

    this.refreshKeybinds();

    this.matrixA = {cx:{x:RAILLENGTH, y:0, z:0}, cy:{x:0, y:-RAILLENGTH, z:0}};
    this.matrixB = {cx:{x:RAILLENGTH, y:0, z:0}, cy:{x:RAILLENGTH*0.1, y:-RAILLENGTH*0.8, z:-RAILLENGTH*0.6}};
    this.camera2d = {
        center : {x:0, y:0, z:0},
        matrix : this.matrixA,
        zoom : 3.0
      };
  }

  syncwithdata = (key, data, selectedJoint, selectedTrain) => {};
  setSyncMethod(f){
    syncwithdata = f;
  }

  tick(speed = 1.0){
    let oldspeed = this.layout.speed;
    this.layout.speed = oldspeed * speed;
    if(!this.stopped ) this.layout = P.layoutTick(this.layout);
    this.layout = P.layoutUpdate(this.layout);
    if(this.layout.rails[this.selectedJoint.nodeid] === undefined){
      selectNewestRail(this.layout);
    }
    if(this.layout.trains.find(t=>t.trainid == this.selectedTrain) === undefined && this.layout.trains.length > 0){
      this.selectedTrain = this.layout.trains[this.layout.trains.length-1].trainid;
    }
    this.layout.speed = oldspeed;
  }

  refreshKeybinds(){
    let keybinds = {};
    Object.values(this.keycontrols).forEach(category => {Object.values(category.keys).forEach(key => key.key.forEach(k => keybinds[k] = key.onkey));});
    this.keybinds = keybinds;
  }

  focusJoint(){
    let pos = P.getJointAbsPos(this.layout)(this.selectedJoint.nodeid)(this.selectedJoint.jointid).value0;
    if(pos !== undefined){
      this.camera2d.center = pos.coord;
    }
  }
  
  selectNewestRail(layout){
    this.selectedJoint.nodeid = layout.rails.length-1;
    this.selectedJoint.jointid = 0;
  }
  
  selectForward(){
    let r = this.layout.rails[this.selectedJoint.nodeid];
    if(r!==undefined){
      let js = r.connections.filter(j=>j.from == this.selectedJoint.jointid);
      if(js.length > 0){
        this.selectedJoint.nodeid = js[0].nodeid;
        let ns = this.layout.rails[this.selectedJoint.nodeid].rail.getNewState(js[0].jointid)(this.layout.rails[this.selectedJoint.nodeid].state);
        this.selectedJoint.jointid = ns.newjoint;//(js[0].jointid+1) % this.layout.rails[this.selectedJoint.nodeid].rail.getJoints.length;
        //this.layout.rails[this.selectedJoint.nodeid].state = ns.newstate;
        //this.layout.rails[this.selectedJoint.nodeid].maniputaledBy = -1;
      }
    }
  }
  
  selectJoint(n){
    let r = this.layout.rails[this.selectedJoint.nodeid];
    if(r!==undefined){
      let joints =  this.layout.rails[this.selectedJoint.nodeid].rail.getJoints.length;
      this.selectedJoint.jointid = (this.selectedJoint.jointid +(n * (this.layout.rails[this.selectedJoint.nodeid].rail.flipped ? -1 : 1)) + joints) % joints;
    }
  }
  
  addRail(rail, _f = 0){
    this.from = _f;
    this.layout = P.autoAdd(this.layout)(this.selectedJoint.nodeid)(this.selectedJoint.jointid)(rail)(this.from);
    this.selectNewestRail(this.layout);
    this.selectedJoint.jointid = (this.from+1) % this.layout.rails[this.selectedJoint.nodeid].rail.getJoints.length;
    this.requestSave();
  }
  
  addInvalidRoute(){
    this.layout = P.addInvalidRoute(this.layout)(this.selectedJoint.nodeid)(this.selectedJoint.jointid);
    this.requestSave();
  }
  addSignal(){
    this.layout = P.addSignal(this.layout)(this.selectedJoint.nodeid)(this.selectedJoint.jointid);
    this.requestSave();
  }
  removeSignal(){
    this.layout = P.removeSignal(this.layout)(this.selectedJoint.nodeid)(this.selectedJoint.jointid);
    this.requestSave();
  }
  
  
  removeRail(){
    if(this.layout.rails.length>1 && this.layout.rails[this.selectedJoint.nodeid] !== undefined){
      let layout_ = P.removeRail(this.layout)(this.selectedJoint.nodeid);
      let rail = this.layout.rails[this.selectedJoint.nodeid];
      let js = rail.connections.filter(j=>j.from == this.selectedJoint.jointid);
      let cs = rail.connections.filter(j=>j !== undefined);
      if(js.length > 0){
        this.selectedJoint.nodeid  = js[0].nodeid - (js[0].nodeid < this.selectedJoint.nodeid ? 0 : 1);
        this.selectedJoint.jointid = js[0].jointid;
      }else if(cs.length > 0){
        this.selectedJoint.nodeid  = cs[0].nodeid - (cs[0].nodeid < this.selectedJoint.nodeid ? 0 : 1);
        this.selectedJoint.jointid = cs[0].jointid;
      }
      this.layout = layout_;
      if(this.layout.rails[this.selectedJoint.nodeid] === undefined){
        this.selectNewestRail(layout_);
      }
      this.requestSave();
    }
  }
  
  flipRail(){
    if(this.layout.rails.length>1){
      let r = this.layout.rails[this.selectedJoint.nodeid];
      if(r !== undefined && r.connections[0] !== undefined){
        this.layout = P.autoAdd(P.removeRail(this.layout)(this.selectedJoint.nodeid))(r.connections[0].nodeid)(r.connections[0].jointid)(P.flipRail(r.rail))(r.connections[0].from);
        this.selectNewestRail(this.layout);
        this.selectedJoint.jointid = (this.from+1) % this.layout.rails[this.selectedJoint.nodeid].rail.getJoints.length;
        this.requestSave();
      }
    }
  }
  
  rotateRail(){
    if(this.layout.rails.length>1){
      let r = this.layout.rails[this.selectedJoint.nodeid];
      if(r !== undefined && r.connections[0] !== undefined){
        this.layout = P.autoAdd(P.removeRail(this.layout)(this.selectedJoint.nodeid))(r.connections[0].nodeid)(r.connections[0].jointid)(r.rail)((r.connections[0].from + 1) % r.rail.getJoints.length);
        this.selectNewestRail(this.layout);
        this.selectedJoint.jointid = (this.from+1) % this.layout.rails[this.selectedJoint.nodeid].rail.getJoints.length;
        this.requestSave();
      }
    }
  }
  
  changeState(){
    if(this.layout.rails[this.selectedJoint.nodeid] !== undefined){
      this.layout.rails[this.selectedJoint.nodeid].state = (this.layout.rails[this.selectedJoint.nodeid].state+1) % this.layout.rails[this.selectedJoint.nodeid].rail.getStates.length;
      this.layout.rails[this.selectedJoint.nodeid].maniputaledBy = -1;
      this.layout = P.forceUpdate(this.layout);
    }
  }
  
  manualStop(){
    if(this.layout.rails[this.selectedJoint.nodeid] !== undefined){
      this.layout.rails[this.selectedJoint.nodeid].signals.forEach(e => {if(e.jointid == this.selectedJoint.jointid) e.manualStop = !e.manualStop});
    }
  }
  
  openRouteL(){
    if(this.layout.rails[this.selectedJoint.nodeid] !== undefined){
      let signal = this.layout.rails[this.selectedJoint.nodeid].signals.find(e => e.jointid == this.selectedJoint.jointid);
      if(signal === undefined) return;
      let routeid = signal.routecond.findIndex(e => e);
      if(routeid === -1) routeid = -2;
      this.layout = P.tryOpenRouteFor_ffi(this.layout)(this.selectedJoint.nodeid)(this.selectedJoint.jointid)((routeid + signal.indication.length + 1) % signal.indication.length).layout
    }
  }
  
  openRouteR(){
    if(this.layout.rails[this.selectedJoint.nodeid] !== undefined){
      let signal = this.layout.rails[this.selectedJoint.nodeid].signals.find(e => e.jointid == this.selectedJoint.jointid);
      if(signal === undefined) return;
      let routeid = signal.routecond.findIndex(e => e);
      if(routeid === -1) routeid = 1;
      this.layout = P.tryOpenRouteFor_ffi(this.layout)(this.selectedJoint.nodeid)(this.selectedJoint.jointid)((routeid + signal.indication.length - 1) % signal.indication.length).layout
    }
  }

  toggleRespectSignals(){
    this.respectSignals = !this.respectSignals;
    this.layout.trains.forEach(e => e.respectSignals = this.respectSignals);
  }
  
  addTrain(){
    if(this.layout.rails[this.selectedJoint.nodeid] !== undefined){
      this.layout = P.addTrainset(this.layout)(this.selectedJoint.nodeid)(this.selectedJoint.jointid)([{type:"313_Mc", flipped:false}, {type:"313_T", flipped:false}, {type:"312_Tc", flipped:false}]);
      this.layout.trains[this.layout.trains.length -1].realAcceralation=true;
      this.layout.trains[this.layout.trains.length -1].respectSignals=this.respectSignals;
      this.layout.trains[this.layout.trains.length -1].notch=5;
    }
  }
  
  flipTrain(){
    if(this.layout.traffic[this.selectedJoint.nodeid] !== undefined){
      let tis = this.layout.traffic[this.selectedJoint.nodeid].flat();
      this.layout.trains = this.layout.trains.map(c => tis.includes(c.trainid) ? P.flipTrain(c) : c);
    }
  }
  
  removeTrain(){
    if(this.layout.traffic[this.selectedJoint.nodeid] !== undefined){
      let tis = this.layout.traffic[this.selectedJoint.nodeid].flat();
      this.layout.trains = this.layout.trains.filter(c => !tis.includes(c.trainid));
    }
  }
  selectTrain(){
    if(this.layout.traffic[this.selectedJoint.nodeid] !== undefined){
      let tis = this.layout.traffic[this.selectedJoint.nodeid].flat();
      let trains = this.layout.trains.filter(c => tis.includes(c.trainid));
      if(trains.length > 0){
        this.selectedTrain = trains[0].trainid;
      }
    }
  }
  
  editRailNote(note){
    if(this.layout.rails[this.selectedJoint.nodeid] !== undefined){
      this.layout.rails[this.selectedJoint.nodeid].note = note;
      this.requestSave();
    }
  }
  getSignalTag(note){
    if(this.layout.rails[this.selectedJoint.nodeid] !== undefined){
      this.layout.rails[this.selectedJoint.nodeid].note = note;
      this.requestSave();
    }
  }
  setSignalRules(rulestr){
    if(this.layout.rails[this.selectedJoint.nodeid] !== undefined){
      this.layout.rails[this.selectedJoint.nodeid].signals.forEach(s => {if(s.jointid == this.selectedJoint.jointid){s.rules = P.decodeSignalRules(rulestr.split("\n"))}});
      this.requestSave();
    }
  }
  editTrainNote(note){
    if(this.layout.traffic[this.selectedJoint.nodeid] !== undefined){
      let tis = this.layout.traffic[this.selectedJoint.nodeid].flat();
      this.layout.trains.filter(c => tis.includes(c.trainid)).forEach(c => {c.note = note;});
      this.requestSave();
    }
  }

  getSelectedRail(){
    if(this.layout.rails[this.selectedJoint.nodeid] !== undefined){
      return this.layout.rails[this.selectedJoint.nodeid];
    }
  }
  getSelectedTrains(){
    if(this.layout.traffic[this.selectedJoint.nodeid] !== undefined){
      let tis = this.layout.traffic[this.selectedJoint.nodeid].flat();
      return this.layout.trains.filter(c => tis.includes(c.trainid));
    }
  }
  
  onkey(e, data){
    let selectedTrain = this.selectedTrain;
    let selectedJoint={};
    Object.assign(selectedJoint, this.selectedJoint);
    console.log(e);
    if(this.keybinds[e.key] !== undefined){
      this.syncwithdata(e.key, this.keybinds[e.key](data), selectedJoint, selectedTrain);
    }
  }
  
  requestSave(){
    let time = new Date().getTime();
    this.savetimer = time;
    setTimeout(this.trySave, this.savecooldown + 500);
  }
  trySave(){
    let time = new Date().getTime();
    if(time - this.savetimer > this.savecooldown){
      this.save();
      this.savetimer = time;
    }
  }
  
  save(){
    localStorage.setItem("layout", JSON.stringify(P.encodeLayout(this.layout)));
    console.log("data saved");
  }
  
  load(clearCache){
    let item = localStorage.getItem("layout");
    if(item !== null){
      this.loadfrom(clearCache, item);
    }
  }
  
  
  loadfrom(clearCache, text){
    clearCache();
    this.layout = P.layoutUpdate_NoManualStop(P.decodeLayout(JSON.parse(text)));
    this.selectedJoint = {nodeid:0, jointid:1};
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

export {
  RAILLENGTH,
  RAILWIDTH,
  HEIGHTUNIT,
  Layout,
  decomposeFraction,
  coordStr,
};
