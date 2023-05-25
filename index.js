const express= require('express')

const cors = require('cors');

const app=express()
require ('dotenv').config()

const port =process.env.PORT || 5000;

app.use(cors())

app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ravtcpm.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    // Send a ping to confirm a successful connection
    const db=client.db("ToyDB");
    const ToyCollection=db.collection("toyCollection");
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    app.post("/toys",async (req,res)=>{

      const body=req.body;
      const result = await ToyCollection.insertOne(body)
      res.send()

    })

    app.get('/alltoys',async(req,res)=>{

      const result=await ToyCollection.find({}).toArray()
      res.send(result);

    })


    app.get('/mytoys/:email',async(req,res)=>{

      
      console.log(req.params.email)
     const result=await ToyCollection.find({email : req.params.email}).toArray()
     res.send(result)


    })

    app.get('/toydetails/:id',async(req,res)=>{

     const id=req.params.id
      console.log(req.params.id)
     const result=await ToyCollection.find({_id : new ObjectId(id)}).toArray()
     res.send(result)


    })

    app.delete('/toys/:id',async(req,res)=>{

      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result= await ToyCollection.deleteOne(query)
      res.send(result)



    })


    // SEARCH API
    app.get("/toySearchByName/:text",async(req,res) => {
      const searchText = req.params.text;

      const result = await ToyCollection.find({
        $or: [
          {name: {$regex: searchText, $options: "i"}},
        ]
      }).toArray()
      res.send(result)
    })

    app.put('/updatejob/:id',async(req,res)=>{

      const id=req.params.id
      const body=req.body
      const filter={_id: new ObjectId(id)}
      const updatedDoc={
        $set:{
          price:body.price,
          quantity:body.quantity,
          description:body.description
          

        }
      }

      const result=await ToyCollection.updateOne(filter,updatedDoc);
      res.send(result)


    })


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send("simple crud is running")
})


app.listen(port,()=>{
    console.log('server is running on port 5000')
})