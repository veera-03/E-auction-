const {MongoClient} = require('mongodb')
let userdata
function connectto(callback){
    MongoClient.connect('mongodb+srv://veerakumar:2003@expensetracker.e8yrl7g.mongodb.net/Auctionplatform?retryWrites=true&w=majority').then(function(data){
         userdata = data.db()
         callback()
    })


}

function returnto(){
 return userdata
}

module.exports = {connectto,returnto}