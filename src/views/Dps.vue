<template>
  <div class="main">
    <div class="head" v-if="mobileView">
      <div class="logo">
        <img class="brand" src="/dl-sim/logo-new.png" />
        <div class="menu" @click="asideHidden = false">
          <i class="el-icon-s-operation"></i>
        </div>
      </div>
    </div>
    <div class="main-scrollbar">
      <ul class="mobile-holder" v-if="mobileView">
        <virtual-list
          v-if="mobileView"
          class="virtual-list"
          :data-key="'id'"
          :data-sources="filtered"
          :data-component="dpsMobile"
          v-loading="loading"
          element-loading-spinner="el-icon-loading"
          element-loading-text="loading..."
        />
      </ul>
      <ul class="holder" v-if="!mobileView">
        <li class="title h-40">
          <div class="dib name">
            <div class="dfac h-40" style="padding-left: 33px">Adventurer</div>
          </div>
          <div class="dib dps">
            <div class="dfac h-40">DPS Distribution</div>
          </div>
        </li>
        <virtual-list
          class="virtual-list"
          v-if="!mobileView"
          :data-key="'id'"
          :data-sources="filtered"
          :data-component="dpsEntry"
          v-loading="loading"
          element-loading-spinner="el-icon-loading"
          element-loading-text="loading..."
        />
      </ul>
    </div>
    <div
      class="aside-invisible-closer"
      :class="{ show: mobileView && !asideHidden }"
      @click="asideHidden = true"
      v-if="mobileView"
    ></div>
    <div class="aside the-filter" :class="{ show: mobileView && !asideHidden }">
      <div class="aside-container">
        <div class="the-brand">
          <img class="brand" src="/dl-sim/logo-new.png" />
        </div>
        <div class="closer fr" @click="asideHidden = true" v-if="mobileView">
          &times;
        </div>
        <div class="title custom-build">
          <a
            href="https://wildshinobu.pythonanywhere.com/ui/dl_simc.html"
            target="websim"
            >Custom Sim</a
          >
        </div>
        <div class="splitter"></div>
        <div class="last-modified">
          <div class="mb-5">Last modified: {{ lastModifiedTime }}</div>
          <div>
            <div>Changed:</div>
            <div class="last-modified-icons">
              <img
                v-for="lm in lastModifiedList"
                :key="lm.name"
                :src="lm.src"
              />
            </div>
          </div>
        </div>
        <div class="splitter"></div>
        <div class="title">
          Legend
          <span v-if="dpsCategories.length < allCategories.length">
            <a class="toggle" @click="toggleFactor()">Reset</a>
          </span>
        </div>
        <div class="legend" style="line-height: 25px">
          <div
            class="dib"
            v-for="c in allCategories"
            :key="c"
            @click="toggleFactor(c)"
            :class="{ 'c-gray': !dpsCategories.includes(c) }"
          >
            <span class="dib">
              <div class="indic" :class="'c-' + c"></div>
            </span>
            <span class="dib">
              <div class="label">{{ c }}</div>
            </span>
          </div>
        </div>
        <div class="splitter"></div>
        <div class="title">Affliction</div>
        <div class="filter">
          <el-radio-group
            class="rg-filter"
            v-model="afflict"
            size="mini"
            @change="reload()"
          >
            <el-radio-button label="ALWAYS">100%</el-radio-button>
            <el-radio-button label="SELF">Self</el-radio-button>
            <el-radio-button label="IMMUNE">0%</el-radio-button>
          </el-radio-group>
        </div>
        <div class="title">Situation</div>
        <div class="filter">
          <el-checkbox
            label="NIHILISM"
            v-model="nihilismChecked"
            @change="reload()"
          >
            Curse of Nihility
          </el-checkbox>
        </div>
        <div class="filter">
          <el-checkbox label="MONO" v-model="monoChecked" @change="reload()">
            Element Lock
          </el-checkbox>
        </div>
        <div class="title">Special Variants</div>
        <div class="filter">
          <el-radio-group
            class="rg-filter"
            v-model="variant"
            size="mini"
            @change="reload()"
          >
            <el-radio-button label="HIDDEN">Hidden</el-radio-button>
            <el-radio-button label="VISIBLE">Visible</el-radio-button>
            <el-radio-button label="ONLY">Only</el-radio-button>
          </el-radio-group>
        </div>
        <div class="title">Team DPS</div>
        <div class="filter">
          <el-input-number
            v-model="teamdps"
            :min="0"
            :step="5000"
            size="mini"
            @change="reload()"
          ></el-input-number>
        </div>
        <div class="splitter"></div>
        <div class="title">
          Element
          <span v-if="elements.length < allElements.length">
            <a class="toggle" @click="toggleElement()">Reset</a>
          </span>
        </div>
        <div class="filter">
          <el-checkbox-group class="cb-filter" v-model="elements" size="mini">
            <el-checkbox
              v-for="e in allElements"
              :key="e"
              :label="e"
              @change="toggleElement(e)"
            >
              <img
                class="icon-element"
                :src="`/dl-sim/pic/icons/${e}.png`"
                alt="K"
              />
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="title">
          Weapon
          <span v-if="weapons.length < allWeapons.length">
            <a class="toggle" @click="toggleWeapon()">Reset</a>
          </span>
        </div>
        <div class="filter">
          <el-checkbox-group class="cb-filter" v-model="weapons" size="mini">
            <el-checkbox
              v-for="w in allWeapons"
              :key="w"
              :label="w"
              @change="toggleWeapon(w)"
            >
              <img class="icon-weapon" :src="`/dl-sim/pic/icons/${w}.png`" />
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="splitter"></div>
        <div class="filter footer">
          <div class="links">
            <a href="https://github.com/dl-stuff/dl/wiki">About</a>
            <a class="pl-15" href="https://github.com/dl-stuff/dl/issues/new"
              >Feedback</a
            >
          </div>
          <!-- <div class="powerby mb-5">powered by <a href="https://cn.vuejs.org/">Vue</a> and <a href="https://element.eleme.cn/">Element</a></div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Http } from "@/service/http";
