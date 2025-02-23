// Simulated file data for files created in the past 24 hours
const fileData = {
    sampleFile1: {
      patientInput: "Patient encounter details for sampleFile1...",
      aiAnalysis: "AI analysis result for sampleFile1...",
      noteType: "MDM"
    },
    sampleFile2: {
      patientInput: "Patient encounter details for sampleFile2...",
      aiAnalysis: "AI analysis result for sampleFile2...",
      noteType: "Progress Note"
    },
    sampleFile3: {
      patientInput: "Patient encounter details for sampleFile3...",
      aiAnalysis: "AI analysis result for sampleFile3...",
      noteType: "Consult Note"
    }
  };
  
  // When a file is clicked, populate the encounter and analysis columns
  document.querySelectorAll('#fileList li').forEach(item => {
    item.addEventListener('click', () => {
      const fileKey = item.getAttribute('data-file');
      const file = fileData[fileKey];
      if (file) {
        document.getElementById('filePatientInput').value = file.patientInput;
        document.getElementById('fileAIAnalysis').value = file.aiAnalysis;
        document.getElementById('noteTypeSelect').value = file.noteType;
        // Save the current file key for later use (regeneration)
        localStorage.setItem('currentFile', fileKey);
      }
    });
  });
  
  // Regenerate note: send patient encounter back to API with the selected note type
  document.getElementById('regenerateNote').addEventListener('click', async function() {
    const fileKey = localStorage.getItem('currentFile');
    if (!fileKey) {
      alert("Please select a file first.");
      return;
    }
    const newNoteType = document.getElementById('noteTypeSelect').value;
    const patientInput = document.getElementById('filePatientInput').value;
    
    try {
      // Simulated API call to regenerate the AI note based on the new note type
      const response = await fetch('https://api.tebsinai.com/regenerateNote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileKey: fileKey,
          noteType: newNoteType,
          content: patientInput
        })
      });
      if (!response.ok) {
        throw new Error("Failed to regenerate note.");
      }
      const result = await response.json(); // Expected to return { aiAnalysis: "New AI analysis..." }
      
      // Update the AI Analysis text area with the new result
      document.getElementById('fileAIAnalysis').value = result.aiAnalysis;
      
      // Optionally, update the simulated fileData for this file
      fileData[fileKey].aiAnalysis = result.aiAnalysis;
      fileData[fileKey].noteType = newNoteType;
    } catch (error) {
      alert("Error: " + error.message);
    }
  });
  
