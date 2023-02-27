require("dotenv").config();
const express = require("express");
console.log(process.env)
const app = express();
// Destructuring an object acess from our mongodb driver import
const { MongoClient } = require("mongodb");

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST;
const DB_URL = process.env.DB_URL;

    // Instantiate a new mongo client
    client = new MongoClient(DB_URL);

    console.log(client);

    // create a new function
    async function dbconnect() {
        // Eastablishes a connection with the database process
        await client.connect()
        // create a database or connect if one exists
        let db = await client.db("mongolesson")
        // Create a collection within our new database
        let collection = await db.collection("user")
        // This will not create a db or a collection until the first entry has occurred.
        return collection
    }

app.use(express.json())
// todo: Create an endpoint that saves an object to our database
app.post("/create", async(req, res) => {
    try {
        let body = req.body
        //Connects to our database and collection
        let connect = await dbconnect()
        // Uses mongo's insertOne method to push contents of the body to our mongolesson db's users collection
        let insertOne = await connect.insertOne(body)

        res.status(201).json({
            messgae: `User created.`,
            insertOne
        })
    } catch (error) {
        res.status(500).json({
            message: `Error: ${err}`
        })
    }
})

app.get("/getusers", async (_, res) => {
    try {
        let connect = await dbconnect()
        // .find returns a cursor. It needs to be iterated over with a loop or an array method
        // ? instead use .toArray() to extrapolate the dara as an array
        let userList = await connect.find({}).toArray()
    } catch (error) {
        res.status(500).json({
            message: `Error: ${error}`
            
        })
    }
})

app.listen(PORT, HOST, () => {
    dbconnect()
    console.log(`[server] listening on ${HOST}:${PORT}`)
});


