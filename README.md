# Glaucoma Detection Web Application

A comprehensive web application for detecting glaucoma using deep learning and explainable AI techniques. The system analyzes retinal fundus images and tabular data about a patient and provides detailed insights with GradCAM and SHAP visualizations.

![Fusion of Data](mulitmodel.png)

## Features

- Dual eye analysis (left and right)
- Real-time image processing
- Explainable AI visualizations (GradCAM and SHAP)
- Detailed risk assessment and recommendations
- Patient history tracking
- Responsive design for all devices
- Secure user authentication

## Tech Stack

### Frontend
- React.js
- Material-UI
- React Router
- React Toastify
- React Spinners

### Backend
- Java Spring Boot (Main API)
- Flask (ML Service)
- TensorFlow/Keras (Deep Learning)
- SHAP (Explainable AI)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- Java JDK 11
- Python 3.8+
- Maven
- MySQL

### Frontend Setup
bash
``cd fyp/front-end_tumor``
``npm install``
``npm start``

### Java Backend Setup
bash
``cd fyp/java_backend``
``mvn clean install``
``java -jar target/glaucoma-app.jar``

### ML Service Setup
bash
``cd fyp/flask_model_service``
``pip install -r requirements.txt``
``python app.py``


## Usage

1. Register/Login to the system
2. Navigate to "Glaucoma Detection" from dashboard
3. Upload retinal fundus images for both eyes
4. Fill in patient information
5. Click "Analyze" to process images
6. View results with:
   - Diagnosis for each eye
   - Risk assessment
   - Recommendations
   - Explainable AI visualizations

## API Endpoints

### Main API (Java - Port 8080)
- POST `/api/v1/submit` - Submit images and patient data
- GET `/api/v1/history` - Get patient history

### ML Service (Flask - Port 5000)
- POST `/predict` - Get glaucoma predictions
- POST `/gradcam` - Generate GradCAM visualizations
- POST `/shap` - Generate SHAP values

## Development

### Environment Variables
Create `.env` files in respective directories:


## Firebase Authentication Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" and follow setup wizard

### 2. Register Your Web App
1. In Firebase Console, click the web icon (</>)
2. Register app with a nickname
3. Copy the Firebase configuration:


Add to src/firebase/config.js:
````const firebaseConfig = {
apiKey: "your-api-key",
authDomain: "your-app.firebaseapp.com",
projectId: "your-project-id",
storageBucket: "your-app.appspot.com",
messagingSenderId: "your-sender-id",
appId: "your-app-id",
measurementId: "your-measurement-id"
};
````

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
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /reports/{reportId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Install Firebase in Your React App
```bash
npm install firebase
npm install react-firebase-hooks
```

### 6. Initialize Firebase
Create `src/firebase/firebase.js`:
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Your config from step 2
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### 7. Firestore Collections Structure
```javascript
users/
  {userId}/
    email: string
    name: string
    createdAt: timestamp
    role: string

reports/
  {reportId}/
    userId: string
    leftEyeDiagnosis: string
    rightEyeDiagnosis: string
    timestamp: timestamp
    gradcamResults: {
      leftEye: string
      rightEye: string
    }
    shapResults: {
      leftEye: string
      rightEye: string
    }
```

### 8. Environment Variables
Add to your `.env` file:
```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### 9. Deploy Firebase Rules
```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy --only firestore:rules
```

