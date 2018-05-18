<template>
    <div>
      <el-breadcrumb separator="/" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{ path: '/readme' }"><i class="el-icon-edit"></i>首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>

      <el-table :data="tableData" style="width: 100%;margin-top: 25px" >
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column  label="日期" min-width="80">
          <template slot-scope="scope" >
            <span>{{scope.row.order_date | getData}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号" min-width="50">
        </el-table-column>
        <el-table-column prop="order_user" label="用户ID" min-width="50">
        </el-table-column>
        <el-table-column prop="order_price" label="金额" min-width="50">
        </el-table-column>
        <el-table-column prop="order_context" label="订单内容" min-width="220">
        </el-table-column>
        <el-table-column prop="order_tel" label="联系电话" min-width="80">
        </el-table-column>
        <el-table-column prop="order_address" label="送货地址" min-width="80">
        </el-table-column>
        <el-table-column prop="order_state" label="订单是否付款" min-width="80">
          <template slot-scope="scope">
            <span>{{scope.row.order_pay | getpay}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="order_state" label="订单状态" min-width="50">
          <template slot-scope="scope">
            <span>{{scope.row.order_state | getstate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.row)" v-if="!(scope.row.order_pay&&scope.row.order_state)">确认配送</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
  import axios from 'axios'
    export default {
        data() {
            return {
              tableData:[],
            }
        },
        methods: {
          getOrder(){
            axios.get('/api/user/order')
              .then(response=>{
                this.tableData = response.data.reverse();
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
              axios.get('/api/user/deleteorder',{
                params:{order_id:row.order_id}
              })
                .then(req=>{
                  this.$message({
                    message: '删除成功',
                    type: 'success'
                  });
                  this.getOrder();
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
          //确认配送按钮
          handleEdit: function (row) {
            if (row.order_pay===0){
              this.$message({
                type: 'warning',
                message: '用户未付款'
              });
            }else {
            this.$confirm('确认配送该记录吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                axios.get('/api/user/updateorder',{
                      params:{order_id:row.order_id}
                    }).then(req=>{
                        this.$message({
                          message: '确认配送成功',
                          type: 'success'
                        });
                        this.getOrder();
                      }).catch(error=>{
                      console.log(error);
                    })
            }).catch(()=>{
              this.$message({
                type: 'info',
                message: '取消配送'
              });
            })
          }
          }
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
          },
          getpay:function (val) {
            return val == 1 ? '已付款' : val ==0 ?'未付款' : '未知';
          },
          getstate:function (val) {
            return val == 1 ? '已配送' : val ==0 ?'未配送' : '未知';
          }
        },
        created(){
          this.getOrder()
        }
    }
</script>
<style scoped>

</style>
