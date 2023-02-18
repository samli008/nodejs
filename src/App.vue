<template>
  <div id="app">
    <el-container style="height: 100vh; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
          <el-menu router :default-openeds="open_list">
            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-tickets"></i>在线报告系统
                </template>
                <el-menu-item v-if="username" index="/list">报告列表</el-menu-item>
                <el-menu-item v-if="username" index="/create">创建报告</el-menu-item>
                <el-menu-item v-if="level === '2' || level === '3'" index="/search">查询报告</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
                <template slot="title">
                    <i class="el-icon-tickets"></i>在线文档系统
                </template>
                <el-menu-item v-if="username" index="/linux">linux文档</el-menu-item>
                <el-menu-item v-if="username" index="/netapp">netapp文档</el-menu-item>
                <el-menu-item v-if="level === '3'" index="/dell">dell文档</el-menu-item>
                <el-menu-item v-if="username" index="/lab">实验记录</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title">
                    <i class="el-icon-tickets"></i>在线视频系统
                </template>
                <el-menu-item v-if="username" index="/L1000Video">L1000视频</el-menu-item>
                <el-menu-item v-if="username" index="/L2000Video">L2000视频</el-menu-item>
                <el-menu-item v-if="username" index="/netappVideo">netapp视频</el-menu-item>
                <el-menu-item v-if="username" index="/virtualMachine">虚拟化视频</el-menu-item>
            </el-submenu>
            <el-submenu index="4">
                <template slot="title">
                    <i class="el-icon-tickets"></i>在线文件系统
                </template>
                <el-menu-item v-if="username" index="/tooldownload">工具下载</el-menu-item>
                <el-menu-item v-if="username" index="/isodownload">镜像下载</el-menu-item>
            </el-submenu>   
            <el-submenu index="5">
                <template slot="title">
                    <i class="el-icon-tickets"></i>后台数据管理
                </template>
                <el-menu-item v-if="level === '3'" index="/user">用户管理</el-menu-item>
                <el-menu-item v-if="level === '3'" index="/post">文档管理</el-menu-item>
                <el-menu-item v-if="level === '3'" index="/video">视频管理</el-menu-item>
                <el-menu-item v-if="level === '3'" index="/file">文件管理</el-menu-item>
            </el-submenu>
          </el-menu>
      </el-aside>
      
      <el-container>
          <el-header style="text-align: right; font-size: 15px">
          <span v-if="username">欢迎:{{username}}</span><button style="margin-left: 10px; font-size: 15px;" @click="logout">注销</button>
          </el-header>
          
          <el-main>
              <keep-alive include="ListPage,SearchPage,filePage,linuxView,netappView,dellView,postPage,L1000Video,L2000Video,netappVideo,videoPage,labPage,virtualMachine,UserPage,workOut">
                  <router-view></router-view>
              </keep-alive>
          </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'app',
  data(){
    return {
      username: "",
      level:"",
      open_list: ['1']
    }
  },
  methods:{
      logout(){
          localStorage.clear();
          this.username=localStorage.getItem("name");
          this.level=localStorage.getItem("level");
          this.$router.push("/login");
      }
  },
  watch:{
      '$route.path':function(){
          this.username=localStorage.getItem("name");
          this.level=localStorage.getItem("level");
      }
  },
  created(){
      this.username=localStorage.getItem("name");
      this.level=localStorage.getItem("level");
  }
}
</script>

<style>
html,body{
    padding: 0;
    margin: 0;
}
.el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
}

.el-aside {
    color: #333;
}
.login-box{
    width: 350px;
    margin: 80px auto;
    border: 1px solid #dcdfe6;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 0 30px;
}
.login-title{
    text-align: center;
    margin-bottom: 20px;
}
.el-input{
    width: 92%;
}
.item-button{
    display: flex;
}
.item-button button{
    width: 120px;
    margin: 0 auto;
}
.userBox{
    width: 600px;
    height: 800px;
    margin: 100px auto;
    padding: 20px;
    /* border: 1px solid #ccc; */
    border-radius: 8px;
    box-shadow: 0 0 5px #eee;
}
</style>
