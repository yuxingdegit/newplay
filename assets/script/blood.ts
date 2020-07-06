import { _decorator, Component, Node, CameraComponent, SpriteComponent, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('blood')
export class blood extends Component {
    // 存放英雄以及敌人节点
    roleList = [];
    // 摄像机
    _came = null;
    start() {
        // Your initialization goes here.

        this._came = this.node.parent.parent.getChildByName('Camera').getComponent(CameraComponent)


        const nd = this.node.parent.parent.getChildByName('stage');
        for (var i in nd.children) {
            if (nd.children[i].name == 'enemy' || nd.children[i].name == 'role') {
                this.roleList.push(nd.children[i])
            }
        }

        this.resetBlood()
    }
    // 初始化血条，颜色，数值
    resetBlood(){
        for(var i in this.roleList){
            const sp=this.node.children[i].children[0].getComponent(SpriteComponent);
            sp.color=this.roleList[i].name=='role'?new cc.color(0,255,0,255):new cc.color(255,0,0,255);
            this.roleList[i].bloodNum=1;
        }
    }
    // 更新血条位置以及数值
    upBlood() {
        for (let i = 0; i < 10; i++) {
            if (this.roleList[i]) {
                const sp = this.roleList[i];
                const pos = sp.worldPosition;
                const p = this._came.convertToUINode(pos, this.node);
                p.y += 200;
                p.x-=50;
                
                this.node.children[i].children[0].scale=new cc.Vec3(this.roleList[i].bloodNum||1,1,1)
                this.node.children[i].position = p;
                
            } else {
                this.node.children[i].active = false;
            }
        }
    }
    update(deltaTime: number) {
        // Your update function goes here.
        this.upBlood()
    }
}