import { Adventurer, ELEMENTTYPES, WEAPONTYPES } from "../model/adventurer";
import { Icon } from "../model/icon";
import { CATEGORIES } from "../model/dps";
import DpsEntry from "./DpsEntry.vue";
import DpsMobile from "./DpsMobile.vue";
// @ts-ignore
import Popper from "vue-popperjs";
// @ts-ignore
import VirtualList from "vue-virtual-scroll-list";
import { humanized_time_span } from "@/service/time-span";

@Component({
  components: {
    Popper,
    "virtual-list": VirtualList,
  },
})
export default class DpsComponent extends Vue {
  public dpsEntry = DpsEntry;
  public dpsMobile = DpsMobile;

  public get simPageURL(): string {
    this.situation = this.nihilismChecked ? "NIHILISM" : "NORMAL";
    this.elelock = this.monoChecked ? "MONO" : "ANY";
    return `/dl-sim/page/${this.afflict}-${this.situation}-${this.elelock}.json`;
  }
  public afflict: string = localStorage.getItem("afflict") || "ALWAYS"; // "ALWAYS" | "SELF" | "IMMUNE"
  public situation: string = localStorage.getItem("situation") || "NORMAL"; //  "NORMAL" | "NIHILISM"
  private nihilismChecked: boolean = false;
  public elelock: string = localStorage.getItem("elelock") || "ANY"; // "ANY" | "MONO"
  private monoChecked: boolean = false;
  public variant: string = localStorage.getItem("variant") || "HIDDEN"; // "VISIBLE" | "HIDDEN" | "ONLY"
  public teamdps: number = 30000;
  public allElements = ELEMENTTYPES;
  public prevElements = ELEMENTTYPES.slice();
  public elements: string[] = ELEMENTTYPES.slice();
  public allWeapons = WEAPONTYPES;
  public prevWeapons = WEAPONTYPES.slice();
  public weapons: string[] = WEAPONTYPES.slice();
  [index: string]: any;
  public lastModifiedTime: string = "";
  public lastModifiedList: string[] = [];

  public allCategories = CATEGORIES;
  public dpsCategories: string[] = CATEGORIES.slice();

