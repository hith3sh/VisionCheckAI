import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';
import './history.css';

const getValuesBasedOnGlaucomaState = (glaucomaState) => {
  let riskScore, explanation, recommendation;
  switch (glaucomaState) {
      case 'advanced glaucoma':
          riskScore = 'High(61-100%)';
          explanation = 'The model detected significant optic nerve damage, with a severely increased cup-to-disc ratio and substantial visual field loss. Patients may experience noticeable vision impairment, including blind spots or tunnel vision. Intraocular pressure is often elevated';
          recommendation = 'Immediate consultation with an ophthalmologist is crucial. Treatment options such as prescription eye drops, laser therapy (trabeculoplasty), or surgical intervention (trabeculectomy, shunt placement) should be considered. Frequent monitoring (every 1-3 months) is essential to prevent further progression.';
          break;
      case 'early glaucoma':
          riskScore = 'Moderate(21-60%)';
          explanation = 'The model identified an elevated cup-to-disc ratio, suggesting early signs of optic nerve damage. Mild visual field defects may be present, though symptoms are often not noticeable at this stage. Intraocular pressure may be slightly elevated or within the normal range (normal-tension glaucoma).';
          recommendation = 'It is recommended to monitor intraocular pressure regularly and schedule a follow-up in 6 months. Lifestyle modifications, such as maintaining a healthy diet, avoiding excessive caffeine, and staying hydrated, can be beneficial.';
          break;
      case 'normal control':
          riskScore = 'Low(0-20%)';
          explanation = 'No significant abnormalities detected. The cup-to-disc ratio is within a normal range, and there is no apparent optic nerve damage. Intraocular pressure (IOP) is within a healthy range.';
          recommendation = 'Maintain regular eye check-ups every 1-2 years, especially if there is a family history of glaucoma or other risk factors such as diabetes or high blood pressure.';
          break;
      default:
          riskScore = 'Unknown';
          explanation = 'The glaucoma state is unknown.';
          recommendation = 'Consult an ophthalmologist for further evaluation.';
          break;
  }
  return { riskScore, explanation, recommendation };
};


