import { _decorator, Component, Node, Vec2, systemEvent, SystemEventType, EventTouch, Touch, Vec3, UITransformComponent, SkeletalAnimationComponent, tween, RigidBodyComponent, Tween } from 'cc';
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
    enemy: Node = null;

    @property({
        type: Node
    })
    npc: Node = null;

    @property({
        type: Node
    })
    camera: Node = null;

    @property({
        type: [Node]
    })
    tree: Node[] = [];

    private _treefalled: boolean[] = [];

    private _touchID: number;
    private _dir: Vec2;
    private _angle: number;
    private _pressed: boolean;
    private _speed: number = 0.1;
    private _actMode = constant.actMode.STAND;
    private _actcombo = 0;
    private _playing = false;

    private _enemyaim = constant.enemyAim.NO;
    private _enemyrotatespeed = 0.1;
    private _actModeE = constant.actMode.STAND;



    start() {
        decastis.on(constant.eventName.GAME_START, this._reset, this);

        this.enemy['bloodNum'] = 1;
        for (let i = 0; i < 4; i++) {
            this._treefalled[i] = false;
        }

    }

    onDestroy() {
        this._dir = null;
        this._touchID = null;
    }

    private _reset() {
        this._addEvent();
        this._pressed = false;
        this._touchID = -1;
        this._dir = cc.v2(0, 0);
        this._angle = 180;
        this._playing = true;
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
        if (this._actMode !== constant.actMode.ATTACK && this._actMode !== constant.actMode.SKILL) {
            this._actcombo++;
            this._actMode = constant.actMode.ATTACK;
            if (this._actcombo == 3) {
                this._actcombo = 0;
                this.role.getComponent(SkeletalAnimationComponent).stop()
                this.role.getComponent(SkeletalAnimationComponent).play('Skelet|Martelo2');
                this.scheduleOnce(this.roleStand, 0.7);
                audioManager.playEffect('box1')
                this.scheduleOnce(this._checkAttack, 0.2)

            }
            else {
                this.role.getComponent(SkeletalAnimationComponent).stop()
                this.role.getComponent(SkeletalAnimationComponent).play('Skelet|Boxing');
                this.scheduleOnce(this.roleStand, 0.6);
                audioManager.playEffect('box2')
                this.scheduleOnce(this._checkAttack, 0.2)
            }

        }
        else {
            console.log('cding')
        }
    }

    public roleSkill() {
        if (this._actMode !== constant.actMode.ATTACK && this._actMode !== constant.actMode.SKILL) {
            this._actMode = constant.actMode.SKILL;
            this.role.getComponent(SkeletalAnimationComponent).stop()
            this.role.getComponent(SkeletalAnimationComponent).play('Skelet|Hurricane Kick');
            this.scheduleOnce(this.roleStand, 0.88);
        }
    }

    public enemyStand() {
        this._actModeE = constant.actMode.STAND;
        this.enemy.getComponent(SkeletalAnimationComponent).stop()
        this.enemy.getComponent(SkeletalAnimationComponent).play('Skelet|Idel');
    }

    public roleStand() {
        this._actMode = constant.actMode.STAND;
        this.role.getComponent(SkeletalAnimationComponent).stop()
        this.role.getComponent(SkeletalAnimationComponent).play('Skelet|Idel');
    }

    private _checkAttack() {
        var dis = this._getDis(this.enemy, this.role);
        if (dis.length() < 2) {
            // 敌人被打
            if (this._actModeE !== constant.actMode.BE) {
                this._actModeE = constant.actMode.BE;
                if (this.enemy['bloodNum'] >= 0.1) {
                    this.enemy['bloodNum'] -= 0.1;
                    this.enemy.getComponent(SkeletalAnimationComponent).stop()
                    this.enemy.getComponent(SkeletalAnimationComponent).play('Skelet|Center Block');
                    
                    // 百分之20概率击飞敌人
                    if(Math.random()<0.2){
                        this._blowEnemy()
                    }else{
                        this.scheduleOnce(this.enemyStand, 0.7);
                    }
                } else {
                    // 血条为空
                    this.enemy['bloodNum'] = 0.0001;
                    this._blowEnemy()
                }
            }
        }
        for (let i = 0; i < 4; i++) {
            var dis = this._getDis(this.tree[i], this.role);
            if (dis.length() < 2 && !this._treefalled[i]) {
                this._treefalled[i] = true;
                const otherrigidbody = this.tree[i].getComponent(RigidBodyComponent);
                otherrigidbody.useGravity = true;
                otherrigidbody.applyForce(new Vec3(Math.random() * 1000 + 1000, 1000, Math.random() * 1000 + 1000), new Vec3(Math.random() * 1, Math.random() * 1, Math.random() * 1));
                // this.tree[i]
            }

        }
    }
    // 敌人击飞
    private _blowEnemy() {
        this._actModeE = constant.actMode.BE;

        let pos = this.enemy.getPosition();
        pos.z -= 2;
        new Tween(this.enemy).to(0.3, { position: pos }).start()
        this.enemy.getComponent(SkeletalAnimationComponent).stop()
        this.enemy.getComponent(SkeletalAnimationComponent).play('Skelet|SweepFall');
        this.scheduleOnce(() => {
            this.enemy.getComponent(SkeletalAnimationComponent).stop()
            if (this.enemy['bloodNum'] > 0.01) {
                // 还没死，站起来
                this.enemy.getComponent(SkeletalAnimationComponent).play('Skelet|StandUp');
                this.scheduleOnce(this.enemyStand, 5);
            } else {
                // 死了

            }
        }, 1.5);



    }
    update(dt: number) {
        if (this._playing) {
            this._move(dt);
        }

        if (this._enemyaim === constant.enemyAim.ROLE) {
            this._enemyAim(this.role, dt);
        }
        if (this._enemyaim === constant.enemyAim.NPC) {
            this._enemyAim(this.npc, dt);
        }
    }

    public enemyAct0() {
        this.enemyStand();
        this._enemyaim = constant.enemyAim.NO;
        this.scheduleOnce(this.enemyAct1, 3);
        // var ang = this.getAngle(this.role.position.x, this.role.position.z, this.enemy.position.x, this.enemy.position.z);
        // var lastang = ang + 180;
        // this.enemy.setRotationFromEuler(0, lastang, 0);
        //tween(this.enemy.position).to(3, new Vec3(10, 0, 0)).start();

        // tween(this._pos)
        // .to(3, new Vec3(10, 10, 10), { easing: 'bounceInOut' })
        // .to(3, new Vec3(0, 0, 0), { easing: 'elasticOut' })
        // .union()
        // .repeat(2) // 执行 2 次
        // .start();
    }


    public enemyAct1() {
        this._enemyaim = constant.enemyAim.ROLE;
        this.scheduleOnce(this.enemyAct2, 3);
    }

    public enemyAct2() {
        this._enemyaim = constant.enemyAim.NPC;
        this.scheduleOnce(this.enemyAct0, 3);
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

    private _getDis(a, b) {
        var p1 = new Vec3(a.position.x, a.position.y, a.position.z);
        var p2 = new Vec3(b.position.x, b.position.y, b.position.z);
        var result = p2.subtract(p1);
        return result;
    }

    private _enemyAim(aim: Node, dt: number) {
        var ang = this.getAngle(aim.position.x, aim.position.z, this.enemy.position.x, this.enemy.position.z);
        console.log('ang=' + ang);
        var neo = 0;
        if (ang > 180) {
            neo = 180 + (360 - ang);
        }
        else {
            neo = 180 - ang;
        }
        this.enemy.setRotationFromEuler(0, neo, 0);



        var result = this._getDis(this.enemy, aim);
        if (result.length() == 0) {
            return;
        }
        else if (result.length() < 1.5) {
            if (this._actModeE === constant.actMode.RUN) {
                this._actModeE = constant.actMode.STAND;
                this.enemy.getComponent(SkeletalAnimationComponent).stop()
                this.enemy.getComponent(SkeletalAnimationComponent).play('Skelet|Idel');
            }
        }
        else {
            if (this._actModeE === constant.actMode.STAND) {
                this._actModeE = constant.actMode.RUN;
                this.enemy.getComponent(SkeletalAnimationComponent).stop()
                this.enemy.getComponent(SkeletalAnimationComponent).play('Skelet|StandardRun');
            }
            var xx = result.x / result.length();
            var zz = result.z / result.length();
            var vx = xx * 1;
            var vz = zz * 1;
            var sx = vx * dt;
            var sz = vz * dt;
            let pos = this.enemy.getPosition();
            pos.x = pos.x + sx;
            pos.z = pos.z + sz;
            pos.y = 0;
            this.enemy.setPosition(pos);
        }
    }
}
