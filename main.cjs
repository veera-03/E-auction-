const express = require('express')
const app = express()
const bodyparser = require('body-parser')
app.use(bodyparser.json())
const {connectto, returnto} = require('./dbconnection.cjs')

connectto(function(error){
    if(error){
        console.log('could not connect database')
    }
    else{
        const port =  process.env.PORT || 7000
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

app.post('/login',function(request,response) {
    let users = []
    db.collection('userdetails').find(request.body).forEach(element => {
        users.push(element)
    }).then(() => {
        if(users == 0){
        response.json({
            "auth":"Invalid login"
        })}
        else{
            response.json({
                "auth" : "successfully login"
            })
        }
    }).catch(() => {
        response.status(500).send("Something went wrong")
    })
})

app.post('/bike', (request, response) => {
    // Insert button click event into MongoDB
    db.collection('bike').insertOne(request.body).then (function(){
        response.json({
            "auth":"details add"
            
        }) 
            
}).catch (function(){
    response.json({
        "auth":"not added"
    })
})
})
// to sort out last element
// app.get('/bike',function(req,res){
//     const lastelement = []
//     db.collection('bike').find().sort({ _id: -1 }).limit(1)
//     .forEach(element=>  lastelement.push(element))
//     .then (function(){
//         res.json(lastelement)
//     }).catch(function(){
//         res.send(console.log('could not find'))
//     })
// })




