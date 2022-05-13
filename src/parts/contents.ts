import { MyDisplay } from "../core/myDisplay";
import { Tween } from "../core/tween";
import { Util } from "../libs/util";
import { OutlineData } from "./outlineData";
import { Segment } from "./segment";
import { Vector2 } from "three/src/math/Vector2";
import { Update } from "../libs/update";
import { Func } from "../core/func";

// -----------------------------------------
//
// -----------------------------------------
export class Contents extends MyDisplay {


  private _segment:Array<Segment> = [];
  private _isStart:boolean = false;

  private _pointData:Array<Vector2> = [];
  private _nowPointId:number = 0;

  constructor(opt:any) {
    super(opt)

    const data = new OutlineData()
    data.load('./assets/sample.svg', this._pointData, () => {
      console.log(this._pointData);
      this._isStart = true;
    })

    this._resize();
  }


  private _addSegment(): void {
    if(!this._isStart) return

    let nextId = this._nowPointId + 1;
    if(nextId >= this._pointData.length) {
      nextId = 0;
      this._isStart = false;
    }

    const nowData = this._pointData[this._nowPointId];
    const nextData = this._pointData[nextId];
    this._nowPointId++;

    const el = document.createElement('div')
    el.classList.add('item')
    this.getEl().append(el);
    const item = new Segment({
      el:el,
      id:this._segment.length,
    })
    this._segment.push(item);

    item.setPos(nowData.x, nowData.y);

    const nowX = item.getPos().x;
    const nowY = item.getPos().y;

    const dx = nextData.x - nowX;
    const dy = nextData.y - nowY;

    const radian = Math.atan2(dy, dx);
    item.setRot(Util.instance.degree(radian));

    Tween.instance.set(item.getEl(), {
      x:nowX,
      y:nowY,
      rotationZ:item.getRot()
    });
  }


  protected _update(): void {
    super._update();

    if(Func.instance.sw() < Func.instance.sh()) {
      Tween.instance.set(this.getEl(), {
        width: Func.instance.sw(),
        height: Func.instance.sh(),
        rotationZ:'90deg'
      })
    }

    if(this._isStart) {
      if(Update.instance.cnt % 1 == 0) {
        this._addSegment();
        this._addSegment();
        this._addSegment();
        this._addSegment();
      }
    }
  }
}