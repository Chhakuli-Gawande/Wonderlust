const mongoose = require("mongoose");
const data = require("./data");
const Listing = require("../model/listing");



const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err) =>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}


const initDB = async ()=>{
    await Listing.deleteMany({});
    const initData = data.data.map((obj) => ({
        ...obj,
        owner: "6784f4d579c50394d7072c98", // Example owner ID
    }));
   await Listing.insertMany(initData);//initdata is object 
  console.log("data was initialized");

};

initDB(); //called