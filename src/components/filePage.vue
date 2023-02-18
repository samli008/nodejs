<template>
    <div>
        <el-form style="display:flex" ref="form" :model="file" :rules="rules" @keyup.enter.native="search">
            <el-form-item label="查询类型" label-width="90px" prop="value">
                <template>
                    <el-select v-model="file.value" style="width:120px" placeholder="请选择">
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
                <el-input v-model="file.data" style="width:130px"></el-input>
                <el-button type="primary" size="small" @click="search">查询文件</el-button>
                <el-button size="small" @click="reset">重置</el-button>
                <el-button type="primary" size="small" @click="create">创建文件</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="files.slice((page_num-1)*page,page_num*page)" style="width: 100%">
            <el-table-column prop="name" label="文件名称" width="130"></el-table-column>
            <el-table-column prop="type" label="文件类型" width="110"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="download(scope)">下载</el-button>
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
    name: 'filePage',
    data(){
        return {
            files: [],
            page: 10,
            page_num:1,
            total: 0,
            file: {
                data:"",
                value:""
            },
            options: [{
                    value: 'name',
                    label: '文件名称'
                    }, {
                    value: 'type',
                    label: '文件类型'
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
        download(scope){
            this.url="file/"+scope.row.path
            location.href=this.url
        },
        edit(scope){
            this.$router.push("/fileEdit/"+scope.row._id)
        },
        create(){
            this.$router.push("/fileCreate")
        },
        del(scope){
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.delete("/file/"+scope.row._id);
                this.files.splice(scope.$index,1);
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
                    this.$axios.post(`/file/${this.file.value}/${this.file.data}`).then(res=>{
                        this.files=res.data
                        this.total=this.files.length
                        console.log(res.data)
                    })
                }else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        reset(){
            this.$axios.get('/file').then(res=>{
            this.files=res.data;
            this.total=this.files.length;
        })
            this.file.data=""
            this.file.value=""
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
        this.$axios.get('/file').then(res=>{
            this.files=res.data;
            this.total=this.files.length;
        })
    }
}
</script>