const History = () => {
  const [reports, setReports] = useState([]); // Store fetched reports
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate(); // For navigation to login page
  const userID = ''
  const baseBackendUrl = import.meta.env.VITE_PYTHON_BACKEND_URL;
  // Fetch reports from Firestore for the authenticated user
  const fetchReports = async (user) => {
    if (!user) {
      console.log("No user is authenticated.");
      setLoading(false);
      navigate('/login');
      return;
    }

    try {
      const db = getFirestore();
      const collectionRef = collection(db, user.uid); // Collection named after user's UID
      const querySnapshot = await getDocs(collectionRef);

      if (querySnapshot.empty) {
        console.log("No reports found!");
        setReports([]);
        setLoading(false);
        return;
      }

      let fetchedReports = querySnapshot.docs.map((doc, index) => {
        const results = doc.data().result || {};
        let scanDate = new Date();
        return {
          scanNo: index + 1,
          date: scanDate,
          formData: doc.data().formData || {},
          results,
        };
      });

      // Sort reports by date and reassign scan numbers
      fetchedReports.sort((a, b) => a.date - b.date);
      fetchedReports.forEach((report, index) => {
        report.scanNo = index + 1;
      });

      setReports(fetchedReports);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  // Set up authentication state listener
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchReports(user); // Fetch reports if user is authenticated
      } else {
        navigate('/login'); // Redirect to login if not authenticated
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  // Generate and download the PDF report
  const generatePDFReport = async (formData, result) => {
    const auth = getAuth();
    const userID = auth.currentUser.uid; // Get user ID from current authenticated user
    const doc = new jsPDF();
  
    // Constants for page management
    const pageHeight = 595; // A4 height in points (portrait)
    const marginBottom = 10; // Space to leave at the bottom of each page
    const maxY = pageHeight - marginBottom; // Maximum y-position before adding a new page
  
    // Log data for debugging
    // Add patient details
    doc.setFontSize(12);
    let yPosition = 10; // Starting y-position
  
    // Function to check and add new page if needed
    const checkPage = (requiredSpace) => {
      if (yPosition + requiredSpace > maxY) {
        doc.addPage();
        yPosition = 10; // Reset to top of new page
      }
    };
  
    
    doc.setFontSize(15); 
    doc.text("Patient Details", 10, yPosition);
    doc.line(10, yPosition + 2, 60, yPosition + 2); 

    doc.setFontSize(12);
    yPosition += 10;
    checkPage(10);
    doc.text(`Age: ${formData.age || 'N/A'}`, 10, yPosition);
    yPosition += 10;
    checkPage(10);
    doc.text(`Gender: ${formData.gender || 'N/A'}`, 10, yPosition);
    yPosition += 10;
    checkPage(10);
  
    
    checkPage(20);
    doc.setFontSize(15);
    doc.text("Results", 10, yPosition);
    doc.line(10, yPosition + 2, 60, yPosition + 2); 

    doc.setFontSize(12);
    yPosition += 10;
    checkPage(10);
    doc.text(`Left Eye Glaucoma: ${result.glaucoma_state_left_eye || 'N/A'}`, 10, yPosition);
    doc.line(10, yPosition + 2, 60, yPosition + 2); 
    yPosition += 10;
    
    const maxWidth = 180;
    const left_eye_state = result.glaucoma_state_left_eye;
    const { riskScore: leftRiskScore, explanation: leftExplanation, recommendation: leftRecommendation } = getValuesBasedOnGlaucomaState(left_eye_state);
    doc.text(leftRiskScore, 10, yPosition);
    yPosition += 10;

    const leftExplanation_text = doc.splitTextToSize(leftExplanation, maxWidth);
    doc.text(leftExplanation_text, 10, yPosition);
    yPosition += 10;

    const leftRecommendation_text = doc.splitTextToSize(leftRecommendation, maxWidth);
    doc.text(leftRecommendation_text, 10, yPosition);
    yPosition +=leftRecommendation_text.length* 4;
    yPosition += 10;
    
    checkPage(10);
    doc.text(`Right Eye Glaucoma: ${result.glaucoma_state_right_eye || 'N/A'}`, 10, yPosition);
    doc.line(10, yPosition + 2, 60, yPosition + 2); 
    yPosition += 10;
  
    const right_eye_state = result.glaucoma_state_right_eye;
    const { riskScore: rightRiskScore, explanation: rightExplanation, recommendation: rightRecommendation } = getValuesBasedOnGlaucomaState(right_eye_state);
    doc.text(rightRiskScore, 10, yPosition);
    yPosition += 10;

    
    const right_wrappedText = doc.splitTextToSize(rightExplanation, maxWidth);
    doc.text(right_wrappedText, 10, yPosition); 
    yPosition += right_wrappedText.length * 4;

    // doc.text(rightExplanation, 10, yPosition);
    yPosition += 10;
    const right_explanation_wrappedText = doc.splitTextToSize(rightExplanation, maxWidth);
    doc.text(right_explanation_wrappedText, 10, yPosition);
    yPosition += right_explanation_wrappedText.length * 6;

    // Define base paths for images
    const gradcamBaseUrl = `${baseBackendUrl}/assets/gradcam_assets/`;
    const shapBaseUrl    = `${baseBackendUrl}/assets/shap_assets/`;
  
    // Utility to compute side by side image settings
    const getSideBySideSettings = (doc, gap = 10, margin = 10) => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const availableWidth = pageWidth - 2 * margin - gap;
      const imageWidth = availableWidth / 3;
      return { margin, gap, imageWidth };
    };
  
    // ---- GradCAM Images (Side by Side) ----
    // Check that both paths exist before trying side by side placement
    if (result.left_gradcam_path && result.right_gradcam_path) {
      const { margin, gap, imageWidth } = getSideBySideSettings(doc);
      const imageHeight = 40; // Adjust as needed
  
      // Ensure enough space on page for labels and images
      checkPage(imageHeight + 20);
  
      // Add labels for both images on the same row
      doc.text("Left Eye GradCAM", margin, yPosition);
      doc.text("Right Eye GradCAM", margin + imageWidth + gap, yPosition);
      yPosition += 10; // Move down for the images
  
      try {
        // Get both images in parallel
        const leftImagePath = `${gradcamBaseUrl}${result.left_gradcam_path}`;
        const rightImagePath = `${gradcamBaseUrl}${result.right_gradcam_path}`;
        const [leftImageBase64, rightImageBase64] = await Promise.all([
          fetchImageAsBase64(leftImagePath),
          fetchImageAsBase64(rightImagePath)
        ]);
  
        // Place the left and right images side by side
        doc.addImage(leftImageBase64, 'PNG', margin, yPosition, imageWidth, imageHeight);
        doc.addImage(rightImageBase64, 'PNG', margin + imageWidth + gap, yPosition, imageWidth, imageHeight);
        yPosition += imageHeight + 10; // Update yPosition after images
      } catch (error) {
        console.error("Error fetching one or both GradCAM images:", error);
        checkPage(10);
        doc.text("GradCAM image(s) not available", margin, yPosition);
        yPosition += 10;
      }
    } else {
      // Fallback if one or both GradCAM image paths are missing
      checkPage(10);
      doc.text("One or both GradCAM images not available", 10, yPosition);
      yPosition += 10;
    }
  
    // ---- SHAP Images (Side by Side) ----
    // Check that both paths exist before trying side by side placement
    if (result.left_shap_path && result.right_shap_path) {
      const { margin, gap, imageWidth } = getSideBySideSettings(doc);
      const imageHeight = 40; // Adjust as needed
  
      // Ensure enough space on page for labels and images
      checkPage(imageHeight + 20);
  
      // Add labels for both images on the same row
      doc.text("Left Eye SHAP", margin, yPosition);
      doc.text("Right Eye SHAP", margin + imageWidth + gap, yPosition);
      yPosition += 10; // Move down for the images
  
      try {
        // Get both images in parallel
        const leftImagePath = `${shapBaseUrl}${result.left_shap_path}`;
        const rightImagePath = `${shapBaseUrl}${result.right_shap_path}`;
        const [leftImageBase64, rightImageBase64] = await Promise.all([
          fetchImageAsBase64(leftImagePath),
          fetchImageAsBase64(rightImagePath)
        ]);
  
        // Place the left and right images side by side
        doc.addImage(leftImageBase64, 'PNG', margin, yPosition, imageWidth, imageHeight);
        doc.addImage(rightImageBase64, 'PNG', margin + imageWidth + gap, yPosition, imageWidth, imageHeight);
        yPosition += imageHeight + 10; // Update yPosition after images
      } catch (error) {
        console.error("Error fetching one or both SHAP images:", error);
        checkPage(10);
        doc.text("SHAP image(s) not available", margin, yPosition);
        yPosition += 10;
      }
    } else {
      // Fallback if one or both SHAP image paths are missing
      checkPage(10);
      doc.text("One or both SHAP images not available", 10, yPosition);
      yPosition += 10;
    }
  
    // Save the PDF with a timestamped filename
    doc.save(`report_${new Date().toISOString()}.pdf`);
  };
  

  // Fetch image and convert to base64
  const fetchImageAsBase64 = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Render the component
return (
    <div className="hframe">
      <h2 className="upload-history">Report History</h2>
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : reports.length === 0 ? (
        <div className="empty-state">
        <img src="/assets/no-reports.webp" alt="No Reports Available" className="empty-icon" />
        <h3>No reports found...</h3>
      </div>
      ) : (
        <table className="htable">
          <thead className="thead-dark">
            <tr>
              <th>Scan No.</th>
              <th>Date</th>
              <th>Download Report</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={index}>
                <td>{report.scanNo}</td>
                <td>{report.date.toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => generatePDFReport(report.formData, report.results)}
                  >
                    Download Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button className="dashboard-btn" onClick={() => navigate('/dashboard')}>
      Go Back
    </button>
    </div>
  );
}

export default History;