  private mobileView: boolean = false;
  private asideHidden: boolean = true;
  private loading: boolean = true;

  private cachedPageURL: string = "";
  private adventurers: Adventurer[] = [];
  private filtered: Adventurer[] = [];

  public async reload() {
    this.loading = true;
    await this.$nextTick();
    await this.reloadOps();
    await this.$nextTick();
    this.loading = false;
  }

  public async reloadOps() {
    if (this.simPageURL !== this.cachedPageURL) {
      const simData = await this.loadSimPage();
      if (!simData) {
        return;
      }
      this.adventurers = Adventurer.fromJSON(simData);
      this.cachedPageURL = this.adventurers.length > 0 ? this.csvUrl : "";
    }

    this.adventurers.forEach((a) => {
      a.dps.team.value = this.teamdps;
      a.dps.filterFactors(this.dpsCategories);
    });

    this.filtered = Adventurer.sort(this.adventurers.filter(this.matched));
    const maxd = this.filtered.length > 0 ? this.filtered[0].dps.total : 0;

    this.adventurers.forEach((a) => {
      a.dps.updateWidths(maxd);
    });

    for (const key of [
      "teamdps",
      "elements",
      "weapons",
      "afflict",
      "situation",
      "elelock",
      "variant",
    ]) {
      localStorage.setItem(key, this[key].toString());
    }
  }

  public mounted() {
    (window as any).$dps = this;
    (window as any).$http = Http;

    if (localStorage.getItem("teamdps")) {
      this.teamdps = parseInt(localStorage.getItem("teamdps")!, 10);
    }
    for (const key of ["elements", "weapons"]) {
      const value = localStorage.getItem(key);
      if (value) {
        this[key] = value.split(",");
      }
    }

    window.onresize = () => {
      this.mobileView = window.outerWidth <= 800;
    };
    this.mobileView = window.outerWidth <= 800;
    this.nihilismChecked = this.situation == "NIHILISM";
    this.monoChecked = this.elelock == "MONO";
    this.loadIconIndex();
    this.loadLastModified();
    this.reload();
  }

  private toggleCheckboxGroup(
    next: string,
    current: string[],
    complete: string[]
  ) {
    if (!next || current.length === 0) {
      return complete.slice();
    }
    if (current.length === complete.length) {
      return [next];
    }
    if (current.includes(next)) {
      if (current.length === 1) {
        current = complete.slice();
      }
      current.splice(current.indexOf(next), 1);
    } else {
      if (current.length == complete.length - 1) {
        current = [next];
      } else {
        current.push(next);
      }
    }
    return current;
  }

  private toggleNihilism() {}

  private toggleElement(element: string) {
    this.elements = this.toggleCheckboxGroup(
      element,
      this.prevElements,
      this.allElements
    );
    this.prevElements = this.elements;
    this.reload();
  }

  private toggleWeapon(weapon: string) {
    this.weapons = this.toggleCheckboxGroup(
      weapon,
      this.prevWeapons,
      this.allWeapons
    );
    this.prevWeapons = this.weapons;
    this.reload();
  }

  private async toggleFactor(category?: string) {
    this.loading = true;
    await this.$nextTick();
    await this.toggleFactorOps(category);
    await this.$nextTick();
    this.loading = false;
  }

  private async toggleFactorOps(category?: string) {
    if (!category) {
      this.dpsCategories = this.allCategories.slice();
    } else if (this.dpsCategories.includes(category)) {
      if (this.dpsCategories.length === 1) {
        this.dpsCategories = this.allCategories.slice();
      }
      this.dpsCategories.splice(this.dpsCategories.indexOf(category), 1);
    } else {
      if (this.dpsCategories.length == this.allCategories.length - 1) {
        this.dpsCategories = [category];
      } else {
        this.dpsCategories.push(category);
      }
    }

    this.filtered.forEach((a) => {
      a.dps.filterFactors(this.dpsCategories);
    });
    Adventurer.sort(this.filtered);
    const maxd = this.filtered.length > 0 ? this.filtered[0].dps.total : 0;
    this.adventurers.forEach((a) => {
      a.dps.updateWidths(maxd);
    });
  }

