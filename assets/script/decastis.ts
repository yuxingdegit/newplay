import { _decorator, Component, Node, CCBoolean } from 'cc';
const { ccclass, property } = _decorator;

interface IEventData {
    func: Function;
    target: any;
}

interface IEvent {
    [eventName: string]: IEventData[];
}

@ccclass('decastis')
export class decastis extends Component {

    public static handle: IEvent = {};

    public static on(eventName: string, cb: Function, tar?: any) {
        if (!this.handle[eventName]) {
            this.handle[eventName] = [];
        }

        const data: IEventData = { func: cb, target: tar };
        this.handle[eventName].push(data);
    }

    public static off(eventName: string, cb: Function, tar?: any) {
        const evt = this.handle[eventName];
        if (!evt || evt.length <= 0) {
            return;
        }

        for (let i = 0; i < evt.length; i++) {
            const event = evt[i]
            if (event.func === cb && (!tar || tar === event.target)) {
                evt.splice(i, 1);
                break;
            }
        }
    }

    public static dispatch(eventName: string, ...args: any) {
        const evt = this.handle[eventName];
        if (!evt || evt.length <= 0) {
            return;
        }

        for (let i = 0; i < evt.length; i++) {
            const event = evt[i];
            event.func.apply(event.target, args);
        }
    }

}
