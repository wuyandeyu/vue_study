import axios from "axios"
import {Message} from "element-ui";
import router from '../router'


let base ="";
//封装请求,之后前端每次向后端发起请求时都是使用下面封装好的方法，传入对应的参数就好了
export const getRequest=(url,parms)=>{
    return axios({
        method:'get',
        url:`${base}${url}`,
        data:parms

    })
}

export const postRequest=(url,parms)=>{
    return axios({
        method:'post',
        url:`${base}${url}`,
        data:parms

    })
}

export const putRequest=(url,params)=>{
    return axios({
        method:'put',
        url:`${base}${url}`,
        data:params
    })
}

export const deleteRequest=(url,parms)=>{
    return axios({
        method:'delete',
        url:`${base}${url}`,
        data:parms

    })
}


//响应拦截器，后端返回所有响应都会被这个拦截器所拦截
axios.interceptors.response.use(success=> {
    if (success.status && success.status === 200) {
        if (success.data.code === 500 || success.status === 401 || success.data.code === 403) {
            Message.error({message: success.data.message});
            return;
        }
        if (success.data.message) {
            Message.success({message: success.data.message});
        }
    }
    return success.data;

},
    error => {
        if(error.response.code == 504 || error.response.code == 404){
            Message.error({message:"服务被吃了！！！！"});
        }else if(error.response.code == 403){
            Message.error({message:"权限不足，请联系管理员！"});
        }else if(error.response.code ==401){
            Message.error({message:"尚未登陆，请先登录！！"})
            router.replace('/');
        }else{
            if(error.response.data.message){
                Message.error({message:error.response.data.message});
            }else{
                Message.error({message:"未知错误！！！"})
            }
        }
        return;
    }
);
//请求拦截器
axios.interceptors.request.use(config=>{
    //如果token存在，则请求携带该token
    if(window.sessionStorage.getItem("tokenStr")){
        config.headers['Authorization'] = window.sessionStorage.getItem("tokenStr");
    }
    return config;
},error => {
    console.error(error);
})
