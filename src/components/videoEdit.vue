<template>
    <div>
        <el-form @submit.native.prevent="saveVideo" ref="form" :model="video" label-width="80px" @keyup.enter.native="submitForm('form')">
            <el-form-item label="视频编号" prop="num" style="width:200px">
                <el-input v-model="video.num"></el-input>
            </el-form-item>
            <el-form-item label="视频名称" prop="name" style="width:300px">
                <el-input v-model="video.name"></el-input>
            </el-form-item>
            <el-form-item label="视频路径" prop="path" style="width:200px">
                <el-input v-model="video.path"></el-input>
            </el-form-item>
            <el-form-item label="视频类型" prop="type" style="width:200px">
                <el-input v-model="video.type"></el-input>
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
            video: {}
        }
    },
    methods: {
        saveVideo(){
            this.$axios.put('/video/'+this.$route.params.id,this.video).then(()=>{
                this.$message({
                    type: 'success',
                    message: '保存成功!'
                })
                this.$router.push('/video')
            })
        },
        cancel(){
            this.$router.push('/video')
        }
    },
    created(){
        this.$axios.get('/video/'+this.$route.params.id).then(res=>{
            this.video=res.data
        })
    }
}
</script>