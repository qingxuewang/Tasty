<template>
    <div>
      <el-breadcrumb separator="/" style="margin-bottom: 10px">
        <el-breadcrumb-item :to="{ path: '/readme' }"><i class="el-icon-edit"></i>首页</el-breadcrumb-item>
        <el-breadcrumb-item>美食管理</el-breadcrumb-item>
        <el-breadcrumb-item>菜品类别管理</el-breadcrumb-item>
      </el-breadcrumb>

      <el-row>
        <el-col :span="24">
            <el-button type="primary" @click="show">新增</el-button>
        </el-col>
      </el-row>

      <el-table :data="tableData" style="width: 100%" :default-sort = "{prop: 'catelog_id', order: 'ascending'}">
        <el-table-column prop="catelog_id" label="类别编号" width="120" sortable>
        </el-table-column>
        <el-table-column prop="catelog_name" label="类别名称" min-width="100">
        </el-table-column>
        <el-table-column prop="catelog_des" label="类别描述" min-width="180">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--新增菜品类别-->
      <el-dialog title="新增菜品类别" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
          <el-form-item label="类别名称" prop="catelog_name">
            <el-input v-model="addForm.catelog_name" placeholder="请输入菜品类别名称"></el-input>
          </el-form-item>
          <el-form-item label="类别描述" prop="catelog_des">
            <el-input type="textarea" v-model="addForm.catelog_des" placeholder="请输入菜品类别描述"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="cancel">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" >提交</el-button>
        </div>
      </el-dialog>
      <!--新增菜品类别结束-->

      <!--编辑菜品类别-->
      <el-dialog title="新增菜品类别" :visible.sync="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
          <el-form-item label="类别名称" prop="catelog_name">
            <el-input v-model="editForm.catelog_name" placeholder="请输入菜品类别名称"></el-input>
          </el-form-item>
          <el-form-item label="类别描述" prop="catelog_des">
            <el-input type="textarea" v-model="editForm.catelog_des" placeholder="请输入菜品类别描述"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="cancel">取消</el-button>
          <el-button type="primary" @click.native="editSubmit" >提交</el-button>
        </div>
      </el-dialog>
      <!--编辑菜品类别结束-->
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        data() {
            var validateName = (rule, value, callback) => {
              if (value === '') {
                return callback(new Error('请输入菜品类别名称'));
              }
              setTimeout(()=>{
                if (this.tableData.some(item=>{
                      return item.catelog_name == value;
                  })){
                  callback(new Error('输入菜品类别名称已存在'));
                }else {
                  callback();
                }
              },500);
            };

            return {
              tableData:[],
              addFormVisible:false,
              addForm:{
                catelog_name:'',
                catelog_des:''
              },
              //新增菜品类别界面规则
              addFormRules: {
                catelog_name: [
                  { validator: validateName, trigger: 'blur' }
                ],
                catelog_des: [
                  { required: true, message: '请输入菜品类别描述', trigger: 'blur' }
                ]
              },

              editFormVisible:false,
              editForm:{
                catelog_name:'',
                catelog_des:''
              },
              editFormRules: {
                catelog_name: [
                  { required: true, message: '请输入菜品类别名称', trigger: 'blur' }
                ],
                catelog_des: [
                  { required: true, message: '请输入菜品类别描述', trigger: 'blur' }
                ]
              },
            };
        },
        methods: {
          getCategory(){
            axios.get('/api/user/category')
              .then(response=>{
                this.tableData = response.data;
              }).catch(error=>{
              console.log(error);
            })
          },
          show() {
            this.addFormVisible = true;
          },
          //显示新增菜品类别界面的取消按钮
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
                  console.log(para);
                  axios.post('/api/user/addcategory',para).then((response)=>{
                    if(response.data==1){
                      this.$message({
                        message: '提交成功',
                        type: 'success'
                      });
                      this.addFormVisible = false;
                      this.getCategory();
                    }
                  }).catch((error)=>{
                    console.log(error)
                  })

                })
              }
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
                  axios.post('/api/user/updatecategoryone',para)
                    .then((response) => {
                      if(response.data==1){
                        this.$message({
                          message: '提交成功',
                          type: 'success'
                        });
                        this.editFormVisible = false;
                        this.getCategory();
                      }
                    }).catch((error)=>{
                    console.log(error);
                  })
                });
              }
            });
          },
          // 删除菜品类别信息
          handleDel: function (row) {
            this.$confirm('确认删除该记录吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.listLoading = true;
              axios.get('/api/user/deletecategoryone',{
                params:{catelog_id:row.catelog_id}
              })
                .then(req=>{
                  if (req.data==1){
                    this.$message({
                      message: '删除成功',
                      type: 'success'
                    });
                    this.getCategory();
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
          this.getCategory();
        }
    }
</script>
<style scoped>

</style>
