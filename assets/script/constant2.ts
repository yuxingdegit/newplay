import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
enum EVENT_NAME {
    GO = 'going',
    BYE = 'goodbye',
    FINISH_WALK = 'finish',
    SHOW_COIN = 'showcoin',
    GAME_CG = 'gamecg',
    GAME_START = 'gamestart',
    GAME_OVER = 'gameover',
    NEW_LEVEL = 'newlevel',
    SHOW_TALK = 'showtalk',
    SHOW_GUIDE = 'showguide',
    UPDATE_PROGRESS = 'updateprogress',
    POMED = 'pomed'
}

enum CUSTOMER_STATE {
    NONE,
    GO,
    BYE,
}

enum AUDIO_SOURCE {
    BACKGROUND = 'background',
    CLICK = 'click',
    CRASH = 'crash',
    GETMONEY = 'getmoney',
    INCAR = 'incar',
    NEWORDER = 'neworder',
    START = 'start',
    STOP = 'stop',
    TOOT1 = 'toot1',
    TOOT2 = 'toot2',
    WIN = 'win',
}

enum CAR_GROUP {
    NORMAL = 1 << 0,
    MAIN_CAR = 1 << 1,
    OTHER_CAR = 1 << 2,
}

enum ACT_MODE {
    STAND = 0,
    RUN = 1,
    ATTACK = 2
}

@ccclass('constant')
export class constant {
    public static eventName = EVENT_NAME;
    public static castomerState = CUSTOMER_STATE;
    public static audioSource = AUDIO_SOURCE;
    public static carGroup = CAR_GROUP;
    public static actMode = ACT_MODE;
    public static talkTable = ['gogogo', 'nonono'];
    public static ndUI = {
        mainUI: 'mainUI',
        gameUI: 'gameUI',
        resultUI: 'resultUI',
    };

}
