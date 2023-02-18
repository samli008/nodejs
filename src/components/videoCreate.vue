<template>
    <div>
        <el-form @submit.native.prevent="saveVideo" ref="form" :model="video" :rules="rules" label-width="80px" @keyup.enter.native="submitForm('form')">
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
            video: {},
            rules: {
                num: [
                    { required: true, message: '视频编号不为空', trigger: 'blur' },
                    { min:2,max:24,message:'长度应在3-32之间',trigger: 'blur'}
                ],
                name: [
                    { required: true, message: '视频名称不为空', trigger: 'blur' },
                    { min:2,max:24,message:'长度应在3-32之间',trigger: 'blur'}
                ],
                path: [
                    { required: true, message: '视频名称不为空', trigger: 'blur' },
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
        saveVideo(){
            this.$axios.post('/video',this.video).then(res=>{
                alert(res.data)
                this.$router.push('/video')
            })
        },
        cancel(){
            this.$router.push('/video')
        }
    }
}
</script>