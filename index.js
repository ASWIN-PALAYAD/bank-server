//server creation 

//import express

const express = require('express')

//import jswebtoken
const jwt=require('jsonwebtoken')

//import data service

const dataService = require('./services/data.services')  

//server app creation using expres

const app = express()

//parse json data

app.use(express.json())

//application specific midleware
const appMiddleware=(req,res,next)=>{
    console.log("application specific middleware");
    next()
}

//use middleware in app
app.use(appMiddleware)



//bank server

const jwtMiddleware=(req,res,next)=>{
    //fetch token
    try{
        token = req.headers['x-access-token']
        //verify token
        const data =jwt.verify(token,'supersecretkey12345')
        console.log(data);
        next()
    }
     
    catch{
        res.status(401).json({
            status:false,
            statusCode:401,
            message:'please login'
        })
    }
   

}

//register API
app.post('/register', (req, res) => {
    const result = dataService.register(req.body.acno, req.body.username, req.body.password)
    // if(result){
    //     res.send("resgister successfully")
    // }else{
    //     res.send("already registered....please login")
    // }

    res.status(result.statusCode).json(result)

})

//login API

app.post('/login', (req, res) => {
    const result = dataService.login(req.body.acno, req.body.pswd)

    res.status(result.statusCode).json(result)

})

//deposit API

app.post('/deposit',jwtMiddleware, (req, res) => {
    const result = dataService.deposit(req.body.acno, req.body.password, req.body.amt)

    res.status(result.statusCode).json(result)

})

//withdraw API

app.post('/withdraw',jwtMiddleware, (req, res) => {
    const result = dataService.withdraw(req.body.acno, req.body.password, req.body.amt)

    res.status(result.statusCode).json(result)

})




//transaction API

app.post('/transaction',jwtMiddleware, (req, res) => {
    const result = dataService.getTransaction(req.body.acno)

    res.status(result.statusCode).json(result)

})



//user request resolving

//GET request to fetch data 

app.get('/', (req, res) => {
    res.send("GET request")
})

//POST request to create data in server 
app.post('/', (req, res) => {
    res.send("POST request")
})

// PUT request to modify entire require

app.put('/', (req, res) => {
    res.send("PUT request")
})

//PATCH request for partialy modify data

app.patch('/', (req, res) => {
    res.send("patch request")
})

//DELETE request 

app.delete('/', (req, res) => {
    res.send("delete request")
})



//set up port numbet to the server app

app.listen(3000, () => {
    console.log("server started");
})