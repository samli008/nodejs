<template>
    <div>
        <el-form style="display:flex" ref="form" :model="video" :rules="rules" @keyup.enter.native="search">
            <el-form-item label="查询类型" label-width="90px" prop="value">
                <template>
                    <el-select v-model="video.value" style="width:120px" placeholder="请选择">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                    </el-select>
                </template>
            </el-form-item>
            <el-form-item prop="data">
                <el-input v-model="video.data" style="width:130px"></el-input>
                <el-button type="primary" size="small" @click="search">查询视频</el-button>
                <el-button size="small" @click="reset">重置</el-button>
                <el-button type="primary" size="small" @click="create">创建视频</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="videos.slice((page_num-1)*page,page_num*page)" style="width: 100%">
            <el-table-column prop="name" label="视频名称" width="130"></el-table-column>
            <el-table-column prop="type" label="视频类型" width="110"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="view(scope)">查看</el-button>
                    <el-button type="primary" size="small" @click="edit(scope)">修改</el-button>
                    <el-button type="danger" size="small" @click="del(scope)">删除</el-button>
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
    name: 'videoPage',
    data(){
        return {
            videos: [],
            page: 10,
            page_num:1,
            total: 0,
            video: {
                data:"",
                value:""
            },
            options: [{
                    value: 'name',
                    label: '视频名称'
                    }, {
                    value: 'type',
                    label: '视频类型'
            }],
            rules: {
                data: [
                    { required: true, message: '搜索内容不为空', trigger: 'blur' },
                    { min:2,max:24,message:'长度必须为11位数字',trigger: 'blur'}
                ],
                value: [
                    { required: true, message: '搜索类型不为空', trigger: 'blur' },
                    { min:1,max:32,message:'长度应在3-32之间',trigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        view(scope){
            this.$router.push("/videoView/"+scope.row._id)
        },
        edit(scope){
            this.$router.push("/videoEdit/"+scope.row._id)
        },
        create(){
            this.$router.push("/videoCreate")
        },
        del(scope){
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.delete("/video/"+scope.row._id);
                this.videos.splice(scope.$index,1);
                this.$message({
                    type: 'success',
                    message: '删除成功!'
            });
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });        
            });
        },
        search(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$axios.post(`/video/${this.video.value}/${this.video.data}`).then(res=>{
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
            this.$axios.get('/video').then(res=>{
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
        this.$axios.get('/video').then(res=>{
            this.videos=res.data;
            this.total=this.videos.length;
        })
    }
}
</script>