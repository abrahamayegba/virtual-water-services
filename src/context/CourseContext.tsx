import React, { createContext, useContext, useEffect, useState } from "react";

interface Lesson {
  id: string;
  title: string;
  content: string;
  type: "pdf" | "video" | "powerpoint";
  duration: number;
  completed: boolean;
}

interface Quiz {
  id: string;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
  passingScore: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  lessons: Lesson[];
  quiz?: Quiz;
  progress: number;
  completed: boolean;
  certificateId?: string;
}

interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  completedAt: Date;
  score?: number;
}

interface CourseContextType {
  courses: Course[];
  certificates: Certificate[];
  getCourse: (id: string) => Course | undefined;
  updateLessonProgress: (courseId: string, lessonId: string) => Promise<void>;
  completeCourse: (courseId: string, score?: number) => Promise<string>;
  createCourse: (
    course: Omit<Course, "id" | "progress" | "completed">
  ) => Promise<void>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);
const API_URL = "http://localhost:3001/api";

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [courseRes, progressRes] = await Promise.all([
          fetch(`${API_URL}/courses`),
          fetch(`${API_URL}/progress/1`),
        ]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const coursesData: any[] = await courseRes.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const progressData: any[] = await progressRes.json();
        const merged: Course[] = coursesData.map(course => {
          const progress = progressData.find(p => p.courseId === course.id);
          const lessons = course.lessons.map((l: Lesson) => ({
            ...l,
            completed: progress ? progress.completedLessons.includes(l.id) : false,
          }));
          return {
            ...course,
            lessons,
            progress: progress ? progress.progress : 0,
            completed: progress ? progress.completed : false,
            certificateId: progress ? progress.certificateId : undefined,
          } as Course;
        });
        setCourses(merged);
      } catch (err) {
        console.error("Failed to load courses", err);
      }
    }
    load();
  }, []);

  const getCourse = (id: string) => courses.find(course => course.id === id);

  const updateLessonProgress = async (
    courseId: string,
    lessonId: string,
  ) => {
    const res = await fetch(
      `${API_URL}/courses/${courseId}/lessons/${lessonId}/progress`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "1" }),
      },
    );
    if (!res.ok) return;
    const data = await res.json();
    setCourses(prev =>
      prev.map(c =>
        c.id === courseId
          ? {
              ...c,
              lessons: c.lessons.map(l =>
                l.id === lessonId ? { ...l, completed: true } : l,
              ),
              progress: data.progress,
              completed: data.completed,
            }
          : c,
      ),
    );
  };

  const completeCourse = async (
    courseId: string,
    score?: number,
  ): Promise<string> => {
    const res = await fetch(`${API_URL}/courses/${courseId}/certificates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "1", score }),
    });
    const { id } = await res.json();
    const course = getCourse(courseId);
    if (course) {
      const certificate: Certificate = {
        id,
        userId: "1",
        courseId,
        courseName: course.title,
        completedAt: new Date(),
        score,
      };
      setCertificates(prev => [...prev, certificate]);
      setCourses(prev =>
        prev.map(c =>
          c.id === courseId
            ? { ...c, completed: true, certificateId: id }
            : c,
        ),
      );
    }
    return id;
  };

  const createCourse = async (
    courseData: Omit<Course, "id" | "progress" | "completed">,
  ) => {
    const res = await fetch(`${API_URL}/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-role": "admin",
      },
      body: JSON.stringify(courseData),
    });
    if (!res.ok) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newCourse: any = await res.json();
    const course: Course = {
      ...newCourse,
      lessons: newCourse.lessons.map((l: Lesson) => ({ ...l, completed: false })),
      progress: 0,
      completed: false,
    };
    setCourses(prev => [...prev, course]);
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        certificates,
        getCourse,
        updateLessonProgress,
        completeCourse,
        createCourse,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export function useCourses() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourses must be used within a CourseProvider");
  }
  return context;
}
