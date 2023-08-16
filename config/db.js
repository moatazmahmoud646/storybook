
const mongoose =require("mongoose");

const  connection = async()=>{
try{
 const conn= await mongoose.connect(process.env.MONGO_URI)
 console.log("Database connected")
 //connection.getCollection("user").renameCollection("googleUser")
}

catch(err)
{
    console.log(err)
}

}
module.exports = connection