const express = require('express')
const app = express()
const cors =require('cors')

require('dotenv').config({path:"./config.env"})
const port = process.env.POST || 4000;

//use middleware
app.use(cors());
app.use(express.json());

//mongodb connection
const con = require('./db/connection')

// using routes
app.use(require('./routes/route'));

con.then(db=>{
     if(!db) return process.exit(1);

     //Listen to the http server
     app.listen(port,()=>{
          console.log(`Server is runing on port: http://localhost:${port}`);
     })

     app.on('error',err=> console.log(`Failed To Connect with HTTP Server : ${err}`))
     // error in mongodo connection
}).catch(error =>{
     console.log(`Connection Failed..! ${error}`);
})