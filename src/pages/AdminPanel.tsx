import React, { useState } from 'react';
import { useCourses } from '../context/CourseContext';
import Navbar from '../components/Navbar';
import FileUpload from '../components/FileUpload';
import { 
  Plus, 
  BookOpen, 
  Users, 
  Award, 
  Settings, 
  Edit2, 
  Trash2, 
  Eye, 
  FileText,
  Video,
  Presentation,
  Save,
  X,
  Upload,
  Download,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface NewCourse {
  title: string;
  description: string;
  category: string;
  duration: number;
  objectives: string[];
  lessons: NewLesson[];
}

interface NewLesson {
  id: string;
  title: string;
  content: string;
  type: 'pdf' | 'video' | 'powerpoint';
  duration: number;
  file: File | null;
}

export default function AdminPanel() {
  const { courses, createCourse, updateCourse, deleteCourse } = useCourses();
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'users' | 'analytics' | 'settings'>('overview');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  const [newCourse, setNewCourse] = useState<NewCourse>({
    title: '',
    description: '',
    category: '',
    duration: 60,
    objectives: [''],
    lessons: []
  });
  
  const [newLesson, setNewLesson] = useState<NewLesson>({
    id: '',
    title: '',
    content: '',
    type: 'pdf',
    duration: 30,
    file: null
  });

  const categories = ['Water Hygiene', 'Safety', 'Equipment', 'Compliance', 'Skills', 'Leadership'];
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const mockUsers = [
    { 
      id: '1', 
      name: 'John Smith', 
      email: 'john@contractor.com', 
      company: 'Smith Construction', 
      contractorId: 'CON002', 
      status: 'Active', 
      coursesCompleted: 2,
      lastActive: '2024-01-15',
      joinDate: '2024-01-01'
    },
    { 
      id: '2', 
      name: 'Sarah Johnson', 
      email: 'sarah@buildco.com', 
      company: 'BuildCo Inc', 
      contractorId: 'CON003', 
      status: 'Active', 
      coursesCompleted: 1,
      lastActive: '2024-01-14',
      joinDate: '2024-01-02'
    },
    { 
      id: '3', 
      name: 'Mike Wilson', 
      email: 'mike@safebuild.com', 
      company: 'SafeBuild Ltd', 
      contractorId: 'CON004', 
      status: 'Pending', 
      coursesCompleted: 0,
      lastActive: '2024-01-10',
      joinDate: '2024-01-05'
    }
  ];

  const mockCertificates = [
    { id: '1', userName: 'John Smith', courseName: 'Water Hygiene Monitoring', completedAt: '2024-01-15', score: 95 },
    { id: '2', userName: 'Sarah Johnson', courseName: 'Temperature Monitoring', completedAt: '2024-01-12', score: 88 }
  ];

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newCourse.lessons.length === 0) {
      alert('Please add at least one lesson to the course.');
      return;
    }

    const courseData = {
      ...newCourse,
      objectives: newCourse.objectives.filter(obj => obj.trim() !== ''),
      lessons: newCourse.lessons.map(lesson => ({
        ...lesson,
        completed: false
      }))
    };

    if (editingCourse) {
      updateCourse(editingCourse, courseData);
      setEditingCourse(null);
    } else {
      createCourse(courseData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setNewCourse({
      title: '',
      description: '',
      category: '',
      duration: 60,
      objectives: [''],
      lessons: []
    });
    setShowCreateForm(false);
  };

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLesson.file) {
      alert('Please upload a file for this lesson.');
      return;
    }

    const lesson = {
      ...newLesson,
      id: Date.now().toString(),
    };
    
    setNewCourse(prev => ({
      ...prev,
      lessons: [...prev.lessons, lesson]
    }));
    
    setNewLesson({
      id: '',
      title: '',
      content: '',
      type: 'pdf',
      duration: 30,
      file: null
    });
    setShowLessonForm(false);
  };

  const handleRemoveLesson = (lessonId: string) => {
    setNewCourse(prev => ({
      ...prev,
      lessons: prev.lessons.filter(lesson => lesson.id !== lessonId)
    }));
  };

  const handleEditCourse = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setNewCourse({
        title: course.title,
        description: course.description,
        category: course.category,
        duration: course.duration,
        objectives: course.objectives || [''],
        lessons: course.lessons.map(lesson => ({
          ...lesson,
          file: null // Files can't be edited, would need re-upload
        }))
      });
      setEditingCourse(courseId);
      setShowCreateForm(true);
    }
  };

  const handleDeleteCourse = (courseId: string) => {
    if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      deleteCourse(courseId);
    }
  };

  const addObjective = () => {
    setNewCourse(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }));
  };

  const updateObjective = (index: number, value: string) => {
    setNewCourse(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }));
  };

  const removeObjective = (index: number) => {
    setNewCourse(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'pdf': return <FileText className="h-4 w-4" />;
      case 'powerpoint': return <Presentation className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r min-h-screen">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Panel</h2>
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'overview' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <div className="flex space-x-3">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    <Download className="h-4 w-4 inline mr-2" />
                    Export Report
                  </button>
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Courses</p>
                      <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-500" />
                  </div>
                  <p className="text-xs text-green-600 mt-2">↗ +2 this month</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Users</p>
                      <p className="text-2xl font-bold text-gray-900">{mockUsers.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                  <p className="text-xs text-green-600 mt-2">↗ +5 this week</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Certificates Issued</p>
                      <p className="text-2xl font-bold text-gray-900">{mockCertificates.length}</p>
                    </div>
                    <Award className="h-8 w-8 text-purple-500" />
                  </div>
                  <p className="text-xs text-green-600 mt-2">↗ +3 today</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                      <p className="text-2xl font-bold text-gray-900">87%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-500" />
                  </div>
                  <p className="text-xs text-green-600 mt-2">↗ +2% this month</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">John Smith completed "Water Hygiene Monitoring"</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">New user Sarah Johnson registered</p>
                        <p className="text-xs text-gray-500">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Course "Temperature Monitoring" was updated</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setShowCreateForm(true)}
                      className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Plus className="h-5 w-5 text-blue-500" />
                      <span>Create New Course</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                      <Users className="h-5 w-5 text-green-500" />
                      <span>Manage Users</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                      <Download className="h-5 w-5 text-purple-500" />
                      <span>Export Reports</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Course</span>
                </button>
              </div>

              {/* Search and Filter */}
              <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <Filter className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Create Course Form */}
              {showCreateForm && (
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {editingCourse ? 'Edit Course' : 'Create New Course'}
                    </h2>
                    <button
                      onClick={resetForm}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleCreateCourse} className="space-y-6">
                    {/* Basic Course Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={newCourse.title}
                          onChange={(e) => setNewCourse(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={newCourse.category}
                          onChange={(e) => setNewCourse(prev => ({ ...prev, category: e.target.value }))}
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newCourse.description}
                        onChange={(e) => setNewCourse(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                      <input
                        type="number"
                        required
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newCourse.duration}
                        onChange={(e) => setNewCourse(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      />
                    </div>

                    {/* Learning Objectives */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700">Learning Objectives</label>
                        <button
                          type="button"
                          onClick={addObjective}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          + Add Objective
                        </button>
                      </div>
                      <div className="space-y-2">
                        {newCourse.objectives.map((objective, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="text"
                              placeholder="Enter learning objective..."
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={objective}
                              onChange={(e) => updateObjective(index, e.target.value)}
                            />
                            {newCourse.objectives.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeObjective(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Lessons Section */}
                    <div className="border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Course Lessons</h3>
                        <button
                          type="button"
                          onClick={() => setShowLessonForm(true)}
                          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors text-sm"
                        >
                          Add Lesson
                        </button>
                      </div>

                      {/* Lessons List */}
                      {newCourse.lessons.length > 0 && (
                        <div className="space-y-3 mb-4">
                          {newCourse.lessons.map((lesson, index) => (
                            <div key={lesson.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                  {getContentIcon(lesson.type)}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{lesson.title}</p>
                                  <p className="text-sm text-gray-600">
                                    {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)} • {lesson.duration} min
                                  </p>
                                  {lesson.file && (
                                    <p className="text-xs text-green-600">File: {lesson.file.name}</p>
                                  )}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveLesson(lesson.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Lesson Form */}
                      {showLessonForm && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-4 border">
                          <h4 className="font-medium text-gray-900 mb-3">Add New Lesson</h4>
                          <form onSubmit={handleAddLesson} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
                                <input
                                  type="text"
                                  required
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={newLesson.title}
                                  onChange={(e) => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
                                <select
                                  required
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={newLesson.type}
                                  onChange={(e) => setNewLesson(prev => ({ ...prev, type: e.target.value as any }))}
                                >
                                  <option value="pdf">PDF Document</option>
                                  <option value="video">Video</option>
                                  <option value="powerpoint">PowerPoint/Slides</option>
                                </select>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                              <input
                                type="number"
                                required
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newLesson.duration}
                                onChange={(e) => setNewLesson(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Content Description</label>
                              <textarea
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newLesson.content}
                                onChange={(e) => setNewLesson(prev => ({ ...prev, content: e.target.value }))}
                                placeholder="Brief description of the lesson content..."
                              />
                            </div>

                            <FileUpload
                              label={`Upload ${newLesson.type === 'video' ? 'Video' : 'PDF'} File`}
                              acceptedTypes={newLesson.type === 'video' ? '.mp4,.avi,.mov,.wmv' : '.pdf'}
                              maxSize={newLesson.type === 'video' ? 100 : 10}
                              onFileSelect={(file) => setNewLesson(prev => ({ ...prev, file }))}
                              currentFile={newLesson.file}
                              onRemove={() => setNewLesson(prev => ({ ...prev, file: null }))}
                            />

                            <div className="flex space-x-3">
                              <button
                                type="submit"
                                disabled={!newLesson.file}
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Add Lesson
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowLessonForm(false)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-4 pt-6 border-t">
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center space-x-2"
                      >
                        <Save className="h-4 w-4" />
                        <span>{editingCourse ? 'Update Course' : 'Create Course'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Courses Table */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-medium text-gray-900">All Courses ({filteredCourses.length})</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lessons</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCourses.map(course => (
                        <tr key={course.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{course.title}</div>
                              <div className="text-sm text-gray-500 max-w-xs truncate">{course.description}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {course.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {course.duration} min
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {course.lessons.length}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button 
                                className="text-blue-600 hover:text-blue-900"
                                title="View Course"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleEditCourse(course.id)}
                                className="text-green-600 hover:text-green-900"
                                title="Edit Course"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteCourse(course.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete Course"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <div className="flex space-x-3">
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                    <Plus className="h-4 w-4 inline mr-2" />
                    Add User
                  </button>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    <Download className="h-4 w-4 inline mr-2" />
                    Export Users
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-medium text-gray-900">Registered Users ({mockUsers.length})</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contractor ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockUsers.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-700">
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.company}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.contractorId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <span className="mr-2">{user.coursesCompleted}</span>
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ width: `${(user.coursesCompleted / courses.length) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.lastActive}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.status === 'Active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-900">
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button className="text-gray-600 hover:text-gray-900">
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-8">Analytics & Reports</h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Course Completion Rates</h2>
                  <div className="space-y-4">
                    {courses.slice(0, 5).map(course => (
                      <div key={course.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{course.title}</span>
                          <span className="font-medium">87%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Certificates</h2>
                  <div className="space-y-3">
                    {mockCertificates.map(cert => (
                      <div key={cert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{cert.userName}</p>
                          <p className="text-xs text-gray-600">{cert.courseName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">{cert.score}%</p>
                          <p className="text-xs text-gray-500">{cert.completedAt}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-8">System Settings</h1>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">General Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue="Virtual Water Services Training Platform"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue="support@virtualwaterservices.co.uk"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Course Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Auto-approve new courses</p>
                        <p className="text-sm text-gray-500">Automatically publish new courses without review</p>
                      </div>
                      <input type="checkbox" className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email notifications</p>
                        <p className="text-sm text-gray-500">Send email notifications for course completions</p>
                      </div>
                      <input type="checkbox" className="h-4 w-4 text-blue-600" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}