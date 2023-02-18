<template>
    <div class="video">
        <h2>{{name}}</h2>
        <video :src="url" controls autoplay></video>
    </div>
</template>
<script>
export default {
    name: 'videoView',
    data(){
        return {
            url:"",
            name:""
        }
    },
    created(){
        this.$axios.get('/video/'+this.$route.params.id).then(res=>{
            this.url="video/"+res.data.path+".mp4"
            this.name=res.data.name
        })
    }
}
</script>
<style>
.video{
    width: 700px;
    height: 460px;
    margin: 0 auto;
}
video{
    width: 700px;
    height: 420px;
    margin: 0 auto;
    border-radius: 10px;
}
.video h2{
    height: 20px;
    text-align: center;
    line-height: 20px;
    box-sizing: border-box;
}
</style>