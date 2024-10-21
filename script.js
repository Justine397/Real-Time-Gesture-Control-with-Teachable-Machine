let model, webcam, maxPredictions;

// Load the Teachable Machine model
async function init() {
  const modelURL = "model/model.json"; 
  const metadataURL = "model/metadata.json"; 

  // Load the model and metadata using the Teachable Machine API
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Setup webcam
  const flip = true;
  webcam = new tmImage.Webcam(200, 200, flip); 
  await webcam.setup(); // Request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop);

  // Attach the webcam canvas to the page
  document.getElementById('webcam').appendChild(webcam.canvas);
}

// Continuous loop to get predictions
async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

// Predict based on webcam input
async function predict() {
  const prediction = await model.predict(webcam.canvas);

  // Find the prediction with the highest probability
  let highestPrediction = { className: "", probability: 0 };
  for (let i = 0; i < prediction.length; i++) {
    if (prediction[i].probability > highestPrediction.probability) {
      highestPrediction = prediction[i];
    }
  }

  const predictedClass = highestPrediction.className.trim(); 

  // Change background color and text based on the prediction
  const statusDiv = document.getElementById('status');

  if (predictedClass === "Go") {
    document.body.style.backgroundColor = "blue";
    statusDiv.textContent = "Go";
  } else if (predictedClass === "Stop") {
    document.body.style.backgroundColor = "red";
    statusDiv.textContent = "Stop";
  } else if (predictedClass === "Neutral") {
    document.body.style.backgroundColor = "white";
    statusDiv.textContent = "Waiting for input...";
  }
}

init();