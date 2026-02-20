import { useState } from "react";

function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [status, setStatus] = useState("idle");
  const statusColors = {
    idle: "bg-slate-400",
    scanning: "bg-yellow-400",
    detected: "bg-red-500",
    safe: "bg-green-500",
  };

  const handleScan = async () => {
    // 1. Start UI animations
    setIsScanning(true);
    setStatus("scanning");

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "Checking for AI content" }), // We will make this text dynamic next
      });

      // 3. Waiting for Python to answer
      const data = await response.json();

      // 4. Update UI with the real result
      setStatus(data.status);
    } catch (error) {
      // If Python isn't running or the connection fails
      console.error("Backend unreachable:", error);
      setStatus("idle");
      alert("Make sure your FastAPI server is running!");
    } finally {
      // 5. Stop the spinner no matter what
      setIsScanning(false);
    }
  };

  return (
    <div className="w-[350px] bg-white shadow-xl rounded-lg overflow-hidden">
      <header className="p-4 border-b border-slate-100 flex justify-between items-center">
        <h1 className="font-bold text-blue-600 text-lg">AI Detector</h1>
        <div
          className={`w-3 h-3 rounded-full animate-pulse ${statusColors[status as keyof typeof statusColors]}`}
        ></div>
      </header>
      <main className="p-6 flex flex-col items-center text-center space-y-6">
        {/* 1. THE STATUS RING */}
        <div
          className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
            isScanning
              ? "border-blue-500 border-t-transparent animate-spin"
              : status === "detected"
                ? "border-red-500"
                : "border-slate-200"
          }`}
        >
          {/* Inside the ring: show an icon only if NOT scanning */}
          {!isScanning && (
            <span className="text-4xl">
              {status === "detected" ? "🚫" : "🛡️"}
            </span>
          )}
        </div>

        {/* 2. THE TEXT INFO */}
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800">
            {isScanning
              ? "Analyzing..."
              : status === "detected"
                ? "AI Detected"
                : "Ready to Scan"}
          </h2>
          <p className="text-sm text-slate-500 px-4">
            {isScanning
              ? "Checking video frames for deepfakes..."
              : "Analyze the current page for AI content."}
          </p>
        </div>

        {/* 3. THE ACTION BUTTON */}
        <button
          onClick={handleScan}
          disabled={isScanning}
          className={`w-full py-3 rounded-xl font-semibold transition-all ${
            isScanning
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
          }`}
        >
          {isScanning ? "Scanning..." : "Start Analysis"}
        </button>
      </main>
    </div>
  );
}

export default App;
