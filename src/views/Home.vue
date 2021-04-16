<template>
    <div>
        <el-container>
            <el-header class="homeHeader">
                <div class="title">
                    通用办公系统
                </div>
                <el-dropdown class="userInfo" @command="handleCommand">
                    <span class="el-dropdown-link">
                        <span class="username">{{user.name}}</span><i><img :src="user.userFace"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="userinfo">个人中兴</el-dropdown-item>
                        <el-dropdown-item command="setting">设置</el-dropdown-item>
                        <el-dropdown-item command="logout">注销登录</el-dropdown-item>
                       <!-- <el-dropdown-item disabled>双皮奶</el-dropdown-item>
                        <el-dropdown-item divided>蚵仔煎</el-dropdown-item>-->
                    </el-dropdown-menu>
                </el-dropdown>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <!--默认展开   :default-openeds="['1','2']"-->
                    <!-- <el-menu @select="menuClick">选择点击事件-->
                    <el-menu router unique-opened>
                        <el-submenu :index="index+''" v-for="(item,index) in routes"
                                    :key="index"
                                   >
                            <span  v-if="!item.hidden"></span>
                            <template slot="title">
                                <i :class="item.iconCls" style="color: aqua;margin-right: 5px"></i>
                                <span>{{item.name}}</span>
                            </template>
                            <el-menu-item :index="children.path"
                                          v-for="(children,indexj) in item.children" :key="indexj">
                                {{children.name}}
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <el-breadcrumb separator-class="el-icon-arrow-right" v-if="$router.currentRoute.path!='/home'">
                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <div class="homeWelcome" v-if="this.$router.currentRoute.path=='/home'">
                        欢迎使用办公系统
                    </div>
                    <router-view class="homeRouterView"></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                user: JSON.parse(window.sessionStorage.getItem("user"))
            }
        },
        methods: {
            /* menuClick(index){
                 this.$router.push(index)
             }*/
            handleCommand(command) {

                if(command=="logout"){

                    this.$confirm('此操作将退出登录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.postRequest("/logout");
                        window.sessionStorage.removeItem("tokenStr");
                        window.sessionStorage.removeItem("user");
                        this.$router.replace("/");
                        this.$store.commit("initRoutes",[]);
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消退出操作'
                        });
                    });
                }
            }
        },
        computed: {// 数据需要经过如下操作后才能渲染到页面
            routes() {
                console.log(this.$store.state.routes)
                return this.$store.state.routes;
            }
        }
    }
</script>

<style>
    .homeHeader {
        background: #409eff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 15px;
        box-sizing: border-box;
    }

    .homeHeader .title {
        font-size: 30px;
        font-family: 华文楷体;
        color: white;
    }
   .homeHeader .userInfo{
        cursor:pointer;
    }
    .el-dropdown-link img{
        width: 48px;
        height: 48px;
        border-radius: 24px;
        margin-left: 8px;
    }
    .username{
        display: inline-block;

    }
    .homeWelcome{
        text-align: center;
        font-size: 30px;
        font-family: 华文楷体;
        color: #409eff;
        padding-top: 58px;
    }
    .homeRouterView{
        margin-top: 12px;
    }
</style>
