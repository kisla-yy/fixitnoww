// src/components/ComplaintsTab.jsx
import React, { useState, useRef, useEffect } from "react";
import { Camera, Upload, Mic } from "lucide-react";

export default function ComplaintsTab() {
  const [step, setStep] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [issueText, setIssueText] = useState("");
  const [listening, setListening] = useState(false);
  const [stream, setStream] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [aiResult, setAiResult] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Start camera
  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setStep(1);
    } catch (err) {
      console.error("Camera error:", err);
      alert("Camera access denied or not available.");
    }
  };

  useEffect(() => {
    if (videoRef.current && stream) {
      const video = videoRef.current;
      video.srcObject = stream;
      video.addEventListener("loadedmetadata", () => video.play());
      return () => video.removeEventListener("loadedmetadata", () => video.play());
    }
  }, [stream]);

  // Capture photo
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setPhoto(canvas.toDataURL("image/png"));
    stream.getTracks().forEach((track) => track.stop());
    setStream(null);
  };

  // Voice input
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice recognition not supported");

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setListening(true);
    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setIssueText(transcript);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  // Submit complaint
  const handleSubmit = async () => {
    if (!issueText.trim()) return alert("Enter or speak issue.");
    if (!photo) return alert("Capture or upload a photo.");

    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const { latitude, longitude } = coords;

      try {
        let file;

        if (photo.startsWith("data:")) {
          // Compress camera image
          const blob = await new Promise((resolve) =>
            canvasRef.current.toBlob(
              (b) => resolve(b),
              "image/jpeg",
              0.7 // 70% quality
            )
          );
          file = new File([blob], "complaint.jpg", { type: "image/jpeg" });
        } else {
          const res = await fetch(photo);
          const blob = await res.blob();
          file = new File([blob], "complaint.png", { type: blob.type });
        }

        const formData = new FormData();
        formData.append("text", issueText);
        formData.append("image", file);
        formData.append("lat", latitude);
        formData.append("lng", longitude);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://fixitnoww-production.up.railway.app/api/classify");

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setUploadProgress(Math.round((event.loaded / event.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            const resData = JSON.parse(xhr.response);
            setAiResult(resData.result); // show AI classification
            alert(`Complaint submitted! Category: ${resData.result.parts?.text?.label || resData.result.label}`);
            setStep(0);
            setPhoto(null);
            setIssueText("");
            setUploadProgress(0);
          } else {
            alert("Upload failed. Try again.");
          }
        };

        xhr.onerror = () => alert("Upload error.");
        xhr.send(formData);
      } catch (err) {
        console.error(err);
        alert("Failed to submit complaint.");
      }
    }, () => alert("Location access required."));
  };

  return (
    <div className="flex-1 p-6 flex justify-center items-start">
      <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-8 w-full max-w-md border border-violet-200">
        <h2 className="text-2xl font-bold text-center text-violet-700 mb-6">Raise a Complaint</h2>

        {step === 0 && (
          <div className="space-y-4">
            <button onClick={openCamera} className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-violet-400 to-purple-500 text-white font-semibold rounded-xl shadow-md hover:scale-105 hover:shadow-xl transition-transform">
              <Camera className="w-6 h-6" /> Open Camera
            </button>

            <label htmlFor="upload" className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-pink-400 to-rose-500 text-white font-semibold rounded-xl shadow-md hover:scale-105 hover:shadow-xl transition-transform cursor-pointer">
              <Upload className="w-6 h-6" /> Upload Image
            </label>
            <input
              type="file"
              id="upload"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) setPhoto(URL.createObjectURL(file));
                setStep(1);
              }}
            />
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            {!photo && stream && (
              <div className="relative">
                <video ref={videoRef} className="rounded-lg w-full" autoPlay />
                <button onClick={capturePhoto} className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-violet-600 text-white px-4 py-2 rounded-lg">
                  Capture
                </button>
              </div>
            )}

            {photo && <img src={photo} alt="Captured" className="rounded-lg w-full" />}

            <textarea
              value={issueText}
              onChange={(e) => setIssueText(e.target.value)}
              placeholder="Describe the issue (text or voice input)"
              className="w-full border border-violet-200 rounded-lg p-2 resize-none"
              rows={4}
            />

            <button
              onClick={startListening}
              disabled={listening}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-400 to-violet-500 text-white font-semibold rounded-xl shadow-md hover:scale-105 hover:shadow-xl transition-transform"
            >
              <Mic className="w-6 h-6" /> {listening ? "Listening..." : "Voice Input"}
            </button>

            <button
              onClick={handleSubmit}
              className="w-full px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition"
            >
              Submit Complaint
            </button>

            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-violet-600 h-2 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            )}

            {aiResult && (
              <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg">
                <strong>AI Category:</strong> {aiResult.parts?.text?.label || aiResult.label}
              </div>
            )}

            <canvas ref={canvasRef} className="hidden"></canvas>
          </div>
        )}
      </div>
    </div>
  );
}
