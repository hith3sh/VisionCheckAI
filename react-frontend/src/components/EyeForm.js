//import React, { useState } from 'react';

function EyeForm({
  eyeSide, // "Left" or "Right"
  setImage,
  setDioptre1,
  setDioptre2,
  setAstigmatism,
  setPhakicPseudophakic,
  setPneumatic,
  setPachymetry,
  setAxialLength,
  setVFMD,
}) {
  //const [preview, setPreview] = useState(null); 

  const handleFileChange = (e) =>{
    const file = e.target.files[0];// getting actual file
    if (file){
      setImage(file); //storing file for FormData
      //setPreview(URL.createObjectURL(file)); // storing preview url
    }
  }
  return (
    <div className="column">
      <h3>{eyeSide} Eye</h3>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      <div className="input-container">
        <label>Dioptre 1:</label>
        <input type="number" onChange={(e) => setDioptre1(e.target.value)} />

        <label>Dioptre 2:</label>
        <input type="number" onChange={(e) => setDioptre2(e.target.value)} />

        <label>Astigmatism:</label>
        <input type="number" onChange={(e) => setAstigmatism(e.target.value)} />

        <label>Lens:</label>
        <input type="number" onChange={(e) => setPhakicPseudophakic(e.target.value)} />

        <label>Pneumatic:</label>
        <input type="number" onChange={(e) => setPneumatic(e.target.value)} />

        <label>Pachymetry:</label>
        <input type="number" onChange={(e) => setPachymetry(e.target.value)} />

        <label>Axial Length:</label>
        <input type="number" onChange={(e) => setAxialLength(e.target.value)} />

        <label>VFMD:</label>
        <input type="number" onChange={(e) => setVFMD(e.target.value)} />
      </div>
    </div>
  );
}

export default EyeForm;
