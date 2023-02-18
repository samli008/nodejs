<template>
    <div>
        <el-form ref="form" :model="video" :rules="rules" @keyup.enter.native="search">
            <el-form-item label="视频名称" style="display:flex" prop="data">
                <el-input v-model="video.data" size="small" style="width:130px"></el-input>
                <el-button type="primary" size="small" @click="search">查询视频</el-button>
                <el-button size="small" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="videos.slice((page_num-1)*page,page_num*page)" style="width: 100%">
            <el-table-column prop="name" label="视频名称" width="130"></el-table-column>
            <el-table-column prop="type" label="视频类型" width="110"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="view(scope)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page_num"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="page"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>
<script>
export default {
    name: 'netappVideo',
    data(){
        return {
            videos: [],
            page: 10,
            page_num:1,
            total: 0,
            video: {
                data:""
            },
            rules: {
                data: [
                    { required: true, message: '搜索内容不为空', trigger: 'blur' },
                    { min:1,max:24,message:'长度必须为1位数字',trigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        view(scope){
            this.$router.push("/videoView/"+scope.row._id)
        },
        search(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$axios.post(`/video/netapp/name/${this.video.data}`).then(res=>{
                        this.videos=res.data
                        this.total=this.videos.length
                        console.log(res.data)
                    })
                }else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        reset(){
            this.$axios.get('/video/netapp').then(res=>{
            this.videos=res.data;
            this.total=this.videos.length;
        })
            this.video.data=""
            this.video.value=""
            this.$refs.form.resetFields()
        },
        handleSizeChange(val){
            this.page_num=1;
            this.page=val;
        },
        handleCurrentChange(val){
            this.page_num=val;
        }
    },
    mounted(){
        this.$axios.get('/video/netapp').then(res=>{
            this.videos=res.data;
            this.total=this.videos.length;
        })
    }
}
</script>