<template>
    <div>
        <p style="white-space:pre-line">
        工程师{{article.user}}的操作步骤：
            {{article.oper}}
        </p>
        <hr />
        <p style="white-space:pre-line">
            {{article.so}}
        </p>
    </div>
</template>

<script>
export default {
    name: 'ViewPage',
    data(){
        return {
            article: {
                oper:"",
                num:"",
                so:"",
                user:""
            }
        }
    },
    created(){
        this.$axios.get('/report/'+this.$route.params.id).then(res=>{
            this.article.oper=res.data.oper
            this.article.num=res.data.num
            this.article.user=res.data.user
            this.$axios.post('/search/order/'+this.article.num).then(res=>{
                console.log(this.article.num)
                this.article.so=res.data.content
            })   
        })
    }
}
</script>