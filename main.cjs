const express = require('express')
const cors = require('cors')
const app = express()
const bodyparser = require('body-parser')
app.use(bodyparser.json())
const {connectto, returnto} = require('./dbconnection.cjs')
app.use(cors())

let db
connectto(function(error){
    if(error){
        console.log('could not connect database')
    }
    else{
        const port =  7000
        app.listen(port)
        db = returnto()
        console.log(`running in the port ${port} `)
    }
})

app.post('/signin', function(request,response){
    db.collection('userdetails').insertOne(request.body).then(function(){
        response.status(201).json({
            "Status":"Sign in successfully"
        })
    }).catch(function(){
        response.status(500).json({
            "Status":"could not signin try again"
        })
    })
})
let users = []
app.post('/login',function(request,response) {
    db.collection('userdetails').find(request.body).forEach(element => {
        users.push(element)
    }).then(() => {
        if(users == 0){
        response.json({
            "auth":"Invalid login"
        })}
        else{

            response.json("successfully login")
        }
    }).catch(() => {
        response.status(500).send("Something went wrong")
    })
})


app.post('/bikebid/user_confirm',function(request,response) {
    let users_confirm = []
    db.collection('userdetails').find(request.body).forEach(element => {
        users_confirm.push(element)
    }).then(() => {
        if(users_confirm == 0){
        response.json({
            "auth":"Invalid login"
        })}
        else{
                response.status(201).json({
                    "Status":"confirmed"
                })  
        }
    }).catch(() => {
        response.status(500).send("Something went wrong")
    })
})


// BIDDING UPDATE
app.post('/bikebid/1/bid',function(request,response) {
db.collection('R15Bidding').insertOne(request.body).then(function(){
    response.status(201).json({
        "Status":"bid successfully"
    })
})
})

app.post('/bikebid/2/bid',function(request,response) {
    db.collection('suzuki_id2').insertOne(request.body).then(function(){
        response.status(201).json({
            "Status":"bid successfully"
        })
    })
    })

// to sort out last updated amount
app.get('/bikebid/1/bid',function(request,response){
    const lastamount = []
    db.collection('R15Bidding').find().sort({ _id: -1 }).limit(1)
    .forEach(element=>  lastamount.push(element.newAmount))
    .then (function(){
        response.json(lastamount)
    }).catch(function(){
        response.send(console.log('could not find'))
    })
})

app.get('/bikebid/2/bid',function(request,response){
    const lastamount = []
    db.collection('suzuki_id2').find().sort({ _id: -1 }).limit(1)
    .forEach(element=>  lastamount.push(element.newAmount))
    .then (function(){
        response.json(lastamount)
    }).catch(function(){
        response.send(console.log('could not find'))
    })
})

//to sort out last element
app.get('/bikebid/1/bidresult',function(request,response){
    const lastelement = []
    db.collection('R15Bidding').find().sort({ _id: -1 }).limit(1)
    .forEach(element=>  lastelement.push(element.email))
    .then (function(){
        response.json(lastelement)
    }).catch(function(){
        response.send(console.log('could not find'))
    })
})

app.get('/bikebid/2/bidresult',function(request,response){
    const lastelement = []
    db.collection('suzuki_id2').find().sort({ _id: -1 }).limit(1)
    .forEach(element=>  lastelement.push(element.email))
    .then (function(){
        response.json(lastelement)
    }).catch(function(){
        response.send(console.log('could not find'))
    })
})
const bikebidded_details = []
app.get('/bikebidded_details',function(request,response){
    db.collection('R15Bidding').find({users}).sort({_id: -1}).limit(1)
    .forEach(element=>  bikebidded_details.push(element.email))
    .then (function(){
        response.json(bikebidded_details)
    }).catch(function(){
        response.send(console.log('could not find'))
    })
})

