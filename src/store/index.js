import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
    state:{
        routes:[]
    },
    mutations:{
        initRoutes(state,data){
            state.routes = data;
        }
    },
    actions:{
        test(context){
            setTimeout(()=>{
                context.commit("");
            },1000)
        }
    },
    getters:{

    },
    modules:{
        a:{
            state:{

            },
            mutations:{

            }
        },
        b:{
            state:{

            },
            mutations:{

            }
        }
    }
})