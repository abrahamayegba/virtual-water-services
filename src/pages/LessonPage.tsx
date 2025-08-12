import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCourses } from "../context/CourseContext";
import Navbar from "../components/Navbar";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  FileText,
  Video,
  Presentation,
  Clock,
} from "lucide-react";

export default function LessonPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { getCourse, updateLessonProgress } = useCourses();
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const goPrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };
  const goNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };
  const course = getCourse(courseId!);
  const lesson = course?.lessons.find((l) => l.id === lessonId);


  if (!course || !lesson) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Lesson not found
            </h1>
            <Link
              to="/dashboard"
              className="text-blue-500 hover:text-blue-600 mt-4 inline-block"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const slidesModules: Record<string, { default: string }> = import.meta.glob(
    "../assets/ppt-slides/*.{png,jpg,jpeg}",
    { eager: true }
  );

  const slides = Object.values(slidesModules).map(mod => mod.default);

  const currentLessonIndex = course.lessons.findIndex((l) => l.id === lessonId);
  const previousLesson =
    currentLessonIndex > 0 ? course.lessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex < course.lessons.length - 1
      ? course.lessons[currentLessonIndex + 1]
      : null;

  const handleCompleteLesson = () => {
    updateLessonProgress(courseId!, lessonId!);
    setIsCompleted(true);
  };

  const handleNext = () => {
    if (nextLesson) {
      navigate(`/course/${courseId}/lesson/${nextLesson.id}`);
    } else {
      // All lessons completed, check if quiz exists
      if (course.quiz) {
        navigate(`/course/${courseId}/quiz`);
      } else {
        navigate(`/course/${courseId}`);
      }
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-5 w-5" />;
      case "pdf":
        return <FileText className="h-5 w-5" />;
      case "powerpoint":
        return <Presentation className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const renderContent = () => {
    switch (lesson.type) {
      case "video":
        return (
          <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
            <div className="text-white text-center">
              <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Video Content</p>
              <p className="text-sm opacity-75">
                Duration: {lesson.duration} minutes
              </p>
              <p className="text-xs opacity-50 mt-2">
                In a production environment, this would embed your actual video
                content
              </p>
            </div>
          </div>
        );

      case "powerpoint":
        // return (
        //   <div className="bg-gray-100 rounded-lg p-8 min-h-96 flex flex-col items-center justify-center">
        //     <Presentation className="h-16 w-16 text-gray-400 mb-4" />
        //     <h3 className="text-xl font-semibold text-gray-900 mb-2">{lesson.title}</h3>
        //     <p className="text-gray-600 text-center mb-6 max-w-2xl">
        //       This lesson covers important concepts related to {lesson.title.toLowerCase()}.
        //       In a production environment, your PowerPoint presentation would be converted to an interactive format or embedded directly.
        //     </p>
        //     <div className="bg-white p-6 rounded-lg shadow-sm w-full max-w-2xl">
        //       <h4 className="font-semibold text-gray-900 mb-3">Key Topics Covered:</h4>
        //       <ul className="space-y-2 text-gray-700">
        //         <li className="flex items-center space-x-2">
        //           <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        //           <span>Safety protocols and procedures</span>
        //         </li>
        //         <li className="flex items-center space-x-2">
        //           <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        //           <span>Equipment operation guidelines</span>
        //         </li>
        //         <li className="flex items-center space-x-2">
        //           <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        //           <span>Risk assessment techniques</span>
        //         </li>
        //         <li className="flex items-center space-x-2">
        //           <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        //           <span>Best practice examples</span>
        //         </li>
        //       </ul>
        //     </div>
        //   </div>
        // );

        // return (
        //   <div className="overflow-x-auto flex space-x-6">
        //     {slides.map((src, i) => (
        //       <img
        //         key={i}
        //         src={src}
        //         alt={`Slide ${i + 1}`}
        //         className="max-h-[500px] object-contain rounded-md shadow-md"
        //       />
        //     ))}
        //   </div>
        // );

        return (
          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-full max-w-4xl flex items-center justify-center">
              <button
                onClick={goPrev}
                className="absolute left-0 z-10 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
                aria-label="Previous slide"
              >
                ‹
              </button>

              <img
                src={slides[currentSlide]}
                alt={`Slide ${currentSlide + 1}`}
                className="max-h-[600px] object-contain rounded-md shadow-md mx-8"
              />

              <button
                onClick={goNext}
                className="absolute right-0 z-10 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
                aria-label="Next slide"
              >
                ›
              </button>
            </div>
            <p className="text-gray-700 text-sm">
              Slide {currentSlide + 1} of {slides.length}
            </p>
          </div>
        );

      case "pdf":
        return (
          <div className="bg-white border rounded-lg p-8 min-h-96">
            <div className="text-center mb-8">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {lesson.title}
              </h3>
              <p className="text-gray-600">
                PDF Document - {lesson.duration} minutes read
              </p>
            </div>

            <div className="prose max-w-none">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Document Content
              </h4>
              <p className="text-gray-700 mb-4">
                This document provides comprehensive information about{" "}
                {lesson.title.toLowerCase()}. In a production environment, you
                would embed or display the actual PDF content here.
              </p>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-3">
                  Summary of Key Points:
                </h5>
                <div className="space-y-3 text-gray-700">
                  <p>• Understanding safety requirements and regulations</p>
                  <p>• Proper identification and documentation procedures</p>
                  <p>• Step-by-step implementation guidelines</p>
                  <p>• Common challenges and solutions</p>
                  <p>• Quality assurance and verification methods</p>
                </div>
              </div>

              <p className="text-gray-700 mt-4">
                Take your time to review all the material thoroughly. This
                information is crucial for successful completion of the course
                and your safety certification.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-gray-100 rounded-lg p-8 min-h-96 flex items-center justify-center">
            <div className="text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-600">Content not available</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Link to="/dashboard" className="hover:text-gray-700">
              Dashboard
            </Link>
            <span className="mx-2">•</span>
            <Link to={`/course/${courseId}`} className="hover:text-gray-700">
              {course.title}
            </Link>
            <span className="mx-2">•</span>
            <span>{lesson.title}</span>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {lesson.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                <div className="flex items-center space-x-1">
                  {getContentIcon(lesson.type)}
                  <span>
                    {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{lesson.duration} minutes</span>
                </div>
                <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  Lesson {currentLessonIndex + 1} of {course.lessons.length}
                </div>
              </div>
            </div>

            {(lesson.completed || isCompleted) && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Completed</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  ((currentLessonIndex +
                    (lesson.completed || isCompleted ? 1 : 0)) /
                    course.lessons.length) *
                  100
                }%`,
              }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Lesson {currentLessonIndex + 1} of {course.lessons.length} in{" "}
            {course.title}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
              {renderContent()}
            </div>

            {/* Lesson Navigation */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  {previousLesson && (
                    <Link
                      to={`/course/${courseId}/lesson/${previousLesson.id}`}
                      className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <div>
                        <p className="text-xs text-gray-500">Previous</p>
                        <p className="font-medium">{previousLesson.title}</p>
                      </div>
                    </Link>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  {!lesson.completed && !isCompleted && (
                    <button
                      onClick={handleCompleteLesson}
                      className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Mark as Complete</span>
                    </button>
                  )}

                  {(lesson.completed || isCompleted) && (
                    <button
                      onClick={handleNext}
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                    >
                      <span>
                        {nextLesson
                          ? "Next Lesson"
                          : course.quiz
                          ? "Take Quiz"
                          : "Back to Course"}
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div>
                  {nextLesson && (
                    <div className="flex items-center space-x-2 text-gray-600 text-right">
                      <div>
                        <p className="text-xs text-gray-500">Next</p>
                        <p className="font-medium">{nextLesson.title}</p>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Progress */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Course Progress
              </h3>
              <div className="space-y-3">
                {course.lessons.map((l, index) => (
                  <div key={l.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          l.completed
                            ? "bg-green-500 text-white"
                            : l.id === lessonId
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {l.completed ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          l.id === lessonId
                            ? "font-medium text-gray-900"
                            : "text-gray-600"
                        }`}
                      >
                        {l.title}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{l.duration}m</span>
                  </div>
                ))}

                {course.quiz && (
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm text-gray-600">Final Quiz</span>
                    </div>
                    <span className="text-xs text-gray-500">5m</span>
                  </div>
                )}
              </div>
            </div>

            {/* Lesson Notes */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Key Takeaways
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Review all safety protocols carefully</li>
                <li>• Pay attention to equipment specifications</li>
                <li>• Practice proper procedures regularly</li>
                <li>• Ask questions if anything is unclear</li>
              </ul>
            </div>

            {/* Support */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Need Help?
              </h3>
              <div className="space-y-2 text-sm">
                <Link
                  to="/support"
                  className="block text-blue-600 hover:text-blue-700"
                >
                  Technical Support
                </Link>
                <Link
                  to="/support"
                  className="block text-blue-600 hover:text-blue-700"
                >
                  Content Questions
                </Link>
                <Link
                  to="/support"
                  className="block text-blue-600 hover:text-blue-700"
                >
                  Report an Issue
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
