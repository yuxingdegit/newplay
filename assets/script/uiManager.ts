import { _decorator, Component, Node, find, loader, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('uiManager')
export class uiManager {

    static _uiPanel = new Map<string, Node>();
    public static showND(name: string, cb?: Function, ...args: any[]) {
        if (this._uiPanel.has(name)) {
            const nd = this._uiPanel.get(name);
            const parent = find('Canvas');
            nd.parent = parent;
            const comp = nd.getComponent(name);
            if (comp && comp['show']) {
                comp['show'].apply(comp, args);
            }
            if (cb) {
                cb();
            }
            return;
        }

        const path = `ui/${name}`;
        loader.loadRes(path, Prefab, (err: any, prefab: Prefab) => {
            if (err) {
                console.error('err!');
                return;
            }
            const nd = instantiate(prefab) as Node;
            this._uiPanel.set(name, nd);

            const parent = find('Canvas');
            nd.parent = parent;
            const comp = nd.getComponent(name);
            if (comp && comp['show']) {
                comp['show'].apply(comp, args);
            }
            if (cb) {
                cb();
            }
        });
    }

    public static hideND(name: string, cb?: Function) {
        if (this._uiPanel.has(name)) {
            const nd = this._uiPanel.get(name);
            nd.parent = null;
            const comp = nd.getComponent(name);
            if (comp && comp['hide']) {
                comp['hide'].apply(comp);
            }
            if (cb) {
                cb();
            }
        }
    }
}
