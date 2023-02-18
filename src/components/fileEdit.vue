<template>
    <div>
        <el-form @submit.native.prevent="saveVideo" ref="form" :model="file" label-width="80px" @keyup.enter.native="submitForm('form')">
            <el-form-item label="文件编号" prop="num" style="width:200px">
                <el-input v-model="file.num"></el-input>
            </el-form-item>
            <el-form-item label="文件名称" prop="name" style="width:300px">
                <el-input v-model="file.name"></el-input>
            </el-form-item>
            <el-form-item label="文件路径" prop="path" style="width:200px">
                <el-input v-model="file.path"></el-input>
            </el-form-item>
            <el-form-item label="文件类型" prop="type" style="width:200px">
                <el-input v-model="file.type"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" native-type="submit">保存</el-button>
                <el-button size="small" @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data(){
        return {
            file: {}
        }
    },
    methods: {
        saveVideo(){
            this.$axios.put('/file/'+this.$route.params.id,this.file).then(()=>{
                this.$message({
                    type: 'success',
                    message: '保存成功!'
                })
                this.$router.push('/file')
            })
        },
        cancel(){
            this.$router.push('/file')
        }
    },
    created(){
        this.$axios.get('/file/'+this.$route.params.id).then(res=>{
            this.file=res.data
        })
    }
}
</script>