  private async loadSimPage(): Promise<Object> {
    try {
      const page: Object = await Http.Get(this.simPageURL, "json");
      return page;
    } catch (e) {
      return "";
    }
  }

  private async loadIconIndex() {
    try {
      const iconIndex = await Http.Get("/dl-sim/pic/index.json", "json");
      for (const [key, value] of Object.entries(iconIndex)) {
        iconIndex[key] = new Icon(key, value as Object);
      }
      Adventurer.iconIndex = iconIndex;
    } catch (e) {}
  }

  private async loadLastModified() {
    try {
      const lastmod = await Http.Get(`/dl-sim/page/lastmodified.json`, "json");
      this.lastModifiedTime = humanized_time_span(
        new Date(parseInt(lastmod.timestamp))
      );
      this.lastModifiedList = lastmod.message.map(Adventurer.getIcon);
    } catch (e) {}
  }

  private matched(adventurer: Adventurer): boolean {
    if (this.elements.length > 0 && !this.elements.includes(adventurer.ele)) {
      return false;
    }
    if (this.weapons.length > 0 && !this.weapons.includes(adventurer.wt)) {
      return false;
    }
    if (this.variant == "HIDDEN" && adventurer.variant != null) {
      return false;
    }
    if (this.variant == "ONLY" && adventurer.variant == null) {
      return false;
    }
    return true;
  }
}
</script>

<style>
.mt-5 {
  margin-top: 5px !important;
}
.mr-20 {
  margin-right: 20px !important;
}
.pl-15 {
  padding-left: 15px;
}
.op-3 {
  opacity: 0.3 !important;
}
.op-9 {
  opacity: 0.9 !important;
}
.main {
  padding: 0px;
  margin-top: 0;
  height: 100%;
  min-height: auto;
  box-sizing: border-box;
}

.holder .popper {
  color: #fff !important;
  background: #303133 !important;
  border-color: #303133 !important;
  padding: 4px 8px !important;
  font-size: 12px !important;
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
}

.holder .popper .popper__arrow {
  border-color: #303133 transparent transparent transparent !important;
}
</style>

<style lang="css">
.dfac {
  display: flex !important;
  align-items: center;
}
.dib {
  display: inline-block;
}
.fr {
  float: right !important;
}
.mt-2 {
  margin-top: 2px;
}
.ml-4 {
  margin-left: 4px;
}
.ml-6 {
  margin-left: 6px;
}
.mb-1 {
  margin-bottom: 1px;
}
.mb-2 {
  margin-bottom: 2px;
}
.mb-3 {
  margin-bottom: 3px;
}
.mb-5 {
  margin-bottom: 5px;
}
.mb-6 {
  margin-bottom: 6px;
}
.mb-10 {
  margin-bottom: 10px;
}
.h-50 {
  height: 50px;
}
.h-40 {
  height: 40px;
}
.h-10 {
  height: 10px !important;
}
.h-5 {
  height: 5px !important;
}

.non-condition-dps b {
  font-weight: 400 !important;
  opacity: 0.7;
}

.main-scrollbar {
  height: 100vh;
}

.virtual-list {
  height: calc(100vh - 60px);
  margin-right: 321px;
  overflow-y: auto;
  padding-top: 5px;
}

/* .holder .variant {
  background-image: linear-gradient(to right, rgba(64, 158, 255, 0.7), white);
  position: relative;
}

.mobile-holder .variant {
  position: relative;
  background-color: transparent;
} */
.holder .variant,
.mobile-holder .variant {
  position: relative;
  background-color: transparent;
}
.holder .variant::before,
.mobile-holder .variant::before {
  position: absolute;
  content: " ";
  background-image: linear-gradient(to right, rgba(64, 158, 255, 0.7), white);
  z-index: -1;
}
.holder .variant::before {
  width: 75vw;
  height: 100%;
}
.mobile-holder .variant::before {
  width: 90vw;
  height: 92%;
}

.variant-txt {
  color: white;
}

