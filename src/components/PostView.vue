<template>
    <div>
        <p v-html="article"></p>
    </div>
</template>
<script>
import MarkdownIt from 'markdown-it'
export default {
    name: 'postView',
    data(){
        return {
            article: {}
        }
    },
    methods: {
        markdown(post){
            const md = new MarkdownIt();
            const result = md.render(post);
            return result;
        }
    },
    created(){
        this.$axios.get('/doc/'+this.$route.params.id).then(res=>{
            this.article=this.markdown(res.data.content)
        })
    }
}
</script>