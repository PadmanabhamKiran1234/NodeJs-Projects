
require('./db/connectdb')
const express = require('express');

const app = express();
const tasks = require('./routes/tasks')
const connectDB = require('./db/connectdb') 
require('dotenv').config();
const notFound = require('./middleware/not-found')
const errorHandler =require('./middleware/error-handler')


//Middlware
app.use(express.static('./public'))
app.use(express.json())


//Routes
app.use('/api/v1/tasks',tasks)
app.use(notFound)
app.use(errorHandler)

// const port = 3000;
const port = process.env.PORT || 3000;
//To run the above first run $env:PORT: new port number 
//press enter and then type node app.js
// console.log(port)
const start = async()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening on ${port}....`))
    } catch (error) {
        console.log(error)
    }
}

start()