.holder .variant-txt {
  position: absolute;
  writing-mode: vertical-rl;
  transform: rotate(-180deg);
  top: 4px;
  left: 1px;
  font-size: 0.8em;
  font-weight: 700;
  z-index: 2;
}

.holder {
  min-width: 1000px;
  width: 100%;
  padding: 0px;
  margin: 0px;
  padding-bottom: 20px;
}

.holder li {
  list-style: none;
  display: grid;
  grid-template-columns: 430px 1fr 60px;
}
.holder li .name {
  height: 80px;
  position: relative;
}

.holder .title {
  border-bottom: 1px solid #eee;
  margin-bottom: 10px;
}
.holder .title .name,
.holder .title .dps,
.holder .title .comment,
.holder .title .condition {
  font-size: 14px !important;
  color: #000 !important;
  font-weight: 500;
}
.title a,
.avatar-box,
.custom-sim-link {
  text-decoration: none;
  color: rgba(64, 158, 255, 1);
  position: relative;
  font-weight: bold;
}
.title a:hover,
.avatar-box:hover,
.custom-sim-link:hover {
  text-decoration: underline;
}
.title a[target]:after {
  /* position: absolute;
  top: 2px;
  right: -15px; */

  content: " ";
  background: url('data:image/svg+xml; utf8, <svg height="1024" width="768" xmlns="http://www.w3.org/2000/svg"><path d="M640 768H128V257.90599999999995L256 256V128H0v768h768V576H640V768zM384 128l128 128L320 448l128 128 192-192 128 128V128H384z"/></svg>');
  background-size: cover;
  display: inline-block;
  width: 0.6em;
  height: 0.75em;
  position: relative;
  left: 0.2em;
  margin-right: 0.2em;
  /* font-size: 13px;
  color: black;
  line-height: 3px;
  height: 5px;
  width: 5px;
  border-right: 3px solid white;
  border-top: 3px solid white; */
}
.last-modified {
  color: #666;
  font-size: 0.9em;
}
.last-modified-icons {
  margin-right: 12px;
}
.last-modified-icons > img {
  width: 30px;
  height: 30px;
}

.last-modified-list {
  margin-top: 5px;
  display: flex;
}

.custom-sim-link {
  font-size: 12px;
}

.holder .name {
  padding: 0px;
}

.holder .name a {
  display: inline-block;
  position: relative;
}

.holder .name .avatar img {
  width: 85px;
  height: 85px;
  position: relative;
  top: -2.5px;
}

.holder .name a.avatar {
  /* margin-right: 5px; */
  margin-left: 0px;
}

.holder .name img.wyrmprint {
  width: 40px;
  height: 40px;
}

.holder .name img.deco {
  height: 16px;
  position: absolute;
  top: 12px;
  z-index: 2;
}

.stats {
  height: 1em;
  margin-right: 8px;
}
.stats > img.stats-icon {
  position: relative;
  top: 3px;
  width: 1em;
  height: 1em;
  margin-right: 1px;
}
.stats > span.stats-txt {
  font-size: 12px;
}

.holder .name .skillshare {
  text-align: right;
  padding-right: 1px;
}
.holder .name .skillshare > img {
  width: 30px;
  height: 30px;
  margin: 5px;
}
.mobile-holder img.skillshare {
  width: 20px;
  height: 20px;
  margin: 5px;
}

.holder .dps {
  padding: 0px 10px;
  height: 80px;
  position: relative;
}

.shift {
  top: -10px;
}

.holder .dps .avatar-box {
  color: #000;
  font-size: 12px;
  display: inline;
}

.holder li .comment {
  font-size: 12px;
  line-height: 12px;
  color: #666;
}
/* .holder .comment,
.holder .condition {
  font-size: 12px;
  color: #000;
  overflow: hidden;
}
.holder .comment {
  padding-left: 10px;
}
.holder .condition {
  padding-left: 40px;
} 
div.comment {
  margin-bottom: 2px;
}
*/

div.adt-body {
  margin-left: 6px;
  text-align: left;
}

.avatar-slot-grid {
  display: grid;
  grid-template-columns: 1fr 40px 8px 40px 40px 40px 40px 8px 40px 40px 40px;
  grid-template-rows: 40px 40px;
  padding-left: 15px;
  /* display: flex;
  align-items: center; */
}

