function EyeForm({
  eyeSide,
  setImage,
  setDioptre1,
  setDioptre2,
  setAstigmatism,
  setLens,
  setPneumatic,
  setPachymetry,
  setAxialLength,
  setVFMD,
}) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

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
        
        <label>Using lens:</label>
        <select onChange={(e) => setLens(e.target.value)}>
          <option value=""> Select type</option>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>

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