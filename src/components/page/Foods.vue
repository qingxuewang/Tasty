<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{ path: '/readme' }"><i class="el-icon-edit"></i>首页</el-breadcrumb-item>
      <el-breadcrumb-item>美食管理</el-breadcrumb-item>
      <el-breadcrumb-item>菜品管理</el-breadcrumb-item>
    </el-breadcrumb>


    <el-table :data="tableData" style="width: 100%" v-loading="listLoading" :default-sort = "{prop: 'catelog_id', order: 'ascending'}">
      <el-table-column prop="catelog_id" label="类别名称" width="120" sortable>
      </el-table-column>
      <el-table-column prop="foods_name" label="菜品名称" min-width="100">
      </el-table-column>
      <el-table-column prop="foods_des" label="菜品描述" min-width="180">
      </el-table-column>
      <el-table-column label="菜品图片" width="120">
        <template slot-scope="scope">
          <img :src=scope.row.foods_img style="width:80px">
        </template>
      </el-table-column>
      <el-table-column prop="foods_price" label="菜品价格" width="120">
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--编辑界面结束-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="菜品名称" prop="foods_name">
          <el-input v-model="editForm.foods_name" placeholder="请输入菜品名称"></el-input>
        </el-form-item>
        <el-form-item label="菜品描述" prop="foods_des">
          <el-input type="textarea" v-model="editForm.foods_des" placeholder="请输入菜品描述"></el-input>
        </el-form-item>
        <el-form-item label="菜品图片" prop="foods_img">
          <el-input v-model="editForm.foods_img" placeholder="请输入菜品图片地址"></el-input>
        </el-form-item>
        <el-form-item label="菜品价格" prop="foods_price">
          <el-input v-model="editForm.foods_price" placeholder="请输入菜品价格"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancel">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
    <!--编辑界面结束-->
  </div>
</template>

<script>
    import axios from 'axios'
    export default {
        data() {
            return {
              tableData:[],
              listLoading: false,
              //编辑界面是否显示
              editFormVisible: false,
              editLoading: false,
              //编辑界面数据
              editForm: {
                foods_name: '',
                foods_des: '',
                foods_img:'',
                foods_price:'',
              },
              //编辑界面规则
              editFormRules: {
                foods_name: [
                  { required: true, message: '请输入菜品名称', trigger: 'blur' }
                ],
                foods_des: [
                  { required: true, message: '请输入菜品描述', trigger: 'blur' }
                ],
                foods_img: [
                  { required: true, message: '请输入菜品图片地址', trigger: 'blur' }
                ],
                foods_price: [
                  { required: true, message: '请输入菜品价格', trigger: 'blur' }
                ]
              },
            }
        },
        methods: {
          getFoods(){
            this.listLoading = true;
            axios.get('/api/user/foods')
              .then(response=>{
                this.listLoading = false;
                this.tableData = response.data;
              }).catch(error=>{
              console.log(error);
            })
          },
          //显示编辑界面
          handleEdit: function (index, row) {
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
          },
          //显示编辑界面的取消按钮
          cancel:function () {
            this.editFormVisible = false;
            this.$message({
              message:'取消编辑成功',
              type:'warning'
            })
          },
          //显示编辑界面的确定按钮
          editSubmit: function () {
            this.$refs.editForm.validate((valid) => {
              if (valid) {
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                  this.editLoading = true;
                  let para = Object.assign({}, this.editForm);
                  console.log(para);
                  axios.post('/api/user/updatefoodone',para)
                    .then((response) => {
                      if(response.data==1){
                        this.$message({
                          message: '提交成功',
                          type: 'success'
                        });
                        this.editLoading = false;
                        this.editFormVisible = false;
                        this.getFoods();
                      }
                    }).catch((error)=>{
                    console.log(error);
                  })
                });
              }
            });
          },
        // 删除食品信息
          handleDel: function (row) {
            this.$confirm('确认删除该记录吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.listLoading = true;
              axios.get('/api/user/deletefoodone',{
                params:{foods_id:row.foods_id}
              })
                .then(req=>{
                  if (req.data==1){
                    this.listLoading = false;
                    this.$message({
                      message: '删除成功',
                      type: 'success'
                    });
                    this.getFoods();
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
        },
        computed: {},
        components: {},
        created(){
          this.getFoods();
        }
    }
</script>
<style scoped>

</style>
