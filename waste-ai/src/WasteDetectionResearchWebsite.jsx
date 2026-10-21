import { useState } from "react";

export default function WasteDetectionResearchWebsite() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult("");
    setConfidence("");
    setError("");
  }

  async function handlePredict() {
    if (!selectedFile) {
      setError("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");
    setConfidence("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Backend response:", data);

      if (!response.ok) {
        setError(data.error || "Prediction failed.");
      } else {
        setResult(data.predicted_class || "No prediction returned");
        setConfidence(
          data.confidence !== undefined && data.confidence !== null
            ? (data.confidence * 100).toFixed(2) + "%"
            : ""
        );
      }
    } catch (err) {
      console.error(err);
      setError("Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-slate-900 p-8">
        <h1 className="text-3xl font-bold text-emerald-400">WasteVision AI</h1>
        <p className="mt-2 text-slate-300">
          Upload a waste image and get a real prediction.
        </p>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-6 block w-full text-sm text-slate-300"
        />

        {previewUrl && (
          <div className="mt-6">
            <p className="mb-2 text-sm text-slate-400">Preview</p>
            <img
              src={previewUrl}
              alt="Uploaded preview"
              className="w-64 rounded-xl border border-white/10"
            />
          </div>
        )}

        <button
          onClick={handlePredict}
          className="mt-6 rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950"
          disabled={loading}
        >
          {loading ? "Predicting..." : "Predict"}
        </button>

        {result && (
          <div className="mt-6 rounded-xl bg-emerald-400/10 p-4">
            <p className="text-lg font-semibold text-emerald-300">
              Predicted Class: {result}
            </p>
            {confidence && (
              <p className="mt-1 text-slate-300">Confidence: {confidence}</p>
            )}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}