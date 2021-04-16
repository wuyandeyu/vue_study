<template>
    <div>
        <div>
            <el-input
                    size="small"
                    class="addPosInput"
                    placeholder="添加职位"
                    suffix-icon="el-icon-plus"
                    v-model="pos.name"
                    @keydown.enter.native="handleAdd">
            </el-input>
            <el-button size="small" icon="el-icon-plus" type="primary" @click="handleAdd">添加</el-button>
            <template>
                <el-table
                        class="postman"
                        size="small"
                        :data="positions"
                        border
                        style="width: 70%"
                        @selection-change="handleSelectionChange">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            prop="id"
                            label="编号"
                            width="55"
                            align="center"
                            header-align="center">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="职位"
                            width="120"
                            align="center"
                            header-align="center">
                    </el-table-column>
                    <el-table-column
                            prop="createDate"
                            label="创建时间"
                            with="100"
                            align="center"
                            header-align="center">
                    </el-table-column>
                    <el-table-column
                            prop="enabled"
                            label="是否启用"
                            with="50"
                            align="center"
                            header-align="center">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.enabled" type="success">已启用</el-tag>
                            <el-tag v-else type="danger">未启用</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            with="50"
                            align="center"
                            header-align="center">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    @click="showEidt(scope.$index,scope.row)">编辑</el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="handleDelete(scope.$index,scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button size="small" style="margin-top: 8px" type="danger" :disabled="this.multipleSelection.length===0" @click="deleteMany" >批量删除</el-button>
                <el-dialog
                        title="编辑职位"
                        :visible.sync="dialogVisible"
                        width="30%"
                        :before-close="handleClose">
                    <div>
                        <el-tag size="small">职位名称</el-tag>
                        <el-input v-model="updatePos.name" size="small" class="updatePositionName"></el-input>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                        <el-button size="small" type="primary" @click="update">确 定</el-button>
                    </span>
                </el-dialog>
            </template>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PostMana",
        data(){
            return{
                pos:{
                    name:""
                },
                positions: [

                ],
                dialogVisible:false,
                updatePos:{
                    name:""
                },
                multipleSelection: []
            }
        },
        mounted(){
            //初始化需要加载的数据我们一般放在mounted()函数中
            this.initPostions();
        },
        methods:{
            initPostions(){
                this.getRequest("/system/basic/pos/").then(resp=>{
                    if(resp){
                        this.positions = resp;
                    }
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleClose(){

            },
            deleteMany(){
                this.$confirm('此操作将永久删除'+[this.multipleSelection.length]+'条职位, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = '?';
                    this.multipleSelection.forEach(item=>{
                        ids+='ids='+item.id+'&';
                    })
                    this.deleteRequest("/system/basic/pos/"+ids).then(resp=>{
                        if(resp){
                            this.initPostions();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            showEidt(index,data){
                //this.updatePos = data;
                Object.assign(this.updatePos,data);
                this.updatePos.createDate ="";
                this.dialogVisible = true;
            },
            update(){
                this.putRequest("/system/basic/pos/",this.updatePos).then(resp=>{
                    if(resp){
                        this.initPostions();
                        this.dialogVisible = false;
                    }
                })
            },
            handleDelete(index,data){
                this.$confirm('此操作将永久删除'+[data.name]+'文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/pos/"+data.id).then(resp=>{
                        if(resp){
                            this.initPostions();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
            ,
            handleAdd(){
                if(this.pos.name){
                    this.postRequest("/system/basic/pos/",this.pos).then(resp=>{
                        if(resp){
                            this.initPostions();
                            this.pos.name=null;
                        }
                    })
                }else{
                    this.$message.error("职位名称不能为空")
                }
            }
        }
    }
</script>

<style scoped>
    .addPosInput{
        width: 300px;
        margin-right: 8px;
    }
    .postman{
        margin-top: 10px;
    }
    .updatePositionName{
        margin-left: 10px;
        width: 200px;
    }

</style>