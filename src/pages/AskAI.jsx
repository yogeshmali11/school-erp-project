import React, { useState } from "react";
import axios from "axios";

export default function AskAI() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question) return;
    setLoading(true);
    try {
      // send key 'message' instead of 'question'
      const res = await axios.post("http://localhost:5000/api/ask", { message: question });
      // use 'reply' key from backend response
      setAnswer(res.data.reply);
      setQuestion("");  // Clear the input field after getting the answer
    } catch (err) {
      setAnswer("Error: Could not get response");
    }
    setLoading(false);
  };

  return (
    <div className="container mt-5 p-4 rounded shadow" style={{ backgroundColor: "#f5f5f5", maxWidth: "600px" }}>
      <h3 className="text-center mb-4">Ask AI</h3>

      <textarea
        className="form-control mb-3"
        rows="4"
        placeholder="Ask your question here..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        className="btn w-100"
        style={{ backgroundColor: "#352f44", color: "white" }}
        onClick={handleAsk}
        disabled={loading}
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {answer && (
        <div className="mt-4 p-3 rounded" style={{ backgroundColor: "#fff", border: "1px solid #ccc" }}>
          <strong>AI's Answer:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
