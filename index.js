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
    const dataCollection = database.collection("cars");

    app.get("/exploreCars", async (req, res) => {
      // console.log(req.params.id)
      const cursor = dataCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/exploreCars/:id", async (req, res) => {
      const id = req.params.id;
      // console.log("id", req.params);
      const query = {
        _id: new ObjectId(id),
      };

      console.log("query", query);
      const result = await dataCollection.findOne(query);

      res.send(result);
    });


    
    app.post("/exploreCars", async (req, res) => {
      const car = req.body;
      const result = await dataCollection.insertOne(car);

      console.log(result);
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
