<template>
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/readme' }"><i class="el-icon-edit"></i>首页</el-breadcrumb-item>
        <el-breadcrumb-item>公告管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row style="margin-top: 25px;">
        <el-col :span="24">
          <el-button type="primary" @click="show">新增</el-button>
        </el-col>
      </el-row>

      <el-table :data="tableData" style="width: 100%;margin-top: 25px">
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column  label="日期" min-width="50">
          <template slot-scope="scope">
            <span>{{scope.row.notice_data | getData}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="notice_title" label="公告标题" min-width="100">
        </el-table-column>
        <el-table-column prop="notice_content" label="公告内容" min-width="280">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--新增公告-->
      <el-dialog title="新增公告" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
          <el-form-item label="公告标题" prop="notice_title">
            <el-input v-model="addForm.notice_title" placeholder="请输入公告标题"></el-input>
          </el-form-item>
          <el-form-item label="公告内容" prop="notice_content">
            <el-input type="textarea" v-model="addForm.notice_content" placeholder="请输入公告内容"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="cancel">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" >提交</el-button>
        </div>
      </el-dialog>
      <!--新增公告结束-->

      <!--编辑公告开始-->
      <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
          <el-form-item label="公告标题" prop="notice_title">
            <el-input v-model="editForm.notice_title" placeholder="请输入菜品类别名称"></el-input>
          </el-form-item>
          <el-form-item label="公告内容" prop="notice_content">
            <el-input type="textarea" v-model="editForm.notice_content" placeholder="请输入菜品类别描述"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="cancel">取消</el-button>
          <el-button type="primary" @click.native="editSubmit" >提交</el-button>
        </div>
      </el-dialog>
      <!--编辑编辑结束-->
    </div>
</template>

<script>
  import axios from 'axios'
    export default {
        data() {
            return {
              tableData:[],
              addFormVisible:false,
              addForm:{
                notice_title:'',
                notice_content:''
              },
              addFormRules: {
                notice_title: [
                  { required: true, message: '请输入公告标题', trigger: 'blur' }
                ],
                notice_content: [
                  { required: true, message: '请输入公告内容', trigger: 'blur' }
                ]
              },
              editFormVisible:false,
              editForm:{
                notice_title:'',
                notice_content:''
              },
              editFormRules: {
                notice_title: [
                  { required: true, message: '请输入公告标题', trigger: 'blur' }
                ],
                notice_content: [
                  { required: true, message: '请输入公告内容', trigger: 'blur' }
                ]
              },
            }
        },
        methods: {
          getNotice(){
            axios.get('/api/user/notice')
              .then(response=>{
                this.tableData = response.data;
              }).catch(error=>{
              console.log(error);
            })
          },
          show() {
            this.addFormVisible = true;
          },
          cancel() {
            this.addFormVisible = false;
            this.editFormVisible = false;
            this.$message({
              message:'取消成功',
              type:'warning'
            })
          },
          //新增界面的确定按钮
          addSubmit(){
            this.$refs.addForm.validate((valid) => {
              if (valid){
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                  let para = Object.assign({}, this.addForm);
                  let name = JSON.parse(sessionStorage.getItem('user'))[0].userName;
                  para.notice_person = name;
                  console.log(para);
                  axios.post('/api/user/addnotice',para).then((response)=>{
                    if(response.data==1){
                      this.$message({
                        message: '提交成功',
                        type: 'success'
                      });
                      this.addFormVisible = false;
                      this.addForm.notice_title='';
                      this.addForm.notice_content='';
                      this.getNotice();
                    }
                  }).catch((error)=>{
                    console.log(error)
                  })
                })
              }
            })
          },
          // 删除公告信息
          handleDel: function (row) {
            this.$confirm('确认删除该记录吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              axios.get('/api/user/deletenotice',{
                params:{notice_id:row.notice_id}
              })
                .then(req=>{
                  if (req.data==1){
                    this.$message({
                      message: '删除成功',
                      type: 'success'
                    });
                    this.getNotice();
                  }
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
          //显示编辑界面
          handleEdit: function (index, row) {
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
          },
          //显示编辑界面的确定按钮
          editSubmit: function () {
            this.$refs.editForm.validate((valid) => {
              if (valid) {
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                  let para = Object.assign({}, this.editForm);
                  console.log(para);
                  axios.post('/api/user/updatenoticeone',para)
                    .then((response) => {
                      if(response.data==1){
                        this.$message({
                          message: '提交成功',
                          type: 'success'
                        });
                        this.editFormVisible = false;
                        this.getNotice();
                      }
                    }).catch((error)=>{
                    console.log(error);
                  })
                });
              }
            });
          },
        },
        computed: {},
        components: {},
        filters:{
          getData:function (val){
            var a = val.substring(0,10);
            var b = val.substring(11,13);
            var c =parseInt(b)+8;
            var d = val.substring(14,16);
            val = a+" "+c+":"+d;
            return val;
          }
        },
        created(){
          this.getNotice();
        }
    }
</script>
<style scoped>

</style>
