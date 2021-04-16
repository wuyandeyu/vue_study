
let proxyObj={}

proxyObj['/']={
    ws:false,
    target:'http://localhost:8081',
    changeOrigin:true,
    //不重写请求地址
    pathRewrite:{
        '^/':'/'
    }
}




module.exports={
    devServer:{
        host:'localhost',
        port:8080,
        proxy:proxyObj
    }
}