.avatar-slot-grid span {
  height: 40px;
}

.avatar-slot-grid span:first-child {
  grid-row: 1 / 3;
}

.dps-progress {
  height: 100%;
  border-radius: 2px;
  display: block;
  color: black;
}

.dps-progress:hover {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(64, 158, 255, 1);
}

.dps-details {
  padding: 6px 12px !important;
  font-size: 12px !important;
}

.factors {
  height: 12px;
  position: relative;
  box-sizing: border-box;
  background-color: #f0f0f0;
  cursor: pointer;
  border-radius: 2px;
}

.factors .factor {
  background-color: #12b886;
  float: left;
  box-sizing: border-box;
  height: 12px;
  border-left: 1px solid #f0f0f0;
}

.factors .factor:first-child {
  border-left: none;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
}

.factors .factor:nth-last-child(2) {
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
}

.factors .factor:hover {
  cursor: pointer;
}

.holder .full {
  position: relative;
  top: 20px;
  height: 12px;
  font-size: 12px;
  line-height: 12px;
}
.mobile-holder .full {
  float: right;
  margin-right: -42px;
  height: 12px;
  font-size: 12px;
  line-height: 12px;
}
.c-x {
  background-color: #6495ed !important;
}
.c-fs {
  background-color: #4682b4 !important;
}
.c-s1 {
  background-color: #ff8c00 !important;
}
.c-s2 {
  background-color: #ffaf00 !important;
}
.c-s3 {
  background-color: #ffc340 !important;
}
.c-s4 {
  background-color: #ffd700 !important;
}
.c-team {
  background-color: #dc143c !important;
}
.c-dx {
  background-color: #8a2be2 !important;
}
.c-ds1 {
  background-color: #9370db !important;
}
.c-ds2 {
  background-color: #9370db !important;
}
.c-other {
  background-color: #008080 !important;
}
.c-gray {
  opacity: 0.2 !important;
}

.legend {
  cursor: pointer;
}

.legend .indic {
  height: 14px;
  width: 14px;
  border-radius: 2px;
  margin-bottom: -2px;
}
.legend .label {
  width: 40px;
  margin-left: 5px;
  font-size: 12px;
}

.factors-detail p {
  color: #333;
  padding: 1px;
  margin: 0px;
  font-size: 12px;
}

span.f-title {
  color: #999;
}

.aside {
  width: 290px;
  padding-left: 30px;
  position: fixed;
  overflow-y: auto;
  overflow-x: visible;
  top: 0;
  right: 0;
  bottom: 0;
  font-size: 14px !important;
  border-left: 1px solid #eee;
  background-color: white;

  -webkit-transition: all 0.5s ease;
  -moz-transition: all 0.5s ease;
  -o-transition: all 0.5s ease;
  -ms-transition: all 0.5s ease;
  transition: all 0.5s ease;
}

.cb-filter {
  line-height: 25px;
}

.rg-filter .el-radio-button--mini .el-radio-button__inner {
  font-size: 13px;
}

.cb-filter .el-checkbox {
  margin-right: 20px !important;
}

.cb-filter .el-checkbox:last-child {
  margin-right: 0px !important;
}
.cb-filter .el-checkbox__input {
  line-height: 16px !important;
}
.cb-filter .el-checkbox__label {
  padding-left: 5px !important;
}

.the-filter .splitter {
  height: 1px;
  background: #eee;
  padding: 0px;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: -30px !important;
}

.the-filter .title {
  font-weight: 500;
  margin-top: 25px;
  margin-bottom: 10px;
}

.the-filter .title .toggle {
  font-size: 12px;
  color: #409eff;
  cursor: pointer;
  font-weight: 400;
  margin-left: 10px;
  text-decoration: none;
}
.the-filter .title .toggle:hover {
  text-decoration: underline;
  font-weight: 500;
}

.icon-weapon,
.icon-element {
  width: 16px;
  height: 16px;
  line-height: 16px;
  margin-bottom: -3px;
}

.aside .aside-container {
  height: 100%;
  min-height: 800px;
  position: relative;
}

