import { _decorator, Component, Node, Vec2, systemEvent, SystemEventType, EventTouch, Touch, Vec3, UITransformComponent, SkeletalAnimationComponent } from 'cc';
import { constant } from './constant';
import { decastis } from './decastis';
import { audioManager } from './audioManager';
const { ccclass, property } = _decorator;

@ccclass('control')
export class control extends Component {

    @property({
        type: Node
    })
    padle: Node = null;

    @property({
        type: Node
    })
    pad2: Node = null;

    @property({
        type: Node
    })
    role: Node = null;

    @property({
        type: Node
    })
    camera: Node = null;

    private _touchID: number;
    private _dir: Vec2;
    private _angle: number;
    private _pressed: boolean;
    private _speed: number = 0.1;
    private _actMode = constant.actMode.STAND;
    private _actcombo = 0;

    start() {
        decastis.on(constant.eventName.GAME_START, this._reset);
    }

    onDestroy() {
        this._dir = null;
        this._touchID = null;
    }

    _reset() {
        this._addEvent();
        this._pressed = false;
        this._touchID = -1;
        this._dir = cc.v2(0, 0);
        this._angle = 180;
    }

    private _addEvent() {
        systemEvent.on(SystemEventType.TOUCH_START, this.touchS, this);
        systemEvent.on(SystemEventType.TOUCH_MOVE, this.touchM, this);
        systemEvent.on(SystemEventType.TOUCH_END, this.touchE, this);
        systemEvent.on(SystemEventType.TOUCH_CANCEL, this.touchC, this);
    }

    private touchS(tc: Touch, event: EventTouch) {
        const touch = event;
        const pos = touch.getUILocation();
        this._pressed = true;
        let posnow = new Vec3(pos.x - 360, pos.y - 640, 0);
        let posnow2 = new Vec3(pos.x - 360 + 0, pos.y - 640 + 1, 0);
        this.padle.setPosition(posnow);
        this.pad2.setPosition(posnow2);
        if (event) {
            event.propagationStopped = true;
        }

    }

    private touchM(tc: Touch, event: EventTouch) {
        const touch = event;
        const pos = touch.getUILocation();
        this._pressed = true;
        let posnow = new Vec3(pos.x - 360, pos.y - 640, 0);
        this.pad2.setPosition(posnow);
        this._setPos();

    }

    private touchE(tc: Touch, event: EventTouch) {
        if (event) {
            event.propagationStopped = true;
        }
        this._pressed = false;
        this.padle.setPosition(new Vec3(0 - 360 + 100, 0 - 640 + 100, 0));
        this.pad2.setPosition(new Vec3(0 - 360 + 100, 0 - 640 + 100, 0));
        this._touchID = -1;
        this._dir = cc.v2(0, 0);

        if (this._actMode === constant.actMode.RUN) {
            this._actMode = constant.actMode.STAND;
            this.role.getComponent(SkeletalAnimationComponent).stop()
            this.role.getComponent(SkeletalAnimationComponent).play('Skelet|Idel');
        }
    }

    private touchC(tc: Touch, event: EventTouch) {
        this._pressed = false;
        this._touchID = -1;
        this.padle.setPosition(new Vec3(0 - 360 + 100, 0 - 640 + 100, 0));
        this.pad2.setPosition(new Vec3(0 - 360 + 100, 0 - 640 + 100, 0));

        if (this._actMode === constant.actMode.RUN) {
            this._actMode = constant.actMode.STAND;
            this.role.getComponent(SkeletalAnimationComponent).stop()
            this.role.getComponent(SkeletalAnimationComponent).play('Skelet|Idel');
        }
    }


    private _setPos() {
        var p1 = new Vec3(this.padle.position.x, this.padle.position.y, this.padle.position.z);
        var p2 = new Vec3(this.pad2.position.x, this.pad2.position.y, this.pad2.position.z);
        var result = p2.subtract(p1);
        if (result.length() == 0) {
            return;
        }
        else {
            this._dir.x = result.x / result.length();
            this._dir.y = result.y / result.length();
        }
        var ang = this.getAngle(this.padle.position.x, this.padle.position.y, this.pad2.position.x, this.pad2.position.y);
        this._angle = ang + 180;
        // console.log('result==' + result);
        // console.log('length==' + result.length());
        if (this._actMode === constant.actMode.STAND) {
            this._actMode = constant.actMode.RUN;
            this.role.getComponent(SkeletalAnimationComponent).stop()
            this.role.getComponent(SkeletalAnimationComponent).play('Skelet|StandardRun');
        }
    }

    private getAngle(px, py, mx, my) {//获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角
        var x = Math.abs(px - mx);
        var y = Math.abs(py - my);
        var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var cos = y / z;
        var radina = Math.acos(cos);//用反三角函数求弧度
        var angle = Math.floor(180 / (Math.PI / radina));//将弧度转换成角度
        if (mx > px && my > py) {//鼠标在第四象限
            angle = 180 - angle;
        }
        if (mx == px && my > py) {//鼠标在y轴负方向上
            angle = 180;
        }
        if (mx > px && my == py) {//鼠标在x轴正方向上
            angle = 90;
        }
        if (mx < px && my > py) {//鼠标在第三象限
            angle = 180 + angle;
        }

        if (mx < px && my == py) {//鼠标在x轴负方向
            angle = 270;
        }
        if (mx < px && my < py) {//鼠标在第二象限
            angle = 360 - angle;
        }
        return angle;
    }

    public roleAttack() {
        if (this._actMode !== constant.actMode.ATTACK) {
            this._actcombo++;
            this._actMode = constant.actMode.ATTACK;
            if (this._actcombo == 3) {
                this._actcombo = 0;
                this.role.getComponent(SkeletalAnimationComponent).stop()
                this.role.getComponent(SkeletalAnimationComponent).play('Skelet|Martelo2');
                this.scheduleOnce(this.roleStand, 0.7);
            }
            else {
                this.role.getComponent(SkeletalAnimationComponent).stop()
                this.role.getComponent(SkeletalAnimationComponent).play('Skelet|Boxing');
                this.scheduleOnce(this.roleStand, 0.6);
            }

        }
        else {
            console.log('cding')
        }
    }

    public roleStand() {
        this._actMode = constant.actMode.STAND;
        this.role.getComponent(SkeletalAnimationComponent).stop()
        this.role.getComponent(SkeletalAnimationComponent).play('Skelet|Idel');
    }

    update(dt: number) {
        this._move(dt);
    }

    private _move(dt: number) {
        let dir = this._dir;
        var vx = dir.x * 2;
        var vz = dir.y * 2;
        var sx = vx * dt;
        var sz = vz * dt;
        let pos = this.role.getPosition();
        pos.x = pos.x + sx;
        pos.z = pos.z - sz;
        pos.y = 0;
        this.role.setPosition(pos);
        this.role.setRotationFromEuler(0, this._angle, 0);
        this.camera.setPosition(pos.x, pos.y + 10, pos.z + 10);
        //console.log('dir22=' + dt);
    }
}
