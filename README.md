# Glaucoma Detection Web Application

### Frontend Setup
bash
``cd fyp/front-end``
``npm install``
``npm start``

### Java Backend Setup
bash
1. ``cd java_backend``
2. ``mvn clean install``
3. ``mvn spring-boot:run``

### ML Service Setup
bash
``cd fyp/flask_model_service``
``pip install -r requirements.txt``
``python app.py``

## Development

## Firebase Authentication Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" and follow setup wizard

### 2. Register Your Web App
1. In Firebase Console, click the web icon (</>)
2. Register app with a nickname
3. Copy the Firebase configuration:

### 6. Initialize Firebase
Create `front-end/src/firebase.jsx`:
```javascript
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};
 

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const analytics = getAnalytics(firebaseApp);
const db = getFirestore(firebaseApp);

export { firebaseApp, db, analytics };
```


### 3. Enable Authentication Methods
1. Go to Authentication > Sign-in method
2. Enable Email/Password
3. Enable Google Sign-in (optional)

### 4. Setup Firestore Database
1. Go to Firestore Database
2. Create database in test mode
3. Choose a location
4. Set up security rules:

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow read/write only for authenticated users
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

     match /{userId}/{documentId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}

```

### 7. Initialize firebase for python flask
1. go to firebase -> project settings -> service accounts
2. Select python 
3. select genarate new private key
4. Download that json file and place it inside flask_model_service/
5. make a copy of it and place it inside java_backend/src/main/resources/
![Glaucoma App](https://github.com/user-attachments/assets/4ecafac3-58cb-4762-a58c-45e5d6c70807)

