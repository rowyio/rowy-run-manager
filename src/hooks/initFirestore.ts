import {Firestore} from '@google-cloud/firestore'
import { asyncExecute } from '../terminalUtils';
import { firestoreRegions, tf_state_bucket } from './constants';
// Create a new client
const firestore = new Firestore();
const regionConverter = (region:string, serviceRegions:string[]) => {
    if (serviceRegions.includes(region)) {
      return region;
    } else {
      return serviceRegions.find((r) => r.split("-")[0] === region.split("-")[0]);
    }
  };
  const firestoreExists = async() =>{
      try {
          await firestore.collection("_rowy_").doc("existsCheck").set({value:"test"})
          await firestore.collection("_rowy_").doc("existsCheck").delete()
          return true
      } catch (error) {
         return false 
      }
  }
  
  const tf_application = "firestore"
  const tf_environment = "prod"
  const firestoreRegion = regionConverter(process.env.GOOGLE_CLOUD_REGION!, firestoreRegions);

  const tf_vars = `-var="project_id=${process.env.GOOGLE_CLOUD_PROJECT}" -var="region=${firestoreRegion}" -var="tf_state_bucket=${tf_state_bucket}" -var="application=${tf_application}" -var="environment=${tf_environment}"` 
  export const setupFirestore = async() => {
      const needsSetup = !(await firestoreExists())
      if(needsSetup){
      await asyncExecute(`terraform init -chdir=terraform/firestore ${tf_vars} -backend-config="bucket=${tf_state_bucket}" -backend-config="prefix=${tf_application}/${tf_environment}"`, () => {});
      return asyncExecute(`terraform apply -chdir=terraform/firestore -auto-approve ${tf_vars}`,()=>{})
       
      } else {
        console.log("Firestore already exists");
        return false
      }
  }
  setupFirestore()