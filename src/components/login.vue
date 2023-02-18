<template>
    <div>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" @keyup.enter.native="submitForm" class="login-box">
            <h3 class="login-title">欢迎登录</h3>
            <el-form-item label="用户名:" prop="username">
                <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="密码:" prop="password">
                <el-input type="password" v-model="form.password"></el-input>
            </el-form-item>
            <div class="item-button">
                <el-button type="primary" @click="submitForm">登录</el-button>
                <el-button type="primary" @click="reg">注册</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'LoginPage',
    data(){
        return {
            form: {
                username: '',
                password: ''
            },
            rules: {
                username: [
                    { required: true, message: '账号不为空', trigger: 'blur' },
                    { min:2,max:32,message:'长度应在3-32之间',trigger: 'blur'}
                ],
                password: [
                    { required: true, message: '密码不为空', trigger: 'blur' },
                    { min:3,max:32,message:'长度应在3-32之间',trigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        submitForm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$axios.post("/login",this.form).then(res=>{
                        if(res.data.level==="1" || res.data.level==="2" || res.data.level==="3"){
                            localStorage.setItem('elementToken','Bearer '+res.data.token)
                            localStorage.setItem('name',this.form.username)
                            localStorage.setItem('level',res.data.level)
                            this.$router.push('/list')
                        }else{
                            alert("not permission")
                        }
                    })
                } else {
                    alert('error submit!!');
                    return false;
                }
            });
        },
        reg(){
            this.$router.push("/register")
        }
    }
}
</script>