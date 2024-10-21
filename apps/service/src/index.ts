import express from "express";
import cors from "cors"
import fs from "fs";
import yaml from "yaml";
import path from 'path'
import { appsV1Api, coreV1Api, deleteDeployments, deleteSvc, getPods } from "./k8fns";
import rateLimit from "express-rate-limit";

const app=express();

const createPodLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many requests from this user, please try again later."
});

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
const port =4000;


const readAndParseKubeYaml = (filePath: string, replId: string): Array<any> => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  try {
    const docs = yaml.parseAllDocuments(fileContent).map((doc) => {
      if (doc.errors && doc.errors.length > 0) {
        console.error("YAML Parsing Errors:", doc.errors);
        throw new Error("Invalid YAML document");
      }
      
      let docString = doc.toString();
      
      // // const uniqueName = `${replId}-${Date.now()}`;
      // // const nameRegex = new RegExp(`nginx-deployment|nginx-service`, 'g');
      // // docString = docString.replace(nameRegex, uniqueName);

      // const namespaceRegex = new RegExp(`namespace: [a-zA-Z0-9-]+`, 'g');
      // docString = docString.replace(namespaceRegex, `namespace: ${replId}`);
      
      // console.log(docString);
      
      return yaml.parse(docString);
    });
    
    return docs;
  }catch (error) {
    console.error("Error parsing YAML:", error);
    throw error;
  }
}

app.get("/",(req,res)=>{
  res.send("hello world")
})


app.post('/create',createPodLimiter,async (req,res)=>{
  const { userId, replId } = req.body; 
    const namespace = "backend";

    try {
      const kubeManifests = readAndParseKubeYaml(path.join(__dirname, "../service2.yaml"), replId);
      for (const manifest of kubeManifests) {
          switch (manifest.kind) {
              case "Deployment":
                  await appsV1Api.createNamespacedDeployment(namespace, manifest);
                  break;
              case "Service":
                  await coreV1Api.createNamespacedService(namespace, manifest);
                  break;
              default:
                  console.log(`Unsupported kind: ${manifest.kind}`);
          }
      }
      res.status(200).send({ message: "Resources created successfully" });
  } catch (error) {
      console.error("Failed to create resources", error);
      res.status(500).send({ message: "Failed to create resources" });
  }
})

app.post("/getpods",async (req,res)=>{
  const {namespace}=req.body;
  try{
    const pods=await getPods(namespace);
    console.log(pods);
    
    res.json(pods).status(200);
  }catch(e){
    console.log("Error occucred while fetching pods",e);
    res.status(500).send({ message: "Failed get pods" });
  }
})

app.post('/deleteDeployment',async(req,res)=>{
  const {namespace }=req.body;
  try{
    const pods=await deleteDeployments(namespace);
    console.log(pods);
    
    res.json(pods).status(200);
  }catch(e){
    console.log("Error occucred while fetching pods",e);
    res.status(500).send({ message: "Failed to delete Deployments" });
  }
})


app.post('/deleteSvc', async (req, res) => {
  const { namespace, name } = req.body;
  try {
    const result = await deleteSvc(name, namespace);
    console.log(`Service ${name} deleted successfully in namespace ${namespace}`, result);
    
    res.status(200).json({ message: `Service ${name} deleted successfully in namespace ${namespace}` });
  } catch (e) {
    console.error("Error occurred while deleting the service", e);
    res.status(500).send({ message: "Failed to delete the service" });
  }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  