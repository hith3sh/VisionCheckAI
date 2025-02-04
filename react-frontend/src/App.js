import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Results from './components/Results';
import './App.css';

function App() {
// State for left eye inputs
const [leftImage, setLeftImage] = useState(null);
const [leftDioptre1, setLeftDioptre1] = useState('');
const [leftDioptre2, setLeftDioptre2] = useState('');
const [leftAstigmatism, setLeftAstigmatism] = useState('');
const [leftLens, setLeftLens] = useState('');
const [leftPneumatic, setLeftPneumatic] = useState('');
const [leftPachymetry, setLeftPachymetry] = useState('');
const [leftAxialLength, setLeftAxialLength] = useState('');
const [leftVFMD, setLeftVFMD] = useState('');

// State for right eye inputs
const [rightImage, setRightImage] = useState(null);
const [rightDioptre1, setRightDioptre1] = useState('');
const [rightDioptre2, setRightDioptre2] = useState('');
const [rightAstigmatism, setRightAstigmatism] = useState('');
const [rightLens, setRightLens] = useState('');
const [rightPneumatic, setRightPneumatic] = useState('');
const [rightPachymetry, setRightPachymetry] = useState('');
const [rightAxialLength, setRightAxialLength] = useState('');
const [rightVFMD, setRightVFMD] = useState('');
// state for general inputs
const [age, setAge] = useState('');
const [gender, setGender] = useState('');


  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
          setLeftImage={setLeftImage} 
          setRightImage={setRightImage} 
          setAge={setAge} 
          setGender={setGender} 
          setLeftDioptre1={setLeftDioptre1}
          setRightDioptre1={setRightDioptre1}
          setLeftDioptre2={setLeftDioptre2}
          setRightDioptre2={setRightDioptre2}
          setLeftAstigmatism={setLeftAstigmatism}
          setRightAstigmatism={setRightAstigmatism}
          setLeftLens={setLeftLens}
          setRightLens={setRightLens}
          setLeftPneumatic={setLeftPneumatic}
          setRightPneumatic={setRightPneumatic}
          setLeftPachymetry={setLeftPachymetry}
          setRightPachymetry={setRightPachymetry}
          setLeftAxialLength={setLeftAxialLength}
          setRightAxialLength={setRightAxialLength}
          setLeftVFMD={setLeftVFMD}
          setRightVFMD={setRightVFMD}
          leftImage={leftImage}
          rightImage={rightImage}
          age={age}
          gender={gender}
          leftDioptre1={leftDioptre1}
          rightDioptre1={rightDioptre1}
          leftDioptre2={leftDioptre2}
          rightDioptre2={rightDioptre2}
          leftAstigmatism={leftAstigmatism}
          rightAstigmatism={rightAstigmatism}
          leftLens={leftLens}
          rightLens={rightLens}
          leftPneumatic={leftPneumatic}
          rightPneumatic={rightPneumatic}
          leftPachymetry={leftPachymetry}
          rightPachymetry={rightPachymetry}
          leftAxialLength={leftAxialLength}
          rightAxialLength={rightAxialLength}
          leftVFMD={leftVFMD}
          rightVFMD={rightVFMD}
            />
        }
      />
      <Route
        path="/results"
        element={
          <Results
          leftImage={leftImage} 
          rightImage={rightImage} 
          age={age}
          gender={gender}
          leftDioptre1={leftDioptre1}
          rightDioptre1={rightDioptre1}
          leftDioptre2={leftDioptre2}
          rightDioptre2={rightDioptre2}
          leftAstigmatism={leftAstigmatism}
          rightAstigmatism={rightAstigmatism}
          setRightLens={setRightLens}
          setLeftLens={setLeftLens}
          leftPneumatic={leftPneumatic}
          rightPneumatic={rightPneumatic}
          leftPachymetry={leftPachymetry}
          rightPachymetry={rightPachymetry}
          leftAxialLength={leftAxialLength}
          rightAxialLength={rightAxialLength}
          leftVFMD={leftVFMD}
          rightVFMD={rightVFMD}
          />
        }
      />
    </Routes>
  );
}

export default App;
