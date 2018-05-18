<template>
  <section>
    <div class="title" style="text-align: center;
    margin-bottom: 20px;"><h3>留言板信息管理</h3></div>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="昵称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getOneMessage">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--工具条结束-->
    <!--列表-->
    <!--messagesList.slice((page-1)*8,page*8)为分页展示的数组-->
    <el-table :data="showTableList" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column  label="日期" width="120" >
        <template slot-scope="scope">
          <span>{{scope.row.message_data | getData}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="message_name" label="昵称" width="120" sortable>
      </el-table-column>
      <el-table-column prop="message_title" label="主题" min-width="180" sortable>
      </el-table-column>
      <el-table-column prop="message_content" label="内容"  min-width="280" sortable>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--列表结束-->

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="8" :total="total" style="float:right;">
      </el-pagination>
    </el-col>
    <!--工具条结束-->

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="标题" prop="message_title">
          <el-input v-model="editForm.message_title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="message_content">
          <el-input type="textarea" v-model="editForm.message_content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
    <!--编辑界面结束-->
    <!--新增界面-->
    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="标题" prop="message_title">
          <el-input v-model="addForm.message_title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="message_content">
          <el-input type="textarea" v-model="addForm.message_content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit('addForm')" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import axios from 'axios';
    export default {
        data() {
            return {
              filters: {
                name: ''
              },
              listLoading: false,
              messagesList:[],
              addFormVisible: false,//新增界面是否显示
              sels:[],//列表选中列
              total:0,//分页最大
              page: 1,
              showTableList:[],
              addLoading:false,
              addFormRules: {
                message_title: [
                  { required: true, message: '请输入标题', trigger: 'blur' }
                ],
                message_content: [
                  { required: true, message: '请输入内容', trigger: 'blur' }
                ]
              },
              //编辑界面是否显示
              editFormVisible: false,
              editLoading: false,
              //编辑界面数据
              editForm: {
                message_title: '',
                message_content: '',
              },
              //编辑界面规则
              editFormRules: {
                message_title: [
                  { required: true, message: '请输入标题', trigger: 'blur' }
                ],
                message_content: [
                  { required: true, message: '请输入内容', trigger: 'blur' }
                ]
              },
              //新增界面数据
              addForm: {
                message_title: '',
                message_content: '',
              }
            }
        },
        methods: {
          //currentPage 改变时触发
          handleCurrentChange(val) {
            this.page = val;
            this.showTableList=this.messagesList.slice((this.page-1)*8,this.page*8);
          },
          getMessage(){
            this.listLoading = true;
            axios.get('/api/user/messages').then((response)=>{
                this.listLoading = false;
                this.messagesList= response.data;
                this.showTableList=this.messagesList.slice(0,8);
                this.total = this.messagesList.length;
            }).catch((error)=>{
              console.log(error)
            })
          },
          getOneMessage(){
            this.listLoading = true;
            if(this.filters.name==""){
              this.getMessage();
              this.listLoading = false;
            }else {
              axios.get('/api/user/selectOne',{
                params:{message_name:this.filters.name}
              }).then((response)=>{
                this.showTableList= response.data;
                this.total = this.showTableList.length;
                this.listLoading = false;
              }).catch((error)=>{
                console.log(error)
              })
            }
          },
          handleAdd:function () {
            this.addFormVisible = true;
            console.log(this.addFormVisible);
            this.addForm = {
              message_title: '',
              message_content: '',
            };
          },
          //显示编辑界面
          handleEdit: function (index, row) {
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
          },
          //编辑页面
          editSubmit: function () {
            this.$refs.editForm.validate((valid) => {
              if (valid) {
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                  this.editLoading = true;
                  let para = Object.assign({}, this.editForm);
                  console.log(para);
                  axios.post('/api/user/updateone',para)
                    .then((response) => {
                    this.editLoading = false;
                    this.$message({
                      message: '提交成功',
                      type: 'success'
                    });
                    this.editFormVisible = false;
                    this.getMessage();
                  }).catch((error)=>{
                    console.log(error);
                  })
                });
              }
            });
          },
          //删除
          handleDel: function (row) {
            this.$confirm('确认删除该记录吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.listLoading = true;
              // let para = { message_id: row.id };
              axios.get('/api/user/deleteone',{
                params:{message_id:row.message_id}
              })
            .then(req=>{
                this.listLoading = false;
                this.$message({
                      message: '删除成功',
                      type: 'success'
                    });
                this.getMessage();
              }).catch(error=>{
                console.log(error);
              })
            }).catch(()=>{
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            })
          },
          //新增
          addSubmit(formName){
            this.$refs[formName].validate((valid) => {
              if (valid){
                let message_name =JSON.parse(sessionStorage.getItem('user'))[0].userName;
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                  this.addLoading = true;
                  var data={
                    message_name:message_name,
                    message_title:this.addForm.message_title,
                    message_content:this.addForm.message_content,
                  };
                  axios.post('/api/user/messages',data).then((response)=>{
                    this.addLoading = false;
                    this.page=1;
                    this.$message({
                      message: '提交成功',
                      type: 'success'
                    });
                    this.addFormVisible = false;
                    this.getMessage();
                  }).catch((error)=>{
                    console.log(error)
                  })
                })
              }
            })
          },
          //列表选中列改变
          selsChange: function (sels) {
            this.sels = sels;
          },
          batchRemove:function(){
            var ids = this.sels.map(item => item.message_id).toString();
            this.$confirm('确认删除该多条记录吗?, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let para = { ids: ids };
              axios.post('/api/user/deleteall',para)
                .then(response=>{
                  if(response.data==1){
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    });
                    this.getMessage();
                  }
              }).catch(error=>{
                  console.log(error);
                })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            });
          },
        },
        computed: {},
        components: {},
        created(){
          this.getMessage();
        },
        filters:{
          getData:function (val){
            var a = val.substring(0,10);
            var b = val.substring(11,13);
            var c =parseInt(b)+8;
            var d = val.substring(14,16);
            val = a+" "+c+":"+d;
            return val;
          }
        }
    }
</script>
<style scoped>
</style>
