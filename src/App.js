import React, { useState, useEffect } from "react";
import axios from "axios";
import Confetti from "react-confetti";

function QuizApp() {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  // Shuffle array function
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  //quiz data from the JSON file using Axios
  useEffect(() => {
    axios
      .get("/quiz.json")
      .then((response) => {
        const questions = response.data.questions;
        shuffleArray(questions); // Shuffle  questions
        const selectedQuestions = questions.slice(0, 20); // Select the first 20 questions
        setQuizData(selectedQuestions);
      })
      .catch((error) => {
        console.error("Error fetching quiz data:", error);
      });
  }, []);

  // Function to check if the selected answer is correct
  const checkAnswer = (selectedAnswerIndex) => {
    if (selectedAnswerIndex === quizData[currentQuestionIndex].correct_option) {
      console.log("The selected answer is correct!");
      setCorrectAnswers((prevCorrectAnswers) => prevCorrectAnswers + 1);
    } else {
      console.log("The selected answer is incorrect.");
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setQuizComplete(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setCorrectAnswers(0);
    setQuizComplete(false);
    // Shuffle and select 20 random questions again on restart
    axios
      .get("/quiz.json")
      .then((response) => {
        const questions = response.data.questions;
        shuffleArray(questions);
        const selectedQuestions = questions.slice(0, 20);
        setQuizData(selectedQuestions);
      })
      .catch((error) => {
        console.error("Error fetching quiz data:", error);
      });
  };

  return (
    <div className="container-fluid d-flex justify-content-center" style={{ backgroundColor: '#A8D1E7', height: '100vh' }}>
      {!quizComplete && quizData.length > 0 && (
        <div className=" mt-5 px-3 py-3 rounded shadow" style={{ backgroundColor: '#B3DBD8', width: '700px', height: 'fit-content' }}>
          <div style={{ height: '90px' }}>
            <h3>Q. {quizData[currentQuestionIndex].question}</h3>
          </div>
          <hr/>
          {quizData[currentQuestionIndex].options.map((option, index) => (
            <div className="pt-1" key={index}>
              <button
                className="btn fs-5 w-100 py-4"
                style={{
                  backgroundColor: selectedAnswer === index ? 'white' : 'initial',
                  border: "none",
                  textAlign: 'left'
                }}
                onClick={() => {
                  setSelectedAnswer(index);
                  checkAnswer(index);
                }}
              >
                {option}
              </button>
            </div>
          ))}
          <div className="d-flex justify-content-end mt-3">
            <button className="btn btn-primary" onClick={nextQuestion}>
              {currentQuestionIndex < quizData.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          </div>
          <p className="ms-3 fw-bold fs-4">{currentQuestionIndex + 1}/{quizData.length}</p>
        </div>
      )}
      {quizComplete && (
        <div className=" d-flex align-items-center justify-content-center mt-5 px-3 py-3 rounded shadow" style={{ backgroundColor: '#B3DBD8', width: '700px', height: '550px' }}>
          <div>
            <h3 className="text-center">Quiz Complete!</h3>
            <div className="d-flex justify-content-center fs-4 fw-bold"><p>Your score: {correctAnswers} out of 20</p></div>
            <div className="d-flex justify-content-center">
              <button className="btn btn-primary" onClick={restartQuiz}>
                Restart Quiz
              </button>
            </div>
          </div>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={200}
          />
        </div>
      )}
    </div>
  );
}

export default QuizApp;
