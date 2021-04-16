import Vue from "vue";
import VueRouter from "vue-router"
import Login from "../views/Login"

Vue.use(VueRouter)
//这routes不能名其他名
const routes = [
    {
        path:"/",
        name:"Login",
        component:Login,
        hidden:true
    }
];

const router = new VueRouter({
    routes
});
export default router;