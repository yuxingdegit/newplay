import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameUi')
export class GameUi extends Component {
    @property({
        type: Node
    })
    btnStart: Node = null;

    @property({
        type: Node
    })
    btnStore: Node = null;

    @property({
        type: Node
    })
    btnAction: Node = null;
    start () {
        this.btnStart.on(cc.SystemEventType.TOUCH_END,this.gameStart,this);
        this.btnStore.on(cc.SystemEventType.TOUCH_END,this.goStore,this);
        this.btnAction.on(cc.SystemEventType.TOUCH_END,this.goAction,this);
    }
    // 开始按钮
    public gameStart(){
        console.log('start event')
    }
    // 商店按钮
    public goStore(){
        console.log('gostore event')
    }
    // 动作技能
    public goAction(){
        console.log('goaction event')
    }
    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
