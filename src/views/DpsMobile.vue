<template>
  <li class="mb-10">
    <div class="dib" v-bind:class="{ variant: source.variant }">
      <a class="avatar-box" :href="source.customsim" target="websim">
        <a slot="reference" :href="source.chara.wiki" target="wiki">
          <img class="avatar" :src="source.chara.src" />
        </a>
        <span v-if="!source.variant">Customize</span>
        <span v-else>{{ source.variant }}</span>
      </a>
    </div>
    <div class="dib content">
      <div class="mt-2">
        <div class="dib chains">
          <div class="dib">
            <a slot="reference" :href="source.drg.wiki">
              <img class="wyrmprint" :src="source.drg.src" />
            </a>
          </div>
          <div class="dib">
            <a slot="reference" :href="source.wep.wiki">
              <img class="wyrmprint" :src="source.wep.src" />
            </a>
          </div>
        </div>
        <div class="dib chains">
          <div v-for="coab in source.coabs" :key="'ca' + coab.name" class="dib">
            <a slot="reference" :href="coab.wiki" target="wiki">
              <img class="wyrmprint" :src="coab.src" />
            </a>
          </div>
        </div>
        <div class="dib chains">
          <div class="dib" v-for="sha in source.share" :key="'sh' + sha.name">
            <a slot="reference" :href="sha.wiki" target="wiki">
              <img class="wyrmprint" :src="sha.src" />
            </a>
          </div>
        </div>
        <div class="dib">
          <div class="dib" v-for="sl in source.wps" :key="'sl' + sl.name">
            <a slot="reference" :href="sl.wiki" class="wp-deco-holder">
              <img v-if="sl.deco" class="deco" :src="sl.deco_src" />
              <img class="wyrmprint" :src="sl.src" />
            </a>
          </div>
        </div>
      </div>
      <div class="dib dps ml-4">
        <div class="factors dps mb-1">
          <div
            v-for="f of source.dps.filtered"
            :key="'fa' + f.name"
            class="dps factor"
            :class="'c-' + f.kind"
            :style="{ width: f.width + '%' }"
          ></div>
          <div class="full">
            <b>{{ source.dps.total }}</b>
          </div>
        </div>
        <div>
          <span v-for="s of source.stats" :key="'st' + s.icon" class="stats">
            <img class="stats-icon" :src="s.src" />
            <span class="stats-txt">{{ s.name }}</span>
          </span>
        </div>
      </div>
      <div class="mobile-comment">
        <div v-if="source.cond != ''">&lt;{{ source.cond }}&gt;</div>
        <span v-html="source.comment"></span>
      </div>
    </div>
  </li>
</template>
<script>
import { Vue } from "vue-property-decorator";
import { Adventurer } from "../model/adventurer";

export default {
  name: "adv-component-mobile",
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