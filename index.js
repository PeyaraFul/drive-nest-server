const express = require("express");
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

    // app.patch("/features/:id", async (req, res) => {
    //   const id = req.params.id ;
    //   const updatedData = req.body;

    //   const result = await dataCollection.updateOne(
    //     {_id: new ObjectId(id)},
    //     {$set: updatedData}
    //   )
    //   res.send (result)
    // }) ;


    // app.delete("/features/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = {
    //     _id: new ObjectId(id)
    //   }
    //     const result = await dataCollection.deleteOne(query);
    //     res.send(result)
      
    // })




    // app.post("/features", async (req, res) => {
    //   const user = req.body;
    //   const result = await dataCollection.insertOne(user);

    //   console.log(result);
    //   res.send(result);
    // });
    



  } finally {
  }
};

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
