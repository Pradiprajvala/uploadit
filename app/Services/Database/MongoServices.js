import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
const uri =
  "mongodb+srv://youtube:CY5UAI4CMJRDDT0f@videos.v8flqyx.mongodb.net/?retryWrites=true&w=majority&appName=Videos";
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
