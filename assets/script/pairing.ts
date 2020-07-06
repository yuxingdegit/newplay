import { _decorator, Component, Node,LabelComponent} from 'cc';
import { decastis } from './decastis';
import { constant } from './constant';
const { ccclass, property } = _decorator;

@ccclass('pairing')


export class pairing extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    label=null;
    // 当前匹配人数
    cNumber=1;
    // 匹配总人数
    aNumber=10;
    // 完成匹配
    finish=false;
    start () {
        // Your initialization goes here.
        
    }
    onLoad(){
        this.label=this.node.getChildByName('text').getComponent(LabelComponent);
    }
    onEnable(){
        this.finish=false;
        this.cNumber=1;
        this.label.string=`玩家匹配中...\n(${this.cNumber}/${this.aNumber})`;
    }
    
    update (deltaTime: number) {
        // Your update function goes here.
        if(this.finish)return;

        if(this.aNumber>this.cNumber){
            if(Math.random()<0.08){
                this.cNumber++;
                this.label.string=`玩家匹配中...\n(${this.cNumber}/${this.aNumber})`
            }
        }else{
            this.finish=true;
            this.label.string=`匹配成功...`
            this.scheduleOnce(()=>{
                
                this.node.active=false;
                this.node.parent.active=false;
                decastis.dispatch(constant.eventName.GAME_START);
            },1)
            
        }
    }
}
