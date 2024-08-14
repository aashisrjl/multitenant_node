const express = require('express')
const app = express()
const port = 3000
require('./model/index')

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(require('cookie-parser')())

const organizationRoute = require('./route/organization/organizationRoute')
const userRoute = require('./route/user/userRoute')

// Use a base path for the organization and user routes
app.use('', organizationRoute)
app.use('', userRoute)

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.get('/home',(req,res)=>{
    res.send('i am home page')
})

app.listen(port, () => {
    console.log("server started on port: " + port)
})

