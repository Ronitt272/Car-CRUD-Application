const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Car = require('./models/carSchema'); //importing the model
mongoose.connect(`mongodb://127.0.0.1:27017/car`); //car is the name of my database


const port = 3000;
app.use(express.json()); //now req.body is accessible for me as this line converts the binary data to JSON
app.get("/",(req,res)=>{
    res.send(`
    for creating information of a car: go to, "/create"
    for reading or accessing information of a car: go to "/read"
    for updating information of a car: go to "/update"
    for deleting information of a car: go to "/delete"`);
});

//now server will start listening from port
app.listen(port, ()=>{
    console.log(`server started running at http://localhost:${port}`);
})

//creating the endpoints

//1. creating information of a car
app.post("/create", async (req,res)=>{  //asynch is essential as I would e using the await keyword below, and await keyword only works when your function is asynchronous

    //have imported the model ('Car'), and now will use the model for creation of an entry in the database
    let car = new Car({
        carName: req.body.carName,
        Price: req.body.Price,
        Model: req.body.Model
    });

    //Now, we will save the object creating using the model
    let savedCar = await car.save();
    res.status(201).json(savedCar); //status code: 201, meaning resource successfully created
});

//2. Fetching or accessing the information of a car

//Fetching the details of all the cars present in the database
//the client also has the option to provide carName as query to access details pertaining to that car
app.get("/read", async (req,res)=>{
    if(req.query !== undefined && req.query.carName !== undefined)
    {
        let carname = req.query.carName;

        let carQueried = await Car.find({
        carName: carname
        });
        console.log(carQueried);
        if(carQueried !== undefined && carQueried !== null && carQueried.length > 0)
        {
        res.status(200).json(carQueried);
        return;
        }

    }
    //console.log(req.query);
    let car = await Car.find({}); //to access data of all the cars in the database

    res.status(200).json(car);  //status code: 200, for succesful execution of request
});


//fetching the details of only the car whose carname has been provided by the client
//'/:carname' - colon indicates that carname is a path parameter, and this path parameter will be used to find the car
app.get("/:carname", async (req,res)=>{

    let carname = req.params.carname;

    let carQueried = await Car.find({
        carName: carname
    });
    
    if(carQueried !== undefined && carQueried !== null && carQueried.length > 0)
    {
        res.status(200).json(carQueried);
        return;
    }

    res.status(404).send("No car found !");
})


//3. Updating the details of a car
app.put("/update", async (req,res)=>{

    /*updateOne takes two objects as parameters,
     the first object specifies the criteria to find the car, i.e. using the name of the car, and 
     the second object specifies the new updated values of the car that has been chosen for updation
     */
    let updatedCar = await Car.updateOne({carName: req.body.carName},{
        carName: req.body.carName,
        Price: req.body.Price,
        Model: req.body.Model
    });  

    res.status(200).json(updatedCar);

});

//4. Deleting the details of a car

app.delete("/delete", async (req,res)=>{

    await Car.deleteOne({carName: req.body.carName});
    res.status(200).json("deletion sucessful !");
});