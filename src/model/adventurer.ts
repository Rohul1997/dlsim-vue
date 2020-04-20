import { Dps } from './dps';
import { DpsFactor } from './dps-factor';


// Select icon first by unique but non-sim value, then by how much I like em
const GenericCoabs: Record<string, Record<string, string>> = {
    Blade: {
        flame: 'Nobunaga',
        water: 'Celliera',
        wind: 'Melody',
        light: 'Yachiyo',
        shadow: 'Natalie',
    },
    Wand: {
        flame: 'Student_Maribelle',
        water: 'Lily',
        wind: 'Noelle',
        light: 'Xiao_Lei',
        shadow: 'Althemia',
    },
    Dagger: {
        flame: 'Ezelith',
        water: 'Dragonyule_Cleo',
        wind: 'Francesca',
        light: 'Mitsuhide',
        shadow: 'Alex',
    },
    Bow: {
        flame: 'Chelsea',
        water: 'Laranoa',
        wind: 'Joachim',
        light: 'Elias',
        shadow: 'Nefaria',
    },
    Axe2: {
        flame: 'Valentines_Melody',
        water: 'Valentines_Melody',
        wind: 'Valentines_Melody',
        light: 'Valentines_Melody',
        shadow: 'Valentines_Melody',
    },
};

const AfflctionTypes: Record<string, string> = {
    flame: 'burn',
    water: 'frostbite',
    wind: 'poison',
    light: 'paralysis',
    shadow: 'poison',
};

export class Adventurer {

    public static ParseCSVLine(line: string): Adventurer | undefined {
        if (!line) {
            return undefined;
        }
        const n = line.split(',') || [];
        if (!n || !Array.isArray(n) || n.length < 10) {
            return undefined;
        }
        try {
            const adt = new Adventurer();
            adt.dps1.full = parseInt(n[0], 10) || 0;
            if (adt.dps1.full === 0) {
                return undefined;
            }
            adt.name = n[1] || '';
            adt.rarity = n[2].replace('*', '');
            adt.element = n[3] || '';
            adt.affliction = AfflctionTypes[adt.element] || '';
            adt.weaponType = n[4] || '';
            adt.fifth = n[5];
            const slots = n[6].split('][');
            const wym = slots[0].replace('[', '').split('+');
            adt.wyrmprint0 = wym[0] || '';
            adt.wyrmprint1 = wym[1] || '';
            adt.dragon = slots[1].replace(']', '');
            adt.dragon = adt.dragon.replace(/;.*$/, '');
            adt.weapon = slots[2].replace(']', '');
            adt.weapon = adt.weapon.replace(/;.*$/, '');
            const coabs = slots[3].replace(']', '').split('|');
            for (let i = 0; i < 3; i++) {
                if (coabs[i]) {
                    if (GenericCoabs[coabs[i]]) {
                        adt.coabs.push({ icon: GenericCoabs[coabs[i]][adt.element], name: coabs[i] });
                    } else {
                        adt.coabs.push({ icon: coabs[i], name: coabs[i] });
                    }
                }
            }
            adt.condition = n[7];
            adt.comment = n[8] || '';
            for (let i = 9; i < n.length; i++) {
                const df = n[i].split(':');
                adt.dps1.factors.push(new DpsFactor(df[0], parseInt(df[1], 10) || 0));
            }
            adt.dps1.factors = adt.dps1.factors.filter((f) => f.dps > 0);
            adt.dps1.filterd = adt.dps1.factors;
            return adt;
        } catch (e) {
            return undefined;
        }
    }

    public static ParseCSV(csv: string): Adventurer[] {
        const lines = csv.split(/\n/);
        const raw: Adventurer[] = [];
        for (const line of lines) {
            const a = Adventurer.ParseCSVLine(line);
            if (!!a) {
                raw.push(a);
            }
        }
        raw.forEach((a, index) => a.findDps2(raw, index));
        const result = raw.filter((a) => /^_c_/.test(a.name) === false);
        // result.forEach((a, index) => a.findDps2(raw, index));
        return result;
    }

    public static sort(adventurers: Adventurer[]): Adventurer[] {
        return adventurers.sort((p, q) => {
            return q.dps1.all - p.dps1.all;
        });
    }

    // public dps_full: number = 0;
    public name: string = '';
    public rarity: string = '';
    public element: string = '';
    public affliction: string = '';
    public weaponType: string = '';
    public fifth: string = '';
    public wyrmprint0: string = '';
    public wyrmprint1: string = '';
    public dragon: string = '';
    public weapon: string = '';
    public coabs: object[] = [];
    public condition: string = '';
    public comment: string = '';
    public dps1: Dps = new Dps();
    public dps2: Dps = new Dps();

    public findDps2(rawAdventurers: Adventurer[], index: number) {
        if (index + 1 >= rawAdventurers.length || rawAdventurers[index + 1].name !== `_c_${this.name}`) {
            return;
        }
        this.dps2.full = rawAdventurers[index + 1].dps1.full;
        this.dps2.factors = rawAdventurers[index + 1].dps1.factors;
        this.dps2.filterd = rawAdventurers[index + 1].dps1.filterd;
    }

    public filterDpsFactors(categories: string[] = []) {
        this.dps1.filterd = this.dps1.factors.filter((f) => categories.includes(f.category));
        this.dps2.filterd = this.dps2.factors.filter((f) => categories.includes(f.category));
    }
}


/*
line = "8469,G_Cleo,5*,shadow,wand,2255,[Resounding_Rendition+Jewels_of_the_Sun][Shinobi],<hp70 & always in a1>,
	(the true cleo is here),attack:1240,force_strike:0,skill_1:3903,skill_2:600,
	skill_3:0,team_buff:2725,fs_alt:0"
n = line.split(',')
for (let i in n) { console.log(`// ${i}, ${n[i]}`) }

0 8469
1 G_Cleo
2 5*
3 shadow
4 wand
5 2255
6 [Resounding_Rendition+Jewels_of_the_Sun][Shinobi]
7 <hp70 & always in a1>
8 (the true cleo is here)
9 attack:1240
10 force_strike:0
11 skill_1:3903
12 skill_2:600
13 skill_3:0
14 team_buff:2725
15 fs_alt:0
*/
