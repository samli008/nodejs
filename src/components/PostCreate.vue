<template>
    <div>
        <el-form @submit.native.prevent="saveArticle" ref="form" :model="article" :rules="rules" label-width="80px" @keyup.enter.native="submitForm('form')">
            <el-form-item label="文档名称" prop="name" style="width:200px">
                <el-input v-model="article.name"></el-input>
            </el-form-item>
            <el-form-item label="文档类型" prop="type" style="width:200px">
                <el-input v-model="article.type"></el-input>
            </el-form-item>
            <el-form-item label="文档内容" prop="content" style="width:800px">
                <el-input type="textarea" :autosize="{minRows:20,maxRows:100}" v-model="article.content"></el-input>
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
    name: 'PostEdit',
    data(){
        return {
            article: {},
            rules: {
                name: [
                    { required: true, message: '文档名称不为空', trigger: 'blur' },
                    { min:2,max:24,message:'长度应在3-32之间',trigger: 'blur'}
                ],
                type: [
                    { required: true, message: '文档类型不为空', trigger: 'blur' },
                    { min:1,max:32,message:'长度应在3-32之间',trigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        saveArticle(){
            this.$axios.post('/doc',this.article).then(res=>{
                alert(res.data)
                this.$router.push('/post')
            })
        },
        cancel(){
            this.$router.push('/post')
        }
    }
}
</script>