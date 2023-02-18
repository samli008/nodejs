<template>
    <div>
        <el-table :data="articles.slice((page_num-1)*page,page_num*page)" style="width: 100%">
            <el-table-column prop="date" label="日期" width="110"></el-table-column>
            <el-table-column prop="num" label="单号" width="120"></el-table-column>
            <el-table-column prop="type" label="机型" width="130"></el-table-column>
            <el-table-column prop="problem" label="故障" width="150"></el-table-column>
            <!-- <el-table-column prop="oper" label="操作步骤" width="150"></el-table-column> -->
            <el-table-column prop="app" label="应用系统" width="110"></el-table-column>
            <el-table-column prop="remark" label="备注" width="80"></el-table-column>
            <el-table-column prop="user" label="工程师" width="100"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="edit(scope)">修改</el-button>
                    <el-button type="primary" size="small" @click="oper(scope)">操作步骤</el-button>
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
    name: 'ListPage',
    data(){
        return {
            articles:[],
            page: 10,
            page_num:1,
            total: 0,
            data:{
                user:"",
                level:""
            }
        }
    },
    methods:{
        handleSizeChange(val){
            this.page_num=1;
            this.page=val;
        },
        handleCurrentChange(val){
            this.page_num=val;
        },
        edit(scope){
            this.$router.push("/edit/"+scope.row._id)
        },
        oper(scope){
            this.$router.push("/view/"+scope.row._id)
        },
        del(scope){
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.delete("/report/"+scope.row._id);
                this.articles.splice(scope.$index,1);
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
        }
    },
    mounted(){
        this.data.level=localStorage.getItem("level");
        this.data.user=localStorage.getItem("name");
        if(this.data.level==='2' || this.data.level==='3'){
            this.$axios.get('/report',this.data).then(res=>{
                this.articles=res.data;
                this.total=this.articles.length; 
            })
        }else{
            this.$axios.post('/report/user',this.data).then(res=>{
                this.articles=res.data;
                this.total=this.articles.length;
            })
        }
    }
}
</script>