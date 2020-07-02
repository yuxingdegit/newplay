import { _decorator, Component, Node, loader, AudioClip } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('audioManager')
export class audioManager {
    public static playMusic(name: string) {
        const path = `audio/music/${name}`;
        loader.loadRes(path, AudioClip, (err: any, clip: AudioClip) => {
            if (err) {
                console.error('err!' + err);
                return;
            }

            clip.setLoop(true);
            clip.play();
        })
    }

    public static playEffect(name: string) {
        const path = `audio/sound/${name}`;
        loader.loadRes(path, AudioClip, (err: any, clip: AudioClip) => {
            if (err) {
                console.error('err!' + err);
                return;
            }

            clip.setLoop(false);
            clip.playOneShot(1);
        })
    }
}
