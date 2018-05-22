<template>
    <div>
      <el-breadcrumb separator="/" style="margin-bottom: 30px">
        <el-breadcrumb-item :to="{ path: '/readme' }"><i class="el-icon-edit"></i>首页</el-breadcrumb-item>
        <el-breadcrumb-item>美食管理</el-breadcrumb-item>
        <el-breadcrumb-item>菜品添加</el-breadcrumb-item>
      </el-breadcrumb>
      <el-form :model="ruleForm" label-width="150px" :rules="rules" ref="ruleForm">
        <el-form-item label="菜品名称" prop="foods_name">
          <el-input v-model="ruleForm.foods_name" placeholder="请输入菜品名称" style="width: 218px"></el-input>
        </el-form-item>
        <el-form-item label="菜品类别" prop="region">
          <el-select v-model="ruleForm.value" clearable placeholder="菜品类别">
            <el-option v-for="item in ruleForm.region" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜品描述" prop="foods_des">
          <el-input type="textarea" v-model="ruleForm.foods_des" placeholder="请输入菜品描述"></el-input>
        </el-form-item>
        <el-form-item label="菜品图片" prop="foods_img">
          <el-input v-model="ruleForm.foods_img" placeholder="请输入菜品图片地址"></el-input>
        </el-form-item>
        <el-form-item label="菜品价格" prop="foods_price">
          <el-input v-model.number="ruleForm.foods_price" placeholder="请输入菜品价格"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSubmit('ruleForm')">立即添加</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        data() {
            return {
              regionData:[],
              ruleForm:{
                foods_name:'',
                region:[],
                value:'',
                foods_des:'',
                foods_img:'',
                foods_price:'',
              },
              rules:{
                foods_name: [
                  { required: true, message: '请输入菜品名称', trigger: 'blur' },
                ],
                foods_des: [
                  { required: true, message: '请输入菜品名称', trigger: 'blur' },
                ],
                foods_img: [
                  { required: true, message: '请输入菜品图片地址', trigger: 'blur' },
                ],
                foods_price: [
                  { required: true, message: '请输入菜品价格', trigger: 'blur' },
                ],
                region: [
                  { required: true, message: '请选择菜品类别', trigger: 'change' },
                ],
              },
            }
        },
        methods: {
          resetForm(){
              this.$message('表单重置成功');
              this.ruleForm.foods_name='';
              this.ruleForm.foods_des='';
              this.ruleForm.foods_img='';
              this.ruleForm.foods_price='';
          },
          getRegionData(){
            axios.get('/api/user/category')
              .then(response=>{
                this.regionData= response.data.map(item=>{
                  var obj={};
                  obj.value = item.catelog_id;
                  obj.label = item.catelog_name;
                  return obj;
                });
                this.ruleForm.region=this.regionData;
              }).catch(error=>{
              console.log(error);
            })
          },
          //新增菜品
          addSubmit(formName){
            this.$refs[formName].validate((valid) => {
              if (valid){
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                  var data={
                    catelog_id:this.ruleForm.value,
                    foods_name:this.ruleForm.foods_name,
                    foods_des:this.ruleForm.foods_des,
                    foods_img:this.ruleForm.foods_img,
                    foods_price:this.ruleForm.foods_price,
                  };
                  axios.post('/api/user/addfood',data).then((response)=>{
                    if (response=1) {
                      this.$message({
                        message: '提交成功',
                        type: 'success'
                      });
                      this.ruleForm.foods_name='';
                      this.ruleForm.foods_des='';
                      this.ruleForm.foods_img='';
                      this.ruleForm.foods_price='';
                    }
                  }).catch((error)=>{
                    console.log(error)
                  })
                })
              }
            })
          },
        },
        computed: {},
        components: {},
        created(){
          this.getRegionData();
        }
    }
</script>
<style scoped>

</style>
