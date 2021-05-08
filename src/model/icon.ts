// @ts-nocheck
export const NO = '<NO>';
export class Icon {
    public qual: string;
    public icon: string;
    public name: string;
    public link: string;
    constructor(qual: string, data: Object) {
        this.qual = qual;
        this.name = data.name;
        this.icon = data.icon;
        this.link = data.link || this.name;
        this.deco = data.deco;
    }

    public get src() {
        return `/dl-sim/pic/${this.icon}`;
    }

    public get deco_src() {
        return `/dl-sim/pic/${this.deco}`;
    }

    public get wiki() {
        if (this.link != NO) {
            return encodeURI(`https://dragalialost.wiki/w/${this.link}`);
        }
        return '';
    }
}