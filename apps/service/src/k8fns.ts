import { KubeConfig, AppsV1Api, CoreV1Api } from "@kubernetes/client-node";

const kubeconfig = new KubeConfig();
kubeconfig.loadFromDefault();

export const k8sApi = kubeconfig.makeApiClient(CoreV1Api);
export const coreV1Api = kubeconfig.makeApiClient(CoreV1Api);
export const appsV1Api = kubeconfig.makeApiClient(AppsV1Api);

export const getPods = async (namespace: string) => {
  const res = await k8sApi.listNamespacedPod(namespace);
  return res.body.items;
};

export const deleteDeployments=async(namespace:string):Promise<void>=>{
  try{
    const res=await appsV1Api.deleteCollectionNamespacedDeployment(namespace);
    console.log(`Deployments in namespace ${namespace} deleted successfully`, res.body);
  }catch(e){
    console.log(e);
  }
}
export const deleteSvc=async(namespace:string,name:string):Promise<void>=>{
  try{
    const res=await coreV1Api.deleteNamespacedService(name,namespace);
    console.log(`Deployments in namespace ${namespace} deleted successfully`, res.body);
  }catch(e){
    console.log(e);
  }
}