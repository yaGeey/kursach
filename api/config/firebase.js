import dotenv from 'dotenv';
dotenv.config();

const firebaseCredentials = {
   apiKey: process.env.FbapiKey,
   authDomain: process.env.FbauthDomain,
   projectId: process.env.FbprojectId,
   storageBucket: process.env.FbstorageBucket,
   messagingSenderId: process.env.FbmessagingSenderId,
   appId: process.env.FbappId,
   measurementId: process.env.FbmeasurementId
};

export default firebaseCredentials;