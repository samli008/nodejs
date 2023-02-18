<template>
    <div>
        <el-form :model="registerData" :rules="rules" ref="registerForm" label-width="100px" @keyup.enter.native="submitForm" class="login-box">
            <h3 class="login-title">欢迎注册</h3>
            <el-form-item label="账号" prop="username">
                <el-input v-model="registerData.username"></el-input>
            </el-form-item>    
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="registerData.password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="password2">
                <el-input type="password" v-model="registerData.password2"></el-input>
            </el-form-item>
            <div class="item-button">
                <el-button type="primary" @click="log">登录</el-button>
                <el-button type="primary" @click="submitForm">注册</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
export default {
    name: "RegisterPage",
    data(){
        var validatePass = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请再次输入密码'));
            } else if (value !== this.registerData.password) {
            callback(new Error('两次输入密码不一致!'));
            } else {
            callback();
            }
        };
        return {
            registerData:{
                username:"",
                password:"",
                password2:""
            },
            rules: {
                username: [
                    { required: true, message: '账号不为空', trigger: 'blur' },
                    { min:2,max:32,message:'长度应在3-32之间',trigger: 'blur'}
                ],
                password: [
                    { required: true, message: '密码不为空', trigger: 'blur' },
                    { min:3,max:32,message:'长度应在3-32之间',trigger: 'blur'}
                ],
                password2: [
                    { required: true, message: '密码不为空', trigger: 'blur' },
                    { min:3,max:32,message:'长度应在3-32之间',trigger: 'blur'},
                    { validator: validatePass, trigger: 'blur' }
                ],
            }
        }
    },
    methods:{
        submitForm() {
            this.$refs.registerForm.validate((valid) => {
                if (valid) {
                    this.$axios.post("/register",this.registerData).then(res=>{
                        console.log(res.data)
                        this.$message({
                            type: "success",
                            message: "用户注册成功"
                        })
                        this.$router.push("/login")
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        log(){
            this.$router.push("/login")
        }
    }
}
</script>