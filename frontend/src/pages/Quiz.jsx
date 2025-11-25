import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Award } from "lucide-react";
import { saveOfflineAction } from "../utils/offlineSync";

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      question: "What is the safest way to share your UPI PIN?",
      options: [
        "Write it on card",
        "Share with bank manager",
        "Never share it",
        "Send via WhatsApp",
      ],
      answer: 2,
    },
    {
      question: "Which symbol indicates a secure website?",
      options: [
        "Red unlock icon",
        "Green padlock icon",
        "Yellow warning",
        "No symbol",
      ],
      answer: 1,
    },
    {
      question: "What is DigiLocker used for?",
      options: [
        "Storing Money",
        "Storing Documents",
        "Watching Movies",
        "Chatting",
      ],
      answer: 1,
    },
  ];

  const handleAnswer = (index) => {
    if (index === questions[currentQuestion].answer) {
      setScore(score + 1);
    }
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      submitScore(
        score + (index === questions[currentQuestion].answer ? 1 : 0)
      );
      setShowResult(true);
    }
  };

  const submitScore = async (finalScore) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    // FIXED: Track ALL attempts, not just passing ones
    const passed = finalScore >= 2;
    const payload = {
      user_id: storedUser.id,
      module_id: "quiz_literacy_101",
      points: passed ? finalScore * 10 : 0, // Only award points if passed
      status: passed ? "passed" : "failed", // Track pass/fail status
      score: finalScore,
      total_questions: questions.length,
    };

    // --- Offline check logic ---
    if (!navigator.onLine) {
      saveOfflineAction("/api/progress", "POST", payload);
      return;
    }

    // --- Online Submission Logic ---
    try {
      await fetch("http://localhost:8080/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Failed to save progress, queuing offline.");
      saveOfflineAction("/api/progress", "POST", payload);
    }
  };

  if (showResult) {
    const passed = score >= 2;

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-sm w-full">
          {passed ? (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-green-600 w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Quiz Passed!</h2>
              <p className="text-gray-500 mt-2">
                You scored {score} out of {questions.length}
              </p>
              <p className="text-green-600 font-bold mt-4">
                +{score * 10} Points Added
              </p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="text-red-600 w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Keep Practicing
              </h2>
              <p className="text-gray-500 mt-2">
                You scored {score} out of {questions.length}
              </p>
              <p className="text-red-600 font-medium mt-2 text-sm">
                You need 2+ correct answers to pass.
              </p>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-6 text-left">
                <h4 className="font-semibold text-blue-900 text-sm mb-2">
                  💡 Study Tip
                </h4>
                <p className="text-blue-700 text-xs leading-relaxed">
                  Review the learning videos in the "Learn" section before
                  retrying. Each topic has helpful tutorials!
                </p>
              </div>
            </>
          )}
          <button
            onClick={() => navigate("/learn")}
            className="mt-8 w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            {passed ? "Back to Learning" : "Review Lessons"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <span className="text-gray-500 font-bold">
            Question {currentQuestion + 1}/{questions.length}
          </span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
            Literacy 101
          </span>
        </div>
        <div className="p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-8">
            {questions[currentQuestion].question}
          </h2>
          <div className="space-y-3">
            {questions[currentQuestion].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className="w-full text-left p-4 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition font-medium text-gray-700 active:scale-98"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
