import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store"
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css'
import {postRequest} from "@/uitls/api"
import {putRequest} from "@/uitls/api"
import {getRequest} from "@/uitls/api"
import {deleteRequest} from "@/uitls/api"
import {initMenu} from "@/uitls/menus"


Vue.config.productionTip = false

Vue.use(ElementUi)
Vue.prototype.postRequest=postRequest; //避免每个组件都需导入对应的请求，所以采用采用插件的方式导入
Vue.prototype.putRequest=putRequest;
Vue.prototype.getRequest=getRequest;
Vue.prototype.deleteRequest=deleteRequest;

//路由跳转之前回调（前置守卫）beforeEach,afterEach全局守卫,还有路由独享守卫（当我们进入到某个路由里面的时候就可以单独写一个路由独享守卫）和组件内的守卫
router.beforeEach((to,from,next) => {
  if(window.sessionStorage.getItem("tokenStr")){
    initMenu(router,store);
    if(!window.sessionStorage.getItem("user")){
      return getRequest("/admin/info").then(resp=>{
        if(resp){
          window.sessionStorage.setItem('user',JSON.stringify(resp));
          next();
        }
      })
    }
    next();
  }else {
    if(to.path=="/"){
     next();
    }else{
      next("?/redirect="+to.path);
    }
  }
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
