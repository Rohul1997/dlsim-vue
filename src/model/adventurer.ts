// @ts-nocheck
import { Dps } from './dps';
import { Icon, NO } from './icon';

export const ELEMENTTYPES = [
    'flame', 'water', 'wind', 'light', 'shadow'
];

export const WEAPONTYPES = [
    'sword', 'blade', 'dagger', 'axe',
    'lance', 'bow', 'wand', 'staff', 'gun'
];

export class Adventurer {
    public static fromJSON(data: Object): Adventurer[] {
        const result: Adventurer[] = [];
        for (const value of Object.values(data)) {
            result.push(new Adventurer(value));
        }
        return result;
    }

    public static sort(adventurers: Adventurer[]): Adventurer[] {
        return adventurers.sort((p, q) => {
            return q.dps.total - p.dps.total;
        });
    }

    static iconIndex: Object;
    public static getIcon(key: string) {
        return Adventurer.iconIndex[key];
    }


    public id: string;
    public variant: string | undefined;
    public ele: string;
    public wt: string;
    public chara: Icon;
    public drg: Icon;
    public wep: Icon;
    public wps: Icon[] = [];
    public coabs: Icon[] = [];
    public share: Icon[] = [];
    public cond: string;
    public comment: string;
    public stats: Icon[] = [];
    public dps: Dps;

    public get customsim() {
        if (this.variant) {
            return `https://wildshinobu.pythonanywhere.com/ui/dl_simc.html?adv_name=${this.chara.qual}&variant=${this.variant}`;
        } else {
            return `https://wildshinobu.pythonanywhere.com/ui/dl_simc.html?adv_name=${this.chara.qual}`;
        }
    }

    constructor(data: Object) {
        this.chara = Adventurer.getIcon(data.adv);
        if (data.variant) {
            this.id = `${this.chara.name} (${data.variant})`;
            this.variant = data.variant;
        } else {
            this.id = this.chara.name;
            this.variant = null;
        }
        this.ele = data.ele;
        this.wt = data.wt;
        this.drg = Adventurer.getIcon(data.drg);
        this.wep = Adventurer.getIcon(data.wep);
        this.wps = data.wps.map(Adventurer.getIcon);
        while (this.wps.length < 7) {
            const empty = `Empty_${this.wps.length + 1}`;
            this.wps.push(Adventurer.getIcon(empty));
        }
        this.coabs = data.coabs.map(Adventurer.getIcon);
        this.share = data.share.map(Adventurer.getIcon);
        this.cond = data.cond;
        this.comment = data.comment;
        this.stats = [];
        if (data.stats) {
            for (const [key, value] of Object.entries(data.stats)) {
                this.stats.push(new Icon(key, { name: key, icon: `icons/${key}.png`, link: value }));
            }
        }
        this.dps = new Dps(data.team, data.slices);
    }
}

