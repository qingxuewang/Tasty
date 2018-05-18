<template>
  <div class="sidebar">
    <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" background-color="#eef1f6" text-color="#000" active-text-color="#20a0ff" theme="dark" unique-opened router>
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index">
            <template slot="title"><i :class="item.icon"></i>{{ item.title }}</template>
            <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">{{ subItem.title }}
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index">
            <i :class="item.icon"></i>{{ item.title }}
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        items: [
          {
            icon: 'el-icon-setting',
            index: 'readme',
            title: '系统简介'
          },
          {
            icon: 'el-icon-setting',
            index: 'messages',
            title: '留言板管理'
          },
          {
            icon: 'el-icon-setting',
            index: 'notice',
            title: '公告管理'
          },
          {
            icon: 'el-icon-setting',
            index: 'userCenter',
            title: '美食管理',
            subs: [
              {
                index: 'category',
                title: '菜品类别管理'
              },
              {
                index: 'foods',
                title: '菜品管理'
              },
              {
                index: 'addfood',
                title: '菜品添加'
              }
            ]
          },
          {
            icon: 'el-icon-setting',
            index: 'members',
            title: '会员管理'
          },
          {
            icon: 'el-icon-setting',
            index: 'orders',
            title: '订单管理'
          },
          {
            icon: 'el-icon-setting',
            index: 'modifyPassword',
            title: '管理员修改密码'
          }
        ]
      }
    },
    computed:{
      onRoutes(){
        return this.$route.path.replace('/','');
      }
    }
  }
</script>

<style scoped>
  .sidebar{
    display: block;
    position: absolute;
    width: 250px;
    left: 0;
    top: 70px;
    bottom:0;
    background: #2E363F;
  }
  .sidebar > ul {
    height:100%;
  }
</style>
