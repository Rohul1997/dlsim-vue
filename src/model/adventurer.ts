import { Dps } from './dps';

const unidecode = require('unidecode');

const NO = '<NO>';
const CoabLinks: Record<string, string> = {
    Blade: 'Strength_%2B10%25_(Co-ability)',
    Wand: 'Skill_Damage_%2B15%25_(Co-ability)',
    Dagger: 'Critical_Rate_%2B10%25_(Co-ability)',
    Bow: 'Skill_Haste_%2B15%25_(Co-ability)',
    Axe2: 'Critical_Damage_%2B30%25_(Co-ability)',
    Dagger2: 'Standard_Attack_Damage_%2B20%25',
};
class IconObj {
    public icon: string;
    public name: string;
    public cat: string;
    public link: string;
    public generic: boolean = false;
    constructor(name: string, icon: string, cat?: string, link?: string) {
        this.name = name;
        this.icon = icon;
        this.cat = cat || 'character';
        this.link = link || encodeURI(name);
    }

    public get src() {
        return `/dl-sim/pic/${this.cat}/${this.icon}.png`;
    }

    public get wiki() {
        if (this.link != NO) {
            return `https://dragalialost.gamepedia.com/${this.link}`;
        }
        return '';
    }

    public get qual() {
        return unidecode(this.name).replace(/[^0-9a-zA-Z ]/, '').replace(' ', '_');
    }
}

export class Adventurer {
    public static ParseCSV(csv: string): Adventurer[] {
        const lines = csv.split(/\n/);
        const result: Adventurer[] = [];
        for (const line of lines) {
            try {
                const n = line.split(',');
                if (n.length < 26) { continue; }
                result.push(new Adventurer(n));
            } catch (e) { continue; }
        }
        return result;
    }

    public static sort(adventurers: Adventurer[]): Adventurer[] {
        return adventurers.sort((p, q) => {
            return q.dps.total - p.dps.total;
        });
    }

    public chara: IconObj;
    public rarity: string;
    public ele: string;
    public wt: string;
    public slots: IconObj[] = [];
    public coabs: IconObj[] = [];
    public share: IconObj[] = [];
    public condition: string;
    public comment: string;
    public stats: IconObj[] = [];
    public dps: Dps;

    constructor(n: string[]) {
        this.chara = new IconObj(n[1], n[2]);
        this.rarity = n[2].slice(-1);
        this.ele = n[3];
        this.wt = n[4];
        // this.att = n[5];
        this.slots = [
            new IconObj(n[12], n[13], 'weapon'), // weapon
            new IconObj(n[10], n[11], 'dragon'), // dragon
            new IconObj(n[6], n[7], 'amulet'), // wp1
            new IconObj(n[8], n[9], 'amulet'), // wp2
        ];
        const uniqueC = [];
        const genericC = [];
        for (let i = 14; i < 20; i += 2) {
            const c_name = n[i];
            if (!c_name) {
                continue;
            }
            const c_icon = n[i + 1];
            if (c_icon) {
                uniqueC.push(new IconObj(c_name, c_icon));
            } else {
                genericC.push(new IconObj(c_name, c_name, 'coabs', CoabLinks[c_name]));
            }
        }
        this.coabs = uniqueC.concat(genericC);
        if (n[20] === 'Weapon') {
            this.share.push(new IconObj(n[20], 'weaponskill', 'icons', NO));
        } else {
            this.share.push(new IconObj(n[20], n[21]));
        }
        if (n[22]) {
            this.share.push(new IconObj(n[22], n[23]));
        }
        this.condition = n[24];
        this.comment = n[25];

        let team = 0;
        for (const s of n[26].split(';')) {
            if (!s) {
                continue;
            }
            const p = s.split(':');
            if (p[0] === 'team') {
                team = parseFloat(p[1]);
                this.stats.push(new IconObj((Math.round(team * 10) / 10).toFixed(1) + '%', p[0], 'icons', NO));
            } else {
                this.stats.push(new IconObj(p[1], p[0], 'icons', NO));
            }
        }
        this.dps = new Dps(n.slice(27), team);
    }
}

