import {getRequest} from "@/uitls/api";


export const initMenu = (router,store)=>{
    if(store.state.routes.length>0){
        return;
    }
    getRequest("/system/cfg/menu").then(data=>{
        if(data){
            //格式化路由
            let fmtRoutes = formatRoutes(data);
            //添加路由
            router.addRoutes(fmtRoutes);
            //将数据存入到vuex中
            store.commit('initRoutes',fmtRoutes);
            //提交方式2,取值的时候test不在是单纯的test值而是一个对象，取值必须是test.属性，可以把test对象当作载荷payload
            /*store.commit({
                type:"",
                test
            })*/
        }
    })
}

export const formatRoutes =(routes)=>{
    let fmtRoutes = [];
    routes.forEach(router=>{
        let{path, component, name, iconCls, children} =router;
        if(children&& children instanceof  Array){
            children = formatRoutes(children);
        }
        let fmRouter ={path:path,name:name,iconCls:iconCls,children:children,
            component(resolve) {
                if(component.startsWith("Home")){
                    require(['../views/'+component+'.vue'], resolve);
                }else if (component.startsWith("Emp")) {
                    require(['../views/emp/'+component+'.vue'], resolve);
                } else if (component.startsWith("Per")) {
                    require(['../views/per/'+component+'.vue'], resolve);
                } else if (component.startsWith("Sal")) {
                    require(['../views/sal/'+component+'.vue'], resolve);
                } else if (component.startsWith("Sta")) {
                    require(['../views/sta/'+component+'.vue'], resolve);
                } else if (component.startsWith("Sys")) {
                    require(['../views/sys/'+component+'.vue'], resolve);
                }
            }
        }
        fmtRoutes.push(fmRouter);
    });
    return fmtRoutes;
}
