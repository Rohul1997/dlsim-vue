export const CATEGORIES = [
    'x', 'fs', 'other', 'team',
    's1', 's2', 's3', 's4',
    'dx', 'ds1',
];

export class DpsFactor {
    public name: string;
    public kind: string;
    public value: number;
    public scale: number;
    public width: number = 0;

    constructor(name: string, value: number, scale?: number) {
        this.name = name;
        this.kind = name.split('_')[0];
        if (this.kind.substr(0, 2) == 'fs') { this.kind = 'fs'; } else if (!CATEGORIES.includes(this.kind)) { this.kind = 'other'; }
        this.value = value;
        this.scale = scale || 0;
    }

    public get scaled() {
        if (this.name === 'team') {
            return Math.round(this.value * this.scale);
        } else {
            return Math.round(this.value);
        }
    }
}

export class Dps {
    public factors: DpsFactor[] = [];
    public filtered: DpsFactor[] = [];
    public filter: string[] = CATEGORIES.slice();
    public team: DpsFactor;
    constructor(team: number, slices: [string, number][]) {
        for (const p of slices) {
            this.factors.push(new DpsFactor(p[0], p[1]));
        }
        this.team = new DpsFactor('team', 0, team);
        if (team > 0) {
            this.factors.push(this.team);
        }
        this.filterFactors();
    }
    public get total() {
        return this.filtered.reduce((sum, f) => sum += f.scaled, 0);
    }
    public filterFactors(filter?: string[]) {
        this.filter = filter || this.filter;
        this.filtered = this.factors.filter((f) => f.name && this.filter.includes(f.kind));
    }
    public updateWidths(maxd: number) {
        // let sum = 0;
        for (const f of this.filtered) {
            f.width = Math.floor(1000 * (f.scaled / maxd)) / 10;
        }
        // if (sum > 100) {
        //     this.filtered[-1].width -= (sum - 100)
        // }
    }
}
