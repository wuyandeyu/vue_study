<template>
    <div>
        <div class="permiss">
            <el-input placeholder="请输入角色" v-model="role.name">
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input placeholder="请输入角色" v-model="role.namezh"></el-input>
           <el-button type="primary" icon="el-icon-plus">添加角色</el-button>
        </div>
        <div class="promissmain">
            <el-collapse  accordion>
                <el-collapse-item :title="r.namezh" :name="r.id" v-for="(r,index) in roles" :key="index">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>可访问资源</span>
                            <el-button style="float: right; padding: 3px 0" type="danger" icon="el-icon-delete"></el-button>
                        </div>
                        <div>
                            <el-tree :data="allMenus" :props="defaultProps"></el-tree>
                        </div>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PermissMana",
        data(){
            return{
                role:{
                    name:"",
                    namezh:''
                },
                roles:[],
                allMenus:[],
                defaultProps:{
                    label:"name",
                    children:"children"
                }
            }
        },
        mounted(){
            this.initRoles();
        },
        methods:{
            initRoles(){
                this.getRequest('system/basic/role/').then(resp=>{
                    if(resp){
                        this.roles=resp;
                    }
                })

            },

        }
    }
</script>

<style scoped>
    .permiss{
        display: flex;
        justify-content: flex-start;
    }
    .permiss .el-input{
       width: 300px;
        margin-right: 6px;
    }
    .promissmain{
        margin-top: 10px;
        width: 700px;
    }
</style>