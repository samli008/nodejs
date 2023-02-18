<template>
    <div>
        <el-form style="display:flex" ref="form" :model="form" :rules="rules" @keyup.enter.native="search">
            <el-form-item label="用户名" label-width="90px" prop="value">
                <el-input v-model="form.value" style="width:120px"></el-input>
                <el-button type="primary" size="small" @click="search">查询用户</el-button>
                <el-button size="small" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="list.slice((page_num-1)*page,page_num*page)" style="width: 100%">
            <el-table-column type="index" label="ID" width="80"></el-table-column>
            <el-table-column prop="username" label="账号" width="150"></el-table-column>
            <el-table-column prop="isAdmin" label="权限" width="150"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="edit(scope)">编辑</el-button>
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

        <el-dialog title="用户权限" :visible.sync="dialogFormVisible" width="30%">
            <el-form :model="form" label-width="80px" lebel-position="left">
                <el-form-item label="权限代码">
                    <el-input v-model="form.level"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'UserPage',
    data(){
        return {
            list:[],
            page: 10,
            page_num:1,
            total: 0,
            dialogFormVisible:false,
            form:{
                username:"",
                level:"",
                index: 0,
                value:""
            },
            rules: {
                value: [
                    { required: true, message: '用户名不为空', trigger: 'blur' },
                    { min:1,max:32,message:'长度应在3-32之间',trigger: 'blur'}
                ]
            }
        }
    },
    methods:{
        edit(scope){
            this.dialogFormVisible=true;
            this.form.level=scope.row.isAdmin;
            this.form.username=scope.row.username;
            this.form.index=scope.$index;
        },
        save(){
            this.dialogFormVisible=false;
            this.$axios.post("/put",this.form).then(res=>{
                this.list[this.form.index+(this.page_num-1)*this.page].isAdmin=res.data
            })
        },
        del(scope){
            this.$confirm('确认删除用户?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post("/delete",scope.row);
                this.list.splice(scope.$index,1);
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
                    this.$axios.post('/user/'+this.form.value).then(res=>{
                        this.list=res.data
                    })
                }else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        reset(){
            this.$axios.get('/user').then(res=>{
                this.list=res.data
                this.total=this.list.length
            })
            this.$refs.form.resetFields()
        },
        handleSizeChange(val){
            this.page_num=1;
            this.page=val;
        },
        handleCurrentChange(val){
            this.page_num=val;
        },
    },
    mounted(){
        this.$axios.get('/user').then(res=>{
            this.list=res.data
            this.total=this.list.length
        })
    }
}
</script>