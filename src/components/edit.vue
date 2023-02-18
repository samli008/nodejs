<template>
    <div>
        <el-form @submit.native.prevent="saveArticle" ref="form" :model="article" label-width="80px" @keyup.enter.native="submitForm('form')">
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
                <el-input v-model="article.problem"></el-input>
            </el-form-item>
            <el-form-item label="操作步骤" prop="oper" style="width:800px">
                <el-input type="textarea" v-model="article.oper"></el-input>
            </el-form-item>
            <el-form-item label="应用系统" prop="app" style="width:800px">
                <el-input v-model="article.app"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark" style="width:800px">
                <el-input v-model="article.remark"></el-input>
            </el-form-item>
            <div class="item-button">
                <el-button type="primary" native-type="submit">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'EditPage',
    data(){
        return {
            article: {}
        }
    },
    methods: {
        saveArticle(){
            this.$axios.put('/report/'+this.$route.params.id,this.article).then(()=>{
                this.$message({
                    type: 'success',
                    message: '保存成功!'
                })
                this.$router.push('/list')
            })
        },
        cancel(){
            this.$router.push('/list')
        }
    },
    created(){
        this.$axios.get('/report/'+this.$route.params.id).then(res=>{
            this.article=res.data
        })
    }
}
</script>