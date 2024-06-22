import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
});

const clientInstance = await client.connect();

const db = clientInstance.db("Test");

const UsersCollection = db.collection("Users");
const ProjectsCollection = db.collection("Projects");
const VideosCollection = db.collection("Videos");

export {
  clientInstance,
  db,
  UsersCollection,
  ProjectsCollection,
  ObjectId,
  VideosCollection,
};
