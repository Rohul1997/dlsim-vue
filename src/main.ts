import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'vue-popperjs/dist/vue-popper.css';
import VueGtag from 'vue-gtag';

// <!-- Global site tag (gtag.js) - Google Analytics -->
// <script async src="https://www.googletagmanager.com/gtag/js?id=UA-159918955-1"></script>
// <script>
//     window.dataLayer = window.dataLayer || [];
//     function gtag() { dataLayer.push(arguments); }
//     gtag('js', new Date());

//     gtag('config', 'UA-159918955-1');
// </script>

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(VueGtag, {
  config: { id: 'UA-159918955-1' },
});
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
