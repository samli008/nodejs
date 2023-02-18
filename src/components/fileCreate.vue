<template>
    <div>
        <el-form @submit.native.prevent="saveFile" ref="form" :model="file" :rules="rules" label-width="80px" @keyup.enter.native="submitForm('form')">
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
            file: {},
            rules: {
                num: [
                    { required: true, message: '文件编号不为空', trigger: 'blur' },
                    { min:2,max:24,message:'长度应在3-32之间',trigger: 'blur'}
                ],
                name: [
                    { required: true, message: '文件名称不为空', trigger: 'blur' },
                    { min:2,max:24,message:'长度应在3-32之间',trigger: 'blur'}
                ],
                path: [
                    { required: true, message: '文件名称不为空', trigger: 'blur' },
                    { min:2,max:24,message:'长度应在3-32之间',trigger: 'blur'}
                ],
                type: [
                    { required: true, message: '文件类型不为空', trigger: 'blur' },
                    { min:1,max:32,message:'长度应在3-32之间',trigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        saveFile(){
            this.$axios.post('/file',this.file).then(res=>{
                alert(res.data)
                this.$router.push('/file')
            })
        },
        cancel(){
            this.$router.push('/file')
        }
    }
}
</script>