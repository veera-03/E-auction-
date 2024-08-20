const express = require('express');
const cors = require('cors');
const session = require('express-session');
const app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.json());
const {connectto, returnto} = require('./dbconnection.cjs');

app.use(express.json());

const allowedOrigins = [
    'http://localhost:5173',       // Add your local development origin
    'https://e-auction-frontend-tzat.onrender.com' // Your production frontend origin
];

app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // Allow cookies and credentials to be sent
}));

app.use(session({
    secret: 'vimal@2003',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Only secure in production
        httpOnly: true,
        sameSite: 'lax' // Ensure SameSite is not causing issues
    }
}));

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
app.post('/login',async(request,response)=> {
   try{
  const user = await db.collection('userdetails').findOne(request.body);
        if(user){
            request.session.currentUser = user.email;
            console.log(request.session.currentUser)
            request.session.save(() => {
                response.json("successfully login");
            });
        }
        else{
            response.json({
                "auth":"Invalid login"
            });
           
        }
    } catch(error){
        response.status(500).send("Something went wrong");
    }
});
 
app.get('/bikebidded_details',async(request,response)=>{
    console.log(request.session.currentUser);
    if(!request.session.currentUser){
   return response.json("Login to view bidding history")
   }
   try{
    console.log(request.session.currentUser);
    const bidDetails = await db.collection('R15Bidding').find({email: request.session.currentUser}).sort({_id: -1 }).limit(1)
   .toArray();

   if (bidDetails.length > 0) {
    return response.json(bidDetails[0]);  // Return the most recent bidding detail
} else {
    return response.json("No bidding history found");
}
  
} catch(error){
   return response.status(500).send("Something went wrong");
}
});




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
            
            console.log(currentUser)
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

