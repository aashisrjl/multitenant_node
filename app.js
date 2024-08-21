const express = require('express')
const app = express()
const port = 3000
require('./model/index')

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(require('cookie-parser')())

const {Server} = require('socket.io');
const organizationRoute = require('./route/organization/organizationRoute')
const userRoute = require('./route/user/userRoute')
const { users } = require('./model/index')

// Use a base path for the organization and user routes
app.use('', organizationRoute)
app.use('', userRoute)

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.get('/home',(req,res)=>{
    res.render('home')
})

const server = app.listen(port, () => {
    console.log("server started on port: " + port)
})
const io = new Server(server)
io.on('connection',(socket)=>{
    console.log('a new client connected'+socket.id)
    // socket.on("hello",(data)=>{
    //     console.log(data)
    //     socket.emit('response',"success")// notification for specific user
    // })
    // io.emit('response',"success")// notification for all user

    socket.on('register',async(data)=>{
       const {username,password,email} = data
       const user = await users.create({
        username,
        password,
        email
       })
       socket.emit('response',{
        status:200,
        message:"user created successfully"
       });
    })
  
    socket.on('disconnect',()=>{
        console.log('a client disconnected')
    })
})

