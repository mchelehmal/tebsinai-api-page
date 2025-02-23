// --- Password Protection ---
const correctPassword = "tebsinai123"; // Replace with your desired password
document.getElementById('loginButton').addEventListener('click', function() {
  const enteredPassword = document.getElementById('passwordInput').value;
  if (enteredPassword === correctPassword) {
    document.getElementById('loginContainer').style.display = "none";
    document.getElementById('mainContent').style.display = "block";
  } else {
    alert("Incorrect password. Please try again.");
  }
});

// --- Copy to Clipboard Functionality ---
document.getElementById('copyClipboard').addEventListener('click', function() {
  const analysisText = document.getElementById('aiAnalysis').value;
  navigator.clipboard.writeText(analysisText).then(() => {
    alert("AI Analysis copied to clipboard!");
  }, () => {
    alert("Failed to copy text.");
  });
});

// --- Send Request Functionality ---
document.getElementById('sendRequest').addEventListener('click', async function() {
  // Get input values
  const providerId = document.getElementById('providerId').value.trim();
  const encounterNumber = document.getElementById('encounterNumber').value.trim();
  const patientInput = document.getElementById('patientInput').value.trim();
  
  if (!providerId || !encounterNumber || !patientInput) {
    alert("Please fill in Provider ID, Encounter Number, and Patient Encounter Input.");
    return;
  }
  
  // Generate file name with providerId, encounterNumber, and current date/time
  const now = new Date();
  const formattedDateTime = now.toISOString().replace(/[:.]/g, "-"); // e.g. 2025-02-23T12-34-56-789Z
  const fileName = `${providerId}_${encounterNumber}_${formattedDateTime}`;
  
  try {
    // Simulate saving the note to AWS via an API call (placeholder endpoint)
    const saveResponse = await fetch('https://api.tebsinai.com/saveNote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName, content: patientInput })
    });
    if (!saveResponse.ok) throw new Error("Failed to save note.");
    
    // Trigger the AI API to analyze the note (placeholder endpoint)
    const analyzeResponse = await fetch('https://api.tebsinai.com/analyzeNote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName, content: patientInput })
    });
    if (!analyzeResponse.ok) throw new Error("Failed to analyze note.");
    
    const analysisResult = await analyzeResponse.json(); // Expecting { analysisText: "...", noteType: "MDM" } for example
    
    // Save the analysis result as a transcribed note (fileName + '_Transcribed')
    const transcribedFileName = fileName + '_Transcribed';
    const saveTranscribedResponse = await fetch('https://api.tebsinai.com/saveNote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: transcribedFileName, content: analysisResult.analysisText })
    });
    if (!saveTranscribedResponse.ok) throw new Error("Failed to save transcribed note.");
    
    // Populate the AI Analysis textarea with the analysis result
    document.getElementById('aiAnalysis').value = analysisResult.analysisText;
    
    // Optionally, store the note type (could be used to preselect in transcribed notes view)
    localStorage.setItem('lastNoteType', analysisResult.noteType || 'MDM');
    
  } catch (error) {
    alert("Error: " + error.message);
  }
});
