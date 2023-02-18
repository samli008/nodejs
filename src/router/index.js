import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from '../components/login'
import RegisterPage from '../components/register'
import UserPage from '../components/user'
import CreatePage from '../components/create'
import ListPage from '../components/list'
import EditPage from '../components/edit'
import ViewPage from '../components/view'
import SearchPage from '../components/search'
import PostPage from '../components/PostPage'
import PostEdit from '../components/PostEdit'
import PostView from '../components/PostView'
import linuxView from '../components/linuxView'
import netappView from '../components/netappView'
import PostCreate from '../components/PostCreate'
import labPage from '../components/labPage'
import labEdit from '../components/labEdit'
import labCreate from '../components/labCreate'
import labView from '../components/labView'
import videoPage from '../components/videoPage'
import videoView from '../components/videoView'
import videoCreate from '../components/videoCreate'
import videoEdit from '../components/videoEdit'
import L1000Video from '../components/L1000Video'
import L2000Video from '../components/L2000Video'
import netappVideo from '../components/netappVideo'
import virtualMachine from '../components/virtualMachine'
import workOut from '../components/workout'
import downloadFile1 from '../components/downloadFile1'
import downloadFile2 from '../components/downloadFile2'
import filePage from '../components/filePage'
import fileCreate from '../components/fileCreate'
import fileEdit from '../components/fileEdit'
import dellView from '../components/dellView'

Vue.use(VueRouter)

const routes = [
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
    { path: '/user', component: UserPage },
    { path: '/create', component: CreatePage },
    { path: '/list', component: ListPage },
    { path: '/edit/:id', component: EditPage },
    { path: '/view/:id', component: ViewPage },
    { path: '/search', component: SearchPage },
    { path: '/post', component: PostPage },
    { path: '/PostEdit/:id', component: PostEdit },
    { path: '/PostView/:id', component: PostView },
    { path: '/linux', component: linuxView },
    { path: '/netapp', component: netappView },
    { path: '/PostCreate', component: PostCreate },
    { path: '/lab', component: labPage },
    { path: '/labEdit/:id', component: labEdit },
    { path: '/labCreate', component: labCreate },
    { path: '/labView/:id', component: labView },
    { path: '/video', component: videoPage },
    { path: '/videoView/:id', component: videoView },
    { path: '/videoCreate', component: videoCreate },
    { path: '/videoEdit/:id', component: videoEdit },
    { path: '/L1000Video', component: L1000Video },
    { path: '/L2000Video', component: L2000Video },
    { path: '/netappVideo', component: netappVideo },
    { path: '/virtualMachine', component: virtualMachine },
    { path: '/workout', component: workOut },
    { path: '/tooldownload', component: downloadFile1 },
    { path: '/isodownload', component: downloadFile2 },
    { path: '/file', component: filePage },
    { path: '/fileCreate', component: fileCreate },
    { path: '/fileEdit/:id', component: fileEdit },
    { path: '/dell', component: dellView }
]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    const isToken = localStorage.elementToken ? true : false
    if (to.path == "/login" || to.path == "/register") {
        next()
    } else {
        isToken ? next() : next("/login")
    }
})

export default router