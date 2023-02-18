//express server configuration
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secret = 'register-rule'
const fileUpload = require('express-fileupload')

app.use(fileUpload())

app.use(cors());
app.use("/", express.static("report"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

//database API
mongoose.connect("mongodb://localhost:27017/login", { useNewUrlParser: true }, () => {
    console.log('mongodb connected')
})

const { Schema, model } = mongoose

//user authorization schema model
const userSchema = new Schema({
    username: { type: String, require: true },
    password: {
        type: String,
        require: true,
        set(val) {
            return bcrypt.hashSync(val, 10)
        }
    },
    isAdmin: { type: String, default: '0' }
})
const User = model('user', userSchema)

//user auth middleware
const isAdmin = async(req, res, next) => {
    const token = req.headers.authorization.split(' ').pop()
    const { _id, username } = jwt.verify(token, secret)
    const user = await User.findById(_id)
    if (!user) { return res.status(422).send('user not exist') }
    if (username !== user.username) {
        res.status(422).send('username error')
    } else {
        if (user.isAdmin === '3') {
            next()
        } else {
            res.status(409).send('not permission')
        }
    }
}

const isOper = async(req, res, next) => {
    const token = req.headers.authorization.split(' ').pop()
    const { _id, username } = jwt.verify(token, secret)
    const user = await User.findById(_id)
    if (!user) { return res.status(422).send('user not exist') }
    if (username !== user.username) {
        res.status(422).send('username error')
    } else {
        if (user.isAdmin === '2' || user.isAdmin === '3') {
            next()
        } else {
            res.status(409).send('not permission')
        }
    }
}
const isUser = async(req, res, next) => {
    const token = req.headers.authorization.split(' ').pop()
    const { _id, username } = jwt.verify(token, secret)
    const user = await User.findById(_id)
    if (!user) { return res.status(422).send('user not exist') }
    if (username !== user.username) {
        res.status(422).send('username error')
    } else {
        if (user.isAdmin === '1' || user.isAdmin === '2' || user.isAdmin === '3') {
            next()
        } else {
            res.status(409).send('not permission')
        }
    }
}

// database user CRUD
app.get('/user', isAdmin, async(req, res) => {
    const list = await User.find()
    res.send(list)
})

app.post('/user/:id', isAdmin, async(req, res) => {
    const list = await User.find({ username: req.params.id })
    res.send(list)
})

app.post('/register', async(req, res) => {
    const user = await User.findOne({ username: req.body.username })
    if (user) { return res.status(409).send('user already exist.') }
    const newUser = await User.create(req.body);
    res.send(newUser);
})

app.post('/login', async(req, res) => {
    const user = await User.findOne({ username: req.body.username })
    if (!user) { return res.status(422).send('user not exist.') }
    let isPassword = await bcrypt.compareSync(req.body.password, user.password)
    if (!isPassword) {
        return res.status(422).send('password error.')
    } else {
        const { _id, username } = user
        const token1 = jwt.sign({ _id, username }, secret, { expiresIn: '24h' })
        const lo = { token: token1, level: user.isAdmin }
        res.send(lo)
    }
})

app.post('/delete', isAdmin, async(req, res) => {
    const user = await User.deleteOne({ username: req.body.username })
    if (user.deletedCount == 1) {
        res.send('deleted successfully')
    } else {
        res.send('delete failed')
    }
})

app.post('/put', isAdmin, async(req, res) => {
    const user = await User.findOne({ username: req.body.username })
    user.isAdmin = req.body.level
    await user.save()
    res.send(user.isAdmin)
})

//report schema model
const reportSchema = new Schema({
    date: { type: String },
    num: { type: String },
    type: { type: String },
    problem: { type: String },
    oper: { type: String },
    app: { type: String },
    remark: { type: String },
    user: { type: String }
})

const RP = model('report', reportSchema)

//database report CRUD
app.get('/report', isOper, async(req, res) => {
    const reports = await RP.find().sort({ date: -1 })
    res.send(reports)
})

app.post('/report/user', isUser, async(req, res) => {
    const report = await RP.find({ user: req.body.user }).sort({ date: -1 })
    res.send(report)
})

app.post('/report', isUser, async(req, res) => {
    const report = await RP.create(req.body)
    res.send(report)
})

app.post('/report/:id', isUser, async(req, res) => {
    const report = await RP.findOne({ num: req.params.id })
    res.send(report)
})

app.delete('/report/:id', isUser, async(req, res) => {
    await RP.findByIdAndDelete(req.params.id)
    res.send({
        status: true
    })
})

app.get('/report/:id', isUser, async(req, res) => {
    const report = await RP.findById(req.params.id)
    res.send(report)
})

app.put('/report/:id', isUser, async(req, res) => {
    const report = await RP.findByIdAndUpdate(req.params.id, req.body)
    res.send(report)
})

app.post('/search/name/:id', isOper, async(req, res) => {
    const reports = await RP.find({ user: { $regex: req.params.id ,$options: 'i'} }).sort({ date: -1 })
    res.send(reports)
})

app.post('/search/type/:id', isOper, async(req, res) => {
    const reports = await RP.find({ type: { $regex: req.params.id } }).sort({ date: -1 })
    res.send(reports)
})

const soSchema = new Schema({
    num: { type: String },
    content: { type: String }
})

const SO = model('so', soSchema)

app.post('/search/order/:id', isOper, async(req, res) => {
    const so = await SO.findOne({ num: req.params.id })
    res.send(so)
})

app.post('/so', async(req, res) => {
    const x = await SO.findOne({ num: req.body.num })
    if (x) {
        res.send(x.num + " data duplication.")
    } else {
        const so = await SO.create(req.body)
        res.send(so.num)
    }
})

app.get('/so', isAdmin, async(req, res) => {
    const sos = await SO.find()
    res.send(sos)
})

const docSchema = new Schema({
    name: { type: String },
    type: { type: String },
    content: { type: String }
})

const DOC = model('doc', docSchema)

app.post('/doc/name/:id', isUser, async(req, res) => {
    const docs = await DOC.find({ name: { $regex: req.params.id ,$options: 'i'} })
    res.send(docs)
})

app.post('/doc/linux/name/:id', isUser, async(req, res) => {
    const docs = await DOC.find({ name: { $regex: req.params.id ,$options: 'i'}, type: "linux" })
    res.send(docs)
})

app.post('/doc/dell/name/:id', isUser, async(req, res) => {
    const docs = await DOC.find({ name: { $regex: req.params.id ,$options: 'i'}, type: "dell" })
    res.send(docs)
})

app.post('/doc/netapp/name/:id', isUser, async(req, res) => {
    const docs = await DOC.find({ name: { $regex: req.params.id ,$options: 'i'}, type: "netapp" })
    res.send(docs)
})

app.post('/doc/type/:id', isUser, async(req, res) => {
    const docs = await DOC.find({ type: { $regex: req.params.id ,$options: 'i' } })
    res.send(docs)
})

app.post('/doc', async(req, res) => {
    const x = await DOC.findOne({ name: req.body.name })
    if (x) {
        res.send(x.name + " data duplication.")
    } else {
        const doc = await DOC.create(req.body)
        res.send(doc.name + " import successful.")
    }
})

app.get('/doc', isUser, async(req, res) => {
    const docs = await DOC.find()
    res.send(docs)
})

app.get('/doc/linux', isUser, async(req, res) => {
    const docs = await DOC.find({ type: "linux" }).sort({ name: 1 })
    res.send(docs)
})

app.get('/doc/dell', isUser, async(req, res) => {
    const docs = await DOC.find({ type: "dell" }).sort({ name: 1 })
    res.send(docs)
})

app.get('/doc/netapp', isUser, async(req, res) => {
    const docs = await DOC.find({ type: "netapp" }).sort({ name: 1 })
    res.send(docs)
})

app.get('/doc/:id', isUser, async(req, res) => {
    const doc = await DOC.findById(req.params.id)
    res.send(doc)
})

app.put('/doc/:id', isAdmin, async(req, res) => {
    const doc = await DOC.findByIdAndUpdate(req.params.id, req.body)
    res.send(doc)
})

app.delete('/doc/:id', isUser, async(req, res) => {
    await DOC.findByIdAndDelete(req.params.id)
    res.send({
        status: true
    })
})

const labSchema = new Schema({
    date: { type: String },
    name: { type: String },
    user: { type: String },
    content: { type: String }
})

const LAB = model('lab', labSchema)

app.post('/lab/user/:id', isOper, async(req, res) => {
    const labs = await LAB.find({ user: { $regex: req.params.id ,$options: 'i'} }).sort({ date: -1 })
    res.send(labs)
})

app.post('/lab/name/:id', isOper, async(req, res) => {
    const labs = await LAB.find({ name: { $regex: req.params.id ,$options: 'i'} }).sort({ date: -1 })
    res.send(labs)
})

app.get('/lab', isOper, async(req, res) => {
    const labs = await LAB.find().sort({ date: -1 })
    res.send(labs)
})

app.post('/lab/user', isUser, async(req, res) => {
    const labs = await LAB.find({ user: req.body.user }).sort({ date: -1 })
    res.send(labs)
})

app.post('/lab', async(req, res) => {
    const lab = await LAB.create(req.body)
    res.send(lab.name + " created successful.")
})

app.get('/lab/:id', isUser, async(req, res) => {
    const lab = await LAB.findById(req.params.id)
    res.send(lab)
})

app.put('/lab/:id', isUser, async(req, res) => {
    const lab = await LAB.findByIdAndUpdate(req.params.id, req.body)
    res.send(lab)
})

app.delete('/lab/:id', isUser, async(req, res) => {
    await LAB.findByIdAndDelete(req.params.id)
    res.send({
        status: true
    })
})

const videoSchema = new Schema({
    num: { type: String },
    type: { type: String },
    name: { type: String },
    path: { type: String }
})

const VIDEO = model('video', videoSchema)

app.post('/video', async(req, res) => {
    const video = await VIDEO.create(req.body)
    res.send(video.name + " created successful.")
})

app.get('/video', isUser, async(req, res) => {
    const videos = await VIDEO.find().sort({ num: 1 })
    res.send(videos)
})

app.get('/video/l1000', isUser, async(req, res) => {
    const videos = await VIDEO.find({ type: "L1000" }).sort({ num: 1 })
    res.send(videos)
})

app.get('/video/l2000', isUser, async(req, res) => {
    const videos = await VIDEO.find({ type: "L2000" }).sort({ num: 1 })
    res.send(videos)
})

app.get('/video/netapp', isUser, async(req, res) => {
    const videos = await VIDEO.find({ type: "netapp" }).sort({ num: 1 })
    res.send(videos)
})

app.get('/video/virtualMachine', isUser, async(req, res) => {
    const videos = await VIDEO.find({ type: "virtual" }).sort({ num: 1 })
    res.send(videos)
})

app.get('/video/workout', isUser, async(req, res) => {
    const videos = await VIDEO.find({ type: "workout" }).sort({ num: 1 })
    res.send(videos)
})

app.get('/video/:id', isUser, async(req, res) => {
    const video = await VIDEO.findById(req.params.id)
    res.send(video)
})

app.put('/video/:id', isAdmin, async(req, res) => {
    const video = await VIDEO.findByIdAndUpdate(req.params.id, req.body)
    res.send(video)
})

app.delete('/video/:id', isAdmin, async(req, res) => {
    await VIDEO.findByIdAndDelete(req.params.id)
    res.send({
        status: true
    })
})

app.post('/video/type/:id', isUser, async(req, res) => {
    const videos = await VIDEO.find({ type: { $regex: req.params.id } }).sort({ num: 1 })
    res.send(videos)
})

app.post('/video/name/:id', isUser, async(req, res) => {
    const videos = await VIDEO.find({ name: { $regex: req.params.id ,$options: 'i' } }).sort({ num: 1 })
    res.send(videos)
})

app.post('/video/l1000/name/:id', isUser, async(req, res) => {
    const videos = await VIDEO.find({ name: { $regex: req.params.id ,$options: 'i' }, type: "L1000" }).sort({ num: 1 })
    res.send(videos)
})

app.post('/video/l2000/name/:id', isUser, async(req, res) => {
    const videos = await VIDEO.find({ name: { $regex: req.params.id ,$options: 'i' }, type: "L2000" }).sort({ num: 1 })
    res.send(videos)
})

app.post('/video/netapp/name/:id', isUser, async(req, res) => {
    const videos = await VIDEO.find({ name: { $regex: req.params.id ,$options: 'i' }, type: "netapp" }).sort({ num: 1 })
    res.send(videos)
})

app.post('/video/virtual/name/:id', isUser, async(req, res) => {
    const videos = await VIDEO.find({ name: { $regex: req.params.id ,$options: 'i' }, type: "virtual" }).sort({ num: 1 })
    res.send(videos)
})

const fileSchema = new Schema({
    num: { type: String },
    type: { type: String },
    name: { type: String },
    path: { type: String }
})

const FILE = model('file', fileSchema)

app.post('/file', async(req, res) => {
    const file = await FILE.create(req.body)
    res.send(file.name + " created successful.")
})

app.get('/file', isUser, async(req, res) => {
    const files = await FILE.find().sort({ num: 1 })
    res.send(files)
})

app.get('/file/tool', isUser, async(req, res) => {
    const files = await FILE.find({ type: "tool" }).sort({ num: 1 })
    res.send(files)
})

app.get('/file/iso', isUser, async(req, res) => {
    const files = await FILE.find({ type: "iso" }).sort({ num: 1 })
    res.send(files)
})

app.get('/file/:id', isUser, async(req, res) => {
    const file = await FILE.findById(req.params.id)
    res.send(file)
})

app.put('/file/:id', isAdmin, async(req, res) => {
    const file = await FILE.findByIdAndUpdate(req.params.id, req.body)
    res.send(file)
})

app.delete('/file/:id', isAdmin, async(req, res) => {
    await FILE.findByIdAndDelete(req.params.id)
    res.send({
        status: true
    })
})

app.post('/file/type/:id', isUser, async(req, res) => {
    const files = await FILE.find({ type: { $regex: req.params.id } }).sort({ num: 1 })
    res.send(files)
})

app.post('/file/name/:id', isUser, async(req, res) => {
    const files = await FILE.find({ name: { $regex: req.params.id ,$options: 'i' } }).sort({ num: 1 })
    res.send(files)
})

app.post('/file/tool/name/:id', isUser, async(req, res) => {
    const files = await FILE.find({ name: { $regex: req.params.id ,$options: 'i' }, type: "tool" }).sort({ num: 1 })
    res.send(files)
})

app.post('/file/iso/name/:id', isUser, async(req, res) => {
    const files = await FILE.find({ name: { $regex: req.params.id ,$options: 'i' }, type: "iso" }).sort({ num: 1 })
    res.send(files)
})

app.post('/import', async(req, res) => {
    const fs = require('fs');

    const files = fs.readdirSync('/html/txt/');
    let so = { num: "", content: "" }
    let count = { num: 0 }

    async function fun(so, files, SO, count) {
        for (let i = 0; i < files.length; i++) {
            so.num = files[i].split('_').shift()
            if (so.num.length != 11) {
                so.num = so.num.split('-').shift()
            }
            if (so.num.length === 11 && !isNaN(Number(so.num))) {
                so.content = fs.readFileSync('/html/txt/' + files[i], 'utf-8')
                const x = await SO.findOne({ num: so.num })
                if (x == null) {
                    await SO.create(so)
                    count.num++
                }
            }
        }
    }

    await fun(so, files, SO, count)
    res.send(count)
})

app.post('/upload', isOper, (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ msg: 'no file uploaded' });
    }
    let files = req.files.file
    for (let i in files) {
        let file = files[i]
        file.mv(`${__dirname}/txt/${file.name}`, err => {
            if (err) {
                console.error(err);
                return res.status(500).send(err);
            }
        })
    }
    res.send('files uploaded!')
})

app.listen(86, () => {
    console.log("server is running.")
})
