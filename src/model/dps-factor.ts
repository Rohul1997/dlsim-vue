export const NAME_MAP: any = {
    attack: 'Atk',
    force_strike: 'FS',
    fs: 'FS',
    skill_1: 'S1',
    skill_2: 'S2',
    skill_3: 'S3',
    skill_4: 'S4',
    s1: 'S1',
    s2: 'S2',
    s3: 'S3',
    s4: 'S4',
    team: 'Team',
    ds: 'DSkill',
    dx: 'DAtk',
};

export class DpsFactor {

    public category: string = '';

    public subcategory: string = '';

    public factor: string = '';

    public dps: number = 0;

    public scaledDps: number;

    public width: number = 0;

    constructor(f: string, dps: number) {
        this.factor = f;
        if (f in NAME_MAP) {
            this.category = NAME_MAP[f];
        } else {
            const parts = f.split('_');
            if (parts[0] in NAME_MAP) {
                this.category = NAME_MAP[parts[0]];
            } else {
                this.category = f.charAt(0) === 'd' ? 'DOther' : 'Other';
            }
            this.subcategory = parts.splice(1).map((w) => (w.charAt(0).toUpperCase() + w.slice(1))).join(' ');
        }
        this.dps = dps;
        this.scaledDps = this.dps;
    }

    public scaleOriginalDPS(factor: number) {
        this.scaledDps = Math.floor(this.dps * factor);
    }

    public factorString() {
        if (this.subcategory === '') {
            return this.category;
        } else {
            return this.category + ' ' + this.subcategory;
        }
    }
}

