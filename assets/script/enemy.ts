import { _decorator,Vec2, Component, Node, SkeletalAnimationComponent } from 'cc';
import { constant } from './constant';
const { ccclass, property } = _decorator;

@ccclass('enemy')
export class enemy extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    // 玩家
    @property(Node)
    hero:Node=null;

    // 敌人动画
    anima=null;
    private _angle: number;
    private _dir: Vec2;
    private _actMode = constant.actMode.STAND;
    start () {

        // this.byAttack.bind(this)
        // // Your initialization goes here.
        // this.anima=this.node.getComponent(SkeletalAnimationComponent);

        // this._reset()
        
    }
    private _reset() {
       
        this._dir = cc.v2(0, 0);
        this._angle = 180;
    }
    // 被击
    byAttack(){
        console.log(this)
        // this._actMode=constant.actMode.BYATTACK;
        // this.node.lookAt(this.hero.getPosition());
        // this.anima.play('Skelet|Center Block');
        // this.scheduleOnce(this.stand, 1.5);
    }
    // 站立
    stand(){
        this._actMode=constant.actMode.STAND;
    }

    onDestroy() {
        this._dir = null;
    }
    // 受击
    update (dt: number) {
        // Your update function goes here.
        // let dir = this._dir;
        // var vx = dir.x * 2;
        // var vz = dir.y * 2;
        // var sx = vx * dt;
        // var sz = vz * dt;
        // let pos = this.node.getPosition();
        // pos.x = pos.x + sx;
        // pos.z = pos.z - sz;
        // pos.y = 0;
        // this.node.setPosition(pos);
        // this.node.setRotationFromEuler(0, this._angle, 0);
    }
}
