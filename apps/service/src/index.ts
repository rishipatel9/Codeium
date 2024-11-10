import express from "express";
import cors from "cors";
import fs from "fs";
import yaml from "yaml";
import path from 'path';
import { appsV1Api, coreV1Api, deleteDeployments, deleteSvc, getPods } from "./k8fns";
import rateLimit from "express-rate-limit";

interface PortAllocation {
  mainPort: number;
  devPort: number;
  userId: string;
  timestamp: number;
}
let count=0;

class PortManager {
  private usedPorts: Set<number>;
  private portAllocations: Map<string, PortAllocation>;
  private readonly startPort: number = 30000;
  private readonly endPort: number = 32767;

  constructor() {
    this.usedPorts = new Set();
    this.portAllocations = new Map();
  }

  private findAvailablePortPair(): { mainPort: number; devPort: number } | null {
    for (let port = this.startPort; port < this.endPort - 1; port += 2) {
      if (!this.usedPorts.has(port) && !this.usedPorts.has(port + 1)) {
        return { mainPort: port, devPort: port + 1 };
      }
    }
    return null;
  }

  allocatePorts(userId: string): PortAllocation | null {
    this.cleanupOldAllocations();

    const ports = this.findAvailablePortPair();
    if (!ports) return null;

    const allocation: PortAllocation = {
      ...ports,
      userId,
      timestamp: Date.now()
    };

    this.usedPorts.add(ports.mainPort);
    this.usedPorts.add(ports.devPort);
    this.portAllocations.set(userId, allocation);

    return allocation;
  }

  private cleanupOldAllocations(maxAge: number = 3600000) { 
    const now = Date.now();
    for (const [userId, allocation] of this.portAllocations.entries()) {
      if (now - allocation.timestamp > maxAge) {
        this.usedPorts.delete(allocation.mainPort);
        this.usedPorts.delete(allocation.devPort);
        this.portAllocations.delete(userId);
      }
    }
  }

  releasePortsForUser(userId: string) {
    const allocation = this.portAllocations.get(userId);
    if (allocation) {
      this.usedPorts.delete(allocation.mainPort);
      this.usedPorts.delete(allocation.devPort);
      this.portAllocations.delete(userId);
    }
  }
}

const portManager = new PortManager();

const app = express();

const createPodLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
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
const port = 4000;

const modifyManifest = (manifest: any, portAllocation: PortAllocation, replId: string) => {
  manifest.metadata.name = `${manifest.metadata.name}-${replId}`;
  if (manifest.kind === 'Deployment') {
    manifest.spec.selector.matchLabels.instance = replId;
    manifest.spec.template.metadata.labels.instance = replId;
  }
  // if (manifest.kind === 'Service') {
  //   manifest.spec.ports = manifest.spec.ports.map((port: any, index: number) => ({
  //     ...port,
  //     nodePort: index === 0 ? portAllocation.mainPort : portAllocation.devPort
  //   }));
  // };
  return manifest;
}

const readAndParseKubeYaml = (filePath: string, replId: string, portAllocation: PortAllocation): Array<any> => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  try {
    const docs = yaml.parseAllDocuments(fileContent).map((doc) => {
      if (doc.errors && doc.errors.length > 0) {
        console.error("YAML Parsing Errors:", doc.errors);
        throw new Error("Invalid YAML document");
      }
      
      let parsedDoc = yaml.parse(doc.toString());
      return parsedDoc
      // return modifyManifest(parsedDoc, portAllocation, replId);
    });
    
    return docs;
  } catch (error) {
    console.error("Error parsing YAML:", error);
    throw error;
  }
};

app.post('/create', createPodLimiter, async (req, res) => {
  const { userId, replId } = req.body;
  const namespace = "backend";
  // count+=1;
  // console.log(count)
  // return res.status(200).send({
  //   message: "Resources created successfully",
  // });

  try {
    const portAllocation = portManager.allocatePorts(userId);
    if (!portAllocation) {
      return res.status(503).send({ message: "No available ports" });
    }

    const kubeManifests = readAndParseKubeYaml(
      path.join(__dirname, "../service3.yaml"),
      replId,
      portAllocation
    );

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

    res.status(200).send({
      message: "Resources created successfully",
      ports: {
        mainPort: portAllocation.mainPort,
        devPort: portAllocation.devPort
      }
    });
  } catch (error) {
    console.error("Failed to create resources", error);
    if (userId) {
      portManager.releasePortsForUser(userId);
    }
    res.status(500).send({ message: "Failed to create resources" });
  }
});

app.post("/getpods", async (req, res) => {
  const { namespace } = req.body;
  try {
    const pods = await getPods(namespace);
    res.json(pods).status(200);
  } catch (e) {
    console.error("Error occurred while fetching pods", e);
    res.status(500).send({ message: "Failed to get pods" });
  }
});

app.post('/deleteDeployment', async (req, res) => {
  const { namespace, userId } = req.body;
  try {
    const pods = await deleteDeployments(namespace);
    if (userId) {
      portManager.releasePortsForUser(userId);
    }
    res.json(pods).status(200);
  } catch (e) {
    console.error("Error occurred while deleting deployments", e);
    res.status(500).send({ message: "Failed to delete Deployments" });
  }
});

app.post('/deleteSvc', async (req, res) => {
  const { namespace, name, userId } = req.body;
  try {
    const result = await deleteSvc(name, namespace);
    if (userId) {
      portManager.releasePortsForUser(userId);
    }
    res.status(200).json({ 
      message: `Service ${name} deleted successfully in namespace ${namespace}` 
    });
  } catch (e) {
    console.error("Error occurred while deleting the service", e);
    res.status(500).send({ message: "Failed to delete the service" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});