<template>
    <div>
        <div style="display:flex">
            <el-form style="display:flex" ref="form" :model="article" :rules="rules" @keyup.enter.native="search">
                <el-form-item label="查询类型" label-width="90px" prop="value">
                    <template>
                        <el-select v-model="article.value" style="width:100px" placeholder="请选择">
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
                    <el-input v-model="article.data" style="width:130px"></el-input>
                    <el-button type="primary" size="small" @click="search">查询SO</el-button>
                    <el-button size="small" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
            <el-upload style="margin:5px"
                class="upload-demo"
                action=""
                ref="upload"
                :on-change="changeFile"
                :on-remove="removeFile"
                :file-list="fileList"
                :multiple="true"
                :limit="1000"
                accept=".txt"
                :show-file-list="false"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取SO</el-button>
                <el-button style="margin-left:10px;" size="small" type="success" @click="upload">上传服务器</el-button>
                <el-button style="margin-left:10px;" size="small" type="success" @click="importDB">导入数据库</el-button>
                <div slot="tip" class="el-upload__tip">只能上传txt文件</div>
            </el-upload>
        </div>
        
        <el-table :data="articles.slice((page_num-1)*page,page_num*page)" style="width: 100%">
            <el-table-column prop="date" label="日期" width="120"></el-table-column>
            <el-table-column prop="num" label="单号" width="120"></el-table-column>
            <el-table-column prop="type" label="机型" width="130"></el-table-column>
            <el-table-column prop="problem" label="故障" width="150"></el-table-column>
            <!-- <el-table-column prop="oper" label="操作步骤" width="120"></el-table-column> -->
            <el-table-column prop="app" label="应用系统" width="120"></el-table-column>
            <el-table-column prop="remark" label="备注" width="120"></el-table-column>
            <el-table-column prop="user" label="工程师" width="120"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="oper(scope)">操作步骤</el-button>
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
        <p style="white-space:pre-line">
            {{article.content}}
        </p>
    </div>
</template>

<script>
export default {
    name: 'SearchPage',
    data(){
        return {
            articles:[],
            page: 10,
            page_num:1,
            total: 0,
            article: {
                data:"",
                value:"",
                content:""
            },
            options: [{
                    value: 'order',
                    label: '单号'
                    }, {
                    value: 'name',
                    label: '姓名'
                    }, {
                    value: 'type',
                    label: '机型'
            }],
            rules: {
                data: [
                    { required: true, message: '单号不为空', trigger: 'blur' },
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
        search(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$axios.post(`/search/${this.article.value}/${this.article.data}`).then(res=>{
                        if(this.article.value==="order"){
                            this.article.content=res.data.content
                        }else{
                            this.articles=res.data
                            this.total=this.articles.length
                        }
                    })
                }else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        oper(scope){
            this.$router.push("/view/"+scope.row._id)
        },
        reset(){
            this.articles=[]
            this.article.data=""
            this.article.value=""
            this.article.content=""
            this.$refs.form.resetFields()
        },
        handleSizeChange(val){
            this.page_num=1;
            this.page=val;
        },
        handleCurrentChange(val){
            this.page_num=val;
        },
        upload(){
            let fileList=this.$refs.upload.uploadFiles;
            let formData=new FormData();
            for(let i=0;i<fileList.length;i++){
                formData.append("file",fileList[i].raw);
            }
            this.$axios.post('/upload',formData).then(res=>{
                    alert(res.data)
            })
        },
        importDB(){
            this.$axios.post('/import').then(res=>{
                alert("import success "+res.data.num+" SO")
            })
        }
    }
}
</script>