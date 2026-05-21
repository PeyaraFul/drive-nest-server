const dns = require("node:dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setServers(["1.1.1.1", "1.0.0.1"]);
dns.setServers(["37.111.213.108"]);

const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.MONGODB_URI;

const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    await client.connect();

    await client.db("drive-nest").command({ ping: 1 });

    const database = client.db("drive-nest");
    const carCollection = database.collection("cars");
    const bookingCollection = database.collection("bookings");

    //getting all car data
    app.get("/car", async (req, res) => {
      // console.log(req.params.id)
      const cursor = carCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //getting car data by id
    app.get("/exploreCars/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await carCollection.findOne(query);
      res.send(result);
    });

    //getting car data by userid
    app.get("/car/user/:userId", async (req, res) => {
      const userId = req.params.userId;
      const result = await carCollection.find({ userId: userId }).toArray();
      res.send(result);
    });

    // add new car
    app.post("/car", async (req, res) => {
      const car = req.body;
      const result = await carCollection.insertOne(car);

      console.log(result);
      res.send(result);
    });

    //update car data
    app.patch("/car/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;

      const result = await carCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData },
      );
      res.send(result);
    });

    // getting booking data
    app.get("/booking", async (req, res) => {
      const cursor = bookingCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // getting booking data by id
    app.get("/myBookings/:id", async (req, res) => {
      const id = req.params.id;
      // console.log("id", req.params);
      const query = {
        _id: new ObjectId(id),
      };
    });

    //getting booking data by userId
    app.get("/booking/user/:userId", async (req, res) => {
      const userId = req.params.userId;
      const result = await bookingCollection.find({ userId: userId }).toArray();
      res.send(result);
    });

    //add booking data
    app.post("/booking", async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      console.log(result);
      res.send(result);
    });

    // delete my booking data cancel booking
    app.delete("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
};

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello world!");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
