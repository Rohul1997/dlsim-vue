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
        link: 'Strength_%2B10%25_(Co-ability)',
    },
    Wand: {
        flame: 'Student_Maribelle',
        water: 'Lily',
        wind: 'Noelle',
        light: 'Xiao_Lei',
        shadow: 'Althemia',
        link: 'Skill_Damage_%2B15%25_(Co-ability)',
    },
    Dagger: {
        flame: 'Ezelith',
        water: 'Dragonyule_Cleo',
        wind: 'Francesca',
        light: 'Mitsuhide',
        shadow: 'Alex',
        link: 'Critical_Rate_%2B10%25_(Co-ability)',
    },
    Bow: {
        flame: 'Chelsea',
        water: 'Laranoa',
        wind: 'Joachim',
        light: 'Elias',
        shadow: 'Nefaria',
        link: 'Skill_Haste_%2B15%25_(Co-ability)',
    },
    Axe2: {
        flame: 'Valentines_Melody',
        water: 'Valentines_Melody',
        wind: 'Valentines_Melody',
        light: 'Valentines_Melody',
        shadow: 'Valentines_Melody',
        link: 'Critical_Damage_%2B30%25_(Co-ability)',
    },
};

const AfflictionTypes: Record<string, string> = {
    flame: 'burn',
    water: 'frostbite',
    wind: 'poison',
    light: 'paralysis',
    shadow: 'poison',
};

interface CoabObject {
    icon: string;
    name: string;
    link: string;
}

const uptimePattern = /;? ?(\d+)\% (burn|frostbite|poison|paralysis) uptime/;

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
            adt.affliction = AfflictionTypes[adt.element] || '';
            adt.weaponType = n[4] || '';
            adt.fifth = n[5];
            adt.wyrmprint0 = n[6] || '';
            adt.wyrmprint1 = n[7] || '';
            adt.dragon = n[8] || '';
            adt.dragon = adt.dragon.replace(/;.*$/, '');
            adt.weapon = n[9] || '';
            adt.weapon = adt.weapon.replace(/;.*$/, '');
            const coabs = n.slice(10, 13);
            for (let i = 0; i < 3; i++) {
                if (coabs[i]) {
                    if (GenericCoabs[coabs[i]]) {
                        adt.coabs.push({
                            icon: GenericCoabs[coabs[i]][adt.element],
                            name: coabs[i],
                            link: GenericCoabs[coabs[i]].link,
                        });
                    } else {
                        adt.coabs.push({ icon: coabs[i], name: coabs[i], link: coabs[i] });
                    }
                }
            }
            adt.coabs.sort((a, b) => a.icon === a.name ? -1 : (a.name < b.name ? -1 : 0));
            // skill share s3 = n[13] s4 = n[14]
            adt.condition = n[15] || '';
            adt.comment = n[16] || '';
            const uptime = adt.comment.match(uptimePattern);
            if (uptime && uptime[2] === adt.affliction) {
                adt.uptime = parseInt(uptime[1], 10);
            }
            for (let i = 15; i < n.length; i++) {
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
    public uptime: number = 0;
    public weaponType: string = '';
    public fifth: string = '';
    public wyrmprint0: string = '';
    public wyrmprint1: string = '';
    public dragon: string = '';
    public weapon: string = '';
    public coabs: CoabObject[] = [];
    public condition: string = '';
    public comment: string = '';
    public dps1: Dps = new Dps();
    public dps2: Dps = new Dps();

    public nameReplace(): string {
        return this.name.replace('Valentines', 'Valentine\'s');
    }


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
