<template>
    <div>
      <el-breadcrumb separator="/" style="margin-bottom: 30px">
        <el-breadcrumb-item :to="{ path: '/readme' }"><i class="el-icon-edit"></i>首页</el-breadcrumb-item>
        <el-breadcrumb-item>会员管理</el-breadcrumb-item>
      </el-breadcrumb>
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="会员用户名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getOneMessage">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!--工具条结束-->
      <!--列表-->
      <el-table :data="showTableList" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column prop="user_name" label="用户名" width="120" sortable>
        </el-table-column>
        <el-table-column  label="性别" width="120" >
          <template slot-scope="scope">
            <span>{{scope.row.user_sex | formatSex}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="user_birth" label="生日"  width="120">
        </el-table-column>
        <el-table-column prop="user_tel" label="联系电话"  width="200">
        </el-table-column>
        <el-table-column prop="user_address" label="地址"  min-width="280">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--结束-->
      <!--工具条开始-->
      <el-col :span="24" class="toolbar" style="margin-top: 20px">
        <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
        </el-pagination>
      </el-col>
      <!--工具条结束-->
    </div>
</template>

<script>
  import axios from 'axios';
    export default {
        data() {
            return {
              filters: {
                name: ''
              },
              listLoading:false,
              showTableList:[],
              sels:[]
            }
        },
        methods: {
          //性别显示转换
          formatSex: function (row, column) {
            return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
          },
          getMembers(){
            this.listLoading = true;
            axios.get('/api/user/member')
              .then(response=>{
                this.listLoading = false;
                this.showTableList = response.data;
              }).catch(error=>{
              console.log(error);
            })
          },
          //删除
          handleDel: function (row) {
            this.$confirm('确认删除该记录吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.listLoading = true;
              axios.get('/api/user/deletememberone',{
                params:{user_id:row.user_id}
              })
                .then(req=>{
                  this.listLoading = false;
                  this.$message({
                    message: '删除成功',
                    type: 'success'
                  });
                  this.getMembers();
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
          selsChange: function (sels) {
            this.sels = sels;
          },
          batchRemove:function(){
            var user_id = this.sels.map(item => item.user_id);
            this.$confirm('确认删除该多条记录吗?, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let para = { user_id: user_id };
              axios.post('/api/user/deletememberall',para)
                .then(response=>{
                  if(response.data==1){
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    });
                    this.getMembers();
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
          getOneMessage(){
            this.listLoading = true;
            if(this.filters.name===''){
              this.getMembers();
            }else{
              axios.get('/api/user/selectmemberone',{
                params:{user_name:this.filters.name}
              }).then((response)=>{
                this.showTableList= response.data;
                this.listLoading = false;
              }).catch((error)=>{
                console.log(error)
              })
            }
          },
        },
        computed: {},
        components: {},
        created(){
          this.getMembers();
        },
        filters:{
          formatSex: function (val) {
            return val == 1 ? '男' : val == 0 ? '女' : '未知';
          },
        }
    }
</script>
<style scoped>

</style>
