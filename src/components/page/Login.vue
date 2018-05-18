<template>
    <div class="login-wrap">
      <div class="ms-title">Tasty餐厅后台管理系统</div>
      <div class="ms-login">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
          <el-form-item prop="userName">
            <el-input v-model="ruleForm.userName" placeholder="请输入账号" ></el-input>
          </el-form-item>
          <el-form-item prop="userPw">
            <el-input type="password" placeholder="请输入密码" v-model="ruleForm.userPw" @keyup.enter.native="submitForm('ruleForm')"></el-input>
          </el-form-item>
          <div class="login-btn">
            <el-button type="primary" @click="submitForm('ruleForm')" :loading="logining">登录</el-button>
          </div>
        </el-form>
      </div>
    </div>
</template>

<script>
  import axios from 'axios';
    export default {
        data() {
            return {
              logining: false,
              ruleForm: {
                userName: '',
                userPw:''
              },
              rules: {
                userName: [
                  { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                userPw: [
                  { required: true, message: '请输入密码', trigger: 'blur' }
                ]
              }
            }
        },
        methods: {
          submitForm(formName){
            const self = this;
            self.$refs[formName].validate((valid) => {
              if(valid) {
                this.logining = true;
                // localStorage.setItem('ms_username',self.ruleForm.userName);
                // localStorage.setItem('ms_user',JSON.stringify(self.ruleForm));
                var data={
                  userName:self.ruleForm.userName,
                  userPw:self.ruleForm.userPw,
                };
                axios.post('/api/user/login',data)
                  .then((response) => {
                    this.logining = false;
                  if (response.data == -1) {
                    this.$message({
                      message: '该用户不存在(⊙o⊙)',
                      type: 'warning'
                    });
                  } else if (response.data == 0) {
                    this.$message({
                      message: '密码错误(⊙o⊙)',
                      type: 'warning'
                    });
                  } else if (response.status == 200) {
                    this.$message({
                      type: 'success',
                      message: '登陆成功!'
                    });
                    sessionStorage.setItem('user', JSON.stringify(response.data));
                    var a =JSON.parse(sessionStorage.getItem('user'))[0].userName;
                    console.log(a);
                    self.$router.push('/readme');
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                });
                } else{
                console.log('error submit!!!');
                return false;
              }
            });
          },
        },
        computed: {},
        components: {}
    }
</script>
<style scoped>
  .login-wrap{
    position: relative;
    width:100%;
    height:100%;
    background: url("../../../static/img/background.jpg") no-repeat;
    background-size:100% ;
  }
  .ms-title{
    position: absolute;
    top:50%;
    width:100%;
    margin-top: -230px;
    text-align: center;
    font-size:30px;
    color: #fff;
  }
  .ms-login{
    position: absolute;
    left:50%;
    top:50%;
    width:300px;
    height:200px;
    margin:-150px 0 0 -190px;
    padding:40px;
    border-radius: 5px;
    background: #fff;

  }
  .login-btn{
    margin-top: 35px;
    text-align: center;
  }
  .login-btn button{
    width:100%;
    height:36px;
  }
</style>
