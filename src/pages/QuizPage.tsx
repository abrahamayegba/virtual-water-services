import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCourses } from '../context/CourseContext';
import Navbar from '../components/Navbar';
import { Award, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

export default function QuizPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { getCourse, completeCourse } = useCourses();
  
  const course = getCourse(courseId!);
  const quiz = course?.quiz;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  
  React.useEffect(() => {
    if (!showResults && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0) {
      void handleSubmitQuiz();
    }
  }, [timeLeft, showResults, handleSubmitQuiz]);

  if (!course || !quiz) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Quiz not found</h1>
            <Link to="/dashboard" className="text-blue-500 hover:text-blue-600 mt-4 inline-block">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleSubmitQuiz = async () => {
    const correctAnswers = quiz.questions.reduce((count, question) => {
      return count + (answers[question.id] === question.correctAnswer ? 1 : 0);
    }, 0);
    
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;
    
    if (passed) {
      const certificateId = await completeCourse(courseId!, score);
      navigate(`/certificate/${certificateId}`);
    } else {
      setShowResults(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const correctAnswers = quiz.questions.reduce((count, question) => {
    return count + (answers[question.id] === question.correctAnswer ? 1 : 0);
  }, 0);
  
  const score = Math.round((correctAnswers / quiz.questions.length) * 100);
  const passed = score >= quiz.passingScore;

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {passed ? (
                  <Award className="h-8 w-8 text-green-600" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-600" />
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {passed ? 'Congratulations!' : 'Quiz Incomplete'}
              </h1>
              <p className="text-lg text-gray-600">
                {passed 
                  ? 'You have successfully passed the quiz!' 
                  : `You scored ${score}%. You need ${quiz.passingScore}% to pass.`
                }
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Results</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{score}%</p>
                  <p className="text-sm text-gray-600">Final Score</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{correctAnswers}</p>
                  <p className="text-sm text-gray-600">Correct</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{quiz.questions.length - correctAnswers}</p>
                  <p className="text-sm text-gray-600">Incorrect</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-600">{quiz.passingScore}%</p>
                  <p className="text-sm text-gray-600">Required</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900">Question Review</h3>
              {quiz.questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className="border rounded-lg p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCorrect ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {isCorrect ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-3">
                          Question {index + 1}: {question.question}
                        </h4>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className={`p-3 rounded-lg border ${
                                optionIndex === question.correctAnswer
                                  ? 'bg-green-50 border-green-200 text-green-900'
                                  : optionIndex === userAnswer && !isCorrect
                                  ? 'bg-red-50 border-red-200 text-red-900'
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">
                                  {String.fromCharCode(65 + optionIndex)}.
                                </span>
                                <span>{option}</span>
                                {optionIndex === question.correctAnswer && (
                                  <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                                )}
                                {optionIndex === userAnswer && !isCorrect && (
                                  <XCircle className="h-4 w-4 text-red-600 ml-auto" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center space-x-4">
              <Link
                to={`/course/${courseId}`}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Review Course
              </Link>
              <button
                onClick={() => {
                  setAnswers({});
                  setCurrentQuestion(0);
                  setShowResults(false);
                  setTimeLeft(300);
                }}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Final Assessment</h1>
              <p className="text-gray-600">{course.title}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-blue-600">
                <Clock className="h-5 w-5" />
                <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
              </div>
              <div className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Quiz Instructions */}
        {currentQuestion === 0 && Object.keys(answers).length === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Quiz Instructions</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• You have 5 minutes to complete the quiz</li>
                  <li>• You need {quiz.passingScore}% or higher to pass</li>
                  <li>• You can retake the quiz if you don't pass</li>
                  <li>• Select the best answer for each question</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Question */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <h2 className="text-xl font-medium text-gray-900 mb-6">
            {currentQ.question}
          </h2>
          
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQ.id, index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  answers[currentQ.id] === index
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQ.id] === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQ.id] === index && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="font-medium text-gray-700">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex items-center space-x-2">
            {quiz.questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentQuestion
                    ? 'bg-blue-500'
                    : answers[quiz.questions[index].id] !== undefined
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>
          
          {currentQuestion === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={Object.keys(answers).length !== quiz.questions.length}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </main>
    </div>
  );
}