.aside .the-brand {
  width: 200px;
  padding: 20px 0 0 0;
}
.aside .the-brand .brand {
  width: 175px;
  height: 45px;
}

.aside .commits {
  padding-inline-start: 20px;
  font-size: 12px;
}

.aside .commits li {
  line-height: 22px;
  margin-bottom: 10px;
}

/* .aside .commits .message {

  } */

.aside .commits .date {
  display: block;
  color: #aaa;
}

.aside .footer {
  padding-bottom: 20px;
}

.aside .footer .powerby {
  font-size: 10px;
  color: #aaa;
  padding-bottom: 10px;
}
.aside .footer .powerby a {
  color: #999;
  text-decoration: none;
}

.aside .footer .links {
  padding-bottom: 5px;
}

.aside .footer .links a {
  font-size: 11px;
  color: #aaa;
  text-decoration: none;
}

.aside .footer .links a:hover,
.aside .footer .powerby a:hover {
  text-decoration: underline;
  color: #999;
}

@media screen and (max-width: 800px) {
  .head {
    display: block;
    -webkit-box-shadow: 0px 2px 5px 0px rgba(221, 221, 221, 1);
    -moz-box-shadow: 0px 2px 5px 0px rgba(221, 221, 221, 1);
    box-shadow: 0px 2px 5px 0px rgba(221, 221, 221, 1);
  }
  .head .logo {
    height: 60px;
    padding: 0 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .head .brand {
    width: 150px;
  }

  .head .menu {
    color: #888;
    border-radius: 4px;
    border: 1px solid #ccc;
    padding: 5px 6px 4px 6px;
  }

  .aside {
    z-index: 999;
    background: #fff;
    transform: translate3d(320px, 0, 0);
    box-shadow: 0 0 12px rgba(0, 0, 0, 0);
  }

  .aside.show {
    transform: translate3d(0, 0, 0);
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.15);
  }

  .main-scrollbar {
    height: calc(100vh - 60px);
  }

  .virtual-list {
    margin-right: 0px;
  }

  .aside .aside-container {
    min-height: 680px;
  }

  .aside .the-brand {
    display: none;
  }

  .aside .closer {
    font-size: 24px;
    padding: 20px;
    margin-top: -27px;
    color: #666;
    cursor: pointer;
  }

  .aside-invisible-closer {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: none;
  }

  .aside-invisible-closer.show {
    display: block;
  }

  .mobile-holder {
    list-style: none;
    padding: 15px 0px 5px 0px;
    margin: 0px;
  }

  .mobile-holder .content {
    width: calc(100% - 75px);
    vertical-align: top;
  }

  .mobile-holder .content .drogon,
  .mobile-holder .content .chains > div {
    height: 30px;
    width: 30px;
  }

  .mobile-holder .content .chains {
    border-right: 1px solid #ccc;
    padding-right: 3px;
    margin-right: 3px;
    height: 30px;
  }

  .mobile-holder .dps {
    width: calc(100% - 25px);
  }

  .mobile-holder .dps .dps1 {
    height: 16px;
  }
  .mobile-holder .dps .dps1 .full {
    margin-right: -42px;
    line-height: 18px;
    text-align: left;
  }

  .mobile-holder .dps .dps2 {
    height: 8px;
  }

  .mobile-holder .avatar-box {
    font-size: 12px;
    text-align: center;
    padding-left: 10px;
    padding-right: 1px;
    display: grid;
    grid-template-rows: 2fr 1fr;
  }

  .mobile-holder .avatar-box span {
    line-height: 25px;
  }

  .mobile-holder img.avatar {
    width: 60px;
    height: 60px;
  }
  .mobile-holder img.wyrmprint {
    width: 30px;
    height: 30px;
  }
  .mobile-holder .wp-deco-holder {
    display: inline-block;
    position: relative;
  }
  .mobile-holder img.deco {
    width: 12px;
    height: 12px;
    top: 9px;
    position: absolute;
    z-index: 2;
  }

  .mobile-holder .mobile-comment {
    font-size: 12px;
    line-height: 12px;
    color: #aaaaaa;
  }
}
</style>
