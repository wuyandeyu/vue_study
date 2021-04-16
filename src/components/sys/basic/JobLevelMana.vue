<template>
    <div>
      <div>
          <el-input size="small" v-model="jl.name" placeholder="请添加职称名称" prefix-icon="el-icon-plus" style="width: 300px" @keydown.enter.native="handleAdd"></el-input>
          <el-select size="small" v-model="jl.titleLevel" placeholder="职称等级" style="margin-left: 6px;margin-right: 6px;">
              <el-option
                      v-for="item in titleLevels"
                      :key="item"
                      :label="item"
                      :value="item">
              </el-option>
          </el-select>
          <el-button size="small" type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
      </div>
      <div style="margin-top: 10px;">
          <el-table
                  :data="jsl"
                  size="small"
                  border
                  style="width: 100%"
                  @selection-change="handleSelectionChange">
              <el-table-column
                      type="selection"
                      width="55">
              </el-table-column>
              <el-table-column
                      prop="id"
                      label="编号"
                      width="180"
                      align="center"
                      header-align="center">
              </el-table-column>
              <el-table-column
                      prop="name"
                      label="职称"
                      width="180"
                      align="center"
                      header-align="center">
              </el-table-column>
              <el-table-column
                      prop="titleLevel"
                      label="级别"
                      width="180"
                      align="center"
                      header-align="center">
              </el-table-column>
              <el-table-column
                      prop="createDate"
                      label="时间"
                      align="center"
                      header-align="center">
              </el-table-column>
              <el-table-column
                      prop="enabled"
                      label="是否启用"
                      align="center"
                      header-align="center">
                  <template slot-scope="scope">
                      <el-tag v-if="scope.row.enabled" type="success">已启用</el-tag>
                      <el-tag v-else type="danger">未启用</el-tag>
                  </template>
              </el-table-column>
              <el-table-column label="操作"
                               align="center"
                               header-align="center">
                  <template slot-scope="scope">
                      <el-button
                              size="mini"
                              @click="showEditView(scope.$index, scope.row)">编辑</el-button>
                      <el-button
                              size="mini"
                              type="danger"
                              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                  </template>
              </el-table-column>
          </el-table>
          <el-button size="small" style="margin-top: 8px" type="danger" :disabled="this.multipleSelection.length===0" @click="deleteMany" >批量删除</el-button>
      </div>
        <el-dialog
                title="编辑职称"
                :visible.sync="dialogVisible"
                width="30%">
            <table>
                <tr>
                    <td>
                        <el-tag>职称名称</el-tag>
                    </td>
                    <td>
                        <el-input size="small" v-model="updatejl.name"  placeholder="职称名称" prefix-icon="el-icon-plus" style="margin-left: 6px"></el-input>
                    </td>
                </tr>
                <tr>
                    <td>
                        <el-tag>职称级别</el-tag>
                    </td>
                    <td>
                        <el-select  size="small" v-model="updatejl.titleLevel" placeholder="职称等级" style="margin-left: 6px;margin-right: 6px;">
                            <el-option
                                    v-for="item in titleLevels"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <td>
                        <el-tag>是否启用</el-tag>
                    </td>
                    <td>
                        <el-switch
                                style="display: block;margin-left: 6px;"
                                v-model="updatejl.enabled"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                active-text="已启用"
                                inactive-text="未启用">
                        </el-switch>
                    </td>
                </tr>
            </table>
            <span slot="footer" class="dialog-footer">
                        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                        <el-button size="small" type="primary" @click="handleEdit">确 定</el-button>
                    </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "JobLevelMana",
        data(){
            return{
                jl:{
                    name:'',
                    titleLevel:'',
                    enabled: ''
                },
                updatejl:{
                    name:'',
                    titleLevel:'',
                    enabled: ''

                },
                titleLevels:[
                    "正高级",
                    "副高级",
                    "中级",
                    "初级",
                    "员级"
                ],
                multipleSelection: [],
                jsl:[],
                dialogVisible:false
            }
        },
        mounted(){
            this.initJls();
        },
        methods:{
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleAdd(){
                if(this.jl.name && this.jl.titleLevel) {
                    this.postRequest("/system/basic/joblevel/", this.jl).then(resp=>{
                        if (resp) {
                            this.initJls();
                            this.jl.name =null;
                            this.$message.success("添加职称成功")
                        }
                    })
                }else {
                    this.$message.error("添加的职称不能为空")
                }
            },
            initJls(){
                this.getRequest("/system/basic/joblevel/").then(resp=>{
                    if(resp){
                        this.jsl = resp;
                    }
                })
            },
            showEditView(index,data){
                Object.assign(this.updatejl,data);
                this.updatejl.createDate ="";
                this.dialogVisible=true;
            },
            handleEdit(){
                this.putRequest("/system/basic/joblevel/",this.updatejl).then(resp=>{
                    if(resp){
                        this.initJls();
                        this.dialogVisible=false;
                    }
                })
            },
            handleDelete(index,data){
                this.deleteRequest("/system/basic/joblevel/"+data.id).then(resp =>{
                    if(resp){
                        this.initJls();
                    }
                })
            },
            deleteMany(){
                this.$confirm('此操作将永久删除'+[this.multipleSelection.length]+'条职称, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = '?';
                    this.multipleSelection.forEach(item=>{
                        ids+='ids='+item.id+'&';
                    })
                    this.deleteRequest("/system/basic/joblevel/"+ids).then(resp=>{
                        if(resp){
                            this.initJls();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
    }
</script>

<style scoped>

</style>