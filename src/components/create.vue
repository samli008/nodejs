<template>
    <div>
        <el-form ref="form" :model="article" :rules="rules" label-width="120px" @keyup.enter.native="saveArticle">
            <el-form-item label="日期" prop="date" style="width:300px">
                <el-input v-model="article.date"></el-input>
            </el-form-item>
            <el-form-item label="单号" prop="num" style="width:300px">
                <el-input v-model="article.num"></el-input>
            </el-form-item>
            <el-form-item label="机型" prop="type" style="width:300px">
                <el-input v-model="article.type"></el-input>
            </el-form-item>
            <el-form-item label="故障现象" prop="problem" style="width:800px">
                <el-input type="textarea" v-model="article.problem"></el-input>
            </el-form-item>
            <el-form-item label="操作步骤" prop="oper" style="width:800px">
                <el-input type="textarea" v-model="article.oper"></el-input>
            </el-form-item>
            <el-form-item label="应用系统" prop="app" style="width:800px">
                <el-input type="textarea" v-model="article.app"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark" style="width:800px">
                <el-input type="textarea" v-model="article.remark"></el-input>
            </el-form-item>
            <div class="item-button">
                <el-button type="primary" @click="saveArticle('form')">创建报告</el-button>
                <el-button @click="cancel">取消</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'CreatePage',
    data(){
        return {
            article: {
                date:"",
                num:"",
                type:"",
                problem:"",
                oper:"",
                app:"",
                remark:"",
                user:""
            },
            rules: {
                date: [
                    { required: true, message: '单号不为空', trigger: 'blur' },
                    { min:4,max:32,message:'长度应在3-32之间',trigger: 'blur'}
                ],
                num: [
                    { required: true, message: '文件内容不为空', trigger: 'blur' },
                    { min:5,max:32,message:'长度不少于5个字符',trigger: 'blur'}
                ],
                type: [
                    { required: true, message: '文件内容不为空', trigger: 'blur' },
                    { min:3,max:32,message:'长度不少于5个字符',trigger: 'blur'}
                ],
                problem: [
                    { required: true, message: '文件内容不为空', trigger: 'blur' },
                    { min:5,max:100,message:'长度不少于5个字符',trigger: 'blur'}
                ],
                oper: [
                    { required: true, message: '文件内容不为空', trigger: 'blur' },
                    { min:5,max:100,message:'长度不少于5个字符',trigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        saveArticle(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.article.user=localStorage.getItem("name");
                    this.$axios.post('/report',this.article).then(()=>{
                        this.$message({
                            type: 'success',
                            message: '创建成功!'
                        })
                        this.$router.push('/list')
                    })
                }else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        cancel(){
            this.$router.push('/list')
        }
    }
}
</script>