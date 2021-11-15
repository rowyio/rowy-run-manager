import {Firestore} from '@google-cloud/firestore'
import { asyncExecute } from '../terminalUtils';
import { firestoreRegions, tf_state_bucket } from './constants';
import {admin} from '../firebaseConfig'
// Create a new client
const firestore = new Firestore();
const firestoreBaseRuleSet = `rules_version = '2'
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow admins to read and write all documents
    match /{document=**} {
      allow read, write: if hasAnyRole(["ADMIN", "OWNER"]);
    }

    // Rowy: Allow signed in users to read Rowy configuration and admins to write
    match /_rowy_/{docId} {
      allow read: if request.auth != null;
      allow write: if hasAnyRole(["ADMIN", "OWNER"]);
    	match /{document=**} {
        allow read: if request.auth != null;
        allow write: if hasAnyRole(["ADMIN", "OWNER"]);
      }
    }
    // Rowy: Allow users to edit their settings
    match /_rowy_/userManagement/users/{userId} {
      allow get, update, delete: if isDocOwner(userId);
      allow create: if request.auth != null;
    }
    // Rowy: Allow public to read public Rowy configuration
    match /_rowy_/publicSettings {
    	allow get: if true;
    }

    // Rowy: Utility functions
    function isDocOwner(docId) {
      return request.auth != null && (request.auth.uid == resource.id || request.auth.uid == docId);
    }
    function hasAnyRole(roles) {
      return request.auth != null && request.auth.token.roles.hasAny(roles);
    }

    // Allow admins to read and write all documents
    match /{document=**} {
      allow read, write: if false
    }

  }
}`

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
        await asyncExecute(`terraform -v`,()=>{})
        await asyncExecute(`terraform -chdir=terraform/firestore init ${tf_vars} -backend-config="bucket=${tf_state_bucket}" -backend-config="prefix=${tf_application}/${tf_environment}"`, () => {});
        await asyncExecute(`terraform -chdir=terraform/firestore apply -auto-approve ${tf_vars}`,()=>{})
        const securityRules = admin.securityRules();
        await securityRules.releaseFirestoreRulesetFromSource(firestoreBaseRuleSet);
      return true
      } else {
        console.log("Firestore already exists");
        return false
      }
  }
  setupFirestore()