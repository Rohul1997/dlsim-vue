<template>
  <li>
    <div class="dib name h-70 mb-5">
      <div class="avatar-slot-grid">
        <popper trigger="hover" :options="{ placement: 'top' }">
          <div class="popper">{{ source.chara.name }}</div>
          <a
            slot="reference"
            class="d-f avatar"
            :href="source.chara.wiki"
            target="wiki"
          >
            <img :src="source.chara.src" />
          </a>
        </popper>
        <popper trigger="hover" :options="{ placement: 'top' }">
          <div class="popper">{{ source.drg.name }}</div>
          <a slot="reference" :href="source.drg.wiki" target="wiki">
            <img class="d-f wyrmprint" :src="source.drg.src" />
          </a>
        </popper>
        <div>&nbsp;</div>
        <popper
          v-for="i in [0, 1, 2, 5]"
          :key="'sl' + source.wps[i].name + i"
          trigger="hover"
          :options="{ placement: 'top' }"
        >
          <div class="popper">{{ source.wps[i].name }}</div>
          <a
            slot="reference"
            :href="source.wps[i].wiki || undefined"
            target="wiki"
          >
            <img class="d-f wyrmprint" :src="source.wps[i].src" />
          </a>
        </popper>
        <div>&nbsp;</div>
        <popper
          v-for="ca in source.coabs"
          :key="'ca' + ca.name"
          trigger="hover"
          :options="{ placement: 'top' }"
        >
          <div class="popper">{{ ca.name }}</div>
          <a slot="reference" :href="ca.wiki" target="wiki">
            <img
              class="d-f wyrmprint"
              v-bind:class="{ generic: ca.generic }"
              :src="ca.src"
            />
          </a>
        </popper>
        <popper trigger="hover" :options="{ placement: 'top' }">
          <div class="popper">{{ source.wep.name }}</div>
          <a slot="reference" :href="source.wep.wiki" target="wiki">
            <img class="d-f wyrmprint" :src="source.wep.src" />
          </a>
        </popper>
        <div>&nbsp;</div>
        <div class="skillshare">
          <img class="d-f" :src="`/dl-sim/pic/icons/amulet.png`" />
        </div>
        <popper
          v-for="i in [3, 4, 6]"
          :key="'sl' + source.wps[i].name + i"
          trigger="hover"
          :options="{ placement: 'top' }"
        >
          <div class="popper">{{ source.wps[i].name }}</div>
          <a
            slot="reference"
            :href="source.wps[i].wiki || undefined"
            target="wiki"
          >
            <img class="d-f wyrmprint" :src="source.wps[i].src" />
          </a>
        </popper>
        <div>&nbsp;</div>
        <div class="skillshare">
          <img class="d-f" :src="`/dl-sim/pic/icons/skillshare.png`" />
        </div>
        <popper
          v-for="(sh, i) in source.share"
          :key="'sh' + source.share[i].name"
          trigger="hover"
          :options="{ placement: 'top' }"
        >
          <div class="popper">S{{ i + 3 }} {{ source.share[i].name }}</div>
          <a
            slot="reference"
            :href="source.share[i].wiki || undefined"
            target="wiki"
          >
            <img class="d-f wyrmprint" :src="source.share[i].src" />
          </a>
        </popper>
      </div>
    </div>
    <div class="dib dps shift">
      <a
        class="custom-sim-link"
        :href="
          'https://wildshinobu.pythonanywhere.com/ui/dl_simc.html?adv_name=' +
          source.chara.qual
        "
        target="websim"
      >
        <span>Customize</span>
      </a>
      <div class="dps-holder">
        <div class="factors mb-1">
          <popper trigger="hover" :options="{ placement: 'top' }">
            <div class="popper dps-details">
              <span v-for="(f, fi) in source.dps.filtered" :key="'fa' + f.name">
                <span class="f-title"
                  >{{ (fi > 0 ? ", " : "") + f.name }}:</span
                >
                {{ f.scaled }}
              </span>
            </div>
            <div slot="reference" class="dps-progress">
              <div
                v-for="f of source.dps.filtered.filter((f) => f.width > 0)"
                :key="f.factor"
                class="factor"
                :class="'c-' + f.kind"
                :style="{ width: f.width + '%' }"
              ></div>
            </div>
          </popper>
        </div>
        <div class="mb-1">
          <popper
            v-for="s of source.stats"
            :key="'st' + s.icon"
            trigger="hover"
            :options="{ placement: 'top' }"
          >
            <div class="popper">{{ s.icon + ": " + s.name }}</div>
            <span slot="reference" class="stats">
              <img class="stats-icon" :src="s.src" />
              <span class="stats-txt">{{ s.name }}</span>
            </span>
          </popper>
        </div>
        <div class="comment">
          <span v-if="source.condition != ' '"
            >&lt;{{ source.condition }}&gt;</span
          >
          <span v-html="source.comment"></span>
        </div>
      </div>
    </div>
    <div class="dib full">
      <b>{{ source.dps.total }}</b>
    </div>
  </li>
</template>
<script>
import { Vue } from "vue-property-decorator";
import { Adventurer } from "../model/adventurer";
// @ts-ignore
import Popper from "vue-popperjs";

Vue.component("Popper", Popper);
export default {
  name: "adv-component-full",
  props: {
    index: {
      type: Number,
    },
    source: {
      type: Adventurer,
      default() {
        return {};
      },
    },
  },
};
</script>
