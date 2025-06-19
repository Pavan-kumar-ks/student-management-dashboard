import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { Plus, Edit2, User, Mail, BookOpen, Search, Loader2, AlertCircle, Check } from 'lucide-react';

// Global State Context - Demonstrates advanced React patterns
const StudentContext = createContext();

const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <StudentContext.Provider value={{
      students, setStudents,
      courses, setCourses,
      loading, setLoading,
      error, setError
    }}>
      {children}
    </StudentContext.Provider>
  );
};

const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudentContext must be used within StudentProvider');
  }
  return context;
};

// Real API Service - Demonstrates async/await with actual HTTP calls
class StudentAPI {
  // Replace this URL with your actual MockAPI endpoint
  // To create one: Go to https://mockapi.io, create account, create a project
  // Then create a "courses" resource with fields: id (number), name (string)
  static COURSES_API_URL = 'https://6853dce0a2a37a1d6f4a330d.mockapi.io/courses';
  
  static async fetchCourses() {
    try {
      console.log('Fetching courses from:', this.COURSES_API_URL);
      
      // Real API call using fetch - demonstrates async/await
      const response = await fetch(this.COURSES_API_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const courses = await response.json();
      console.log('Courses fetched successfully:', courses);
      
      // If the API returns different structure, normalize it
      return courses.map(course => ({
        id: course.id,
        name: course.name || course.courseName || course.title
      }));
      
    } catch (error) {
      console.error('Error fetching courses:', error);
      
      // Fallback to mock data if API fails
      console.log('Using fallback mock data');
      return [
        { id: 1, name: "HTML Basics" },
        { id: 2, name: "CSS Mastery" },
        { id: 3, name: "JavaScript Pro" },
        { id: 4, name: "React In Depth" }
      ];
    }
  }

  static async addStudent(student) {
    // For students, we'll still use local storage since it's a frontend-only demo
    // In a real app, this would also be an API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...student, id: Date.now() };
  }

  static async updateStudent(updatedStudent) {
    // Simulating API call - in real app this would be a PUT/PATCH request
    await new Promise(resolve => setTimeout(resolve, 500));
    return updatedStudent;
  }
}

// Form Validation Utilities
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateStudent = (student) => {
  const errors = {};
  
  if (!student.name.trim()) {
    errors.name = 'Name is required';
  }
  
  if (!student.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(student.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!student.course) {
    errors.course = 'Please select a course';
  }
  
  return errors;
};

// Student Form Component - Demonstrates controlled components and form validation
const StudentForm = ({ student, onSave, onCancel }) => {
  const { courses, loading } = useStudentContext();
  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || '',
    course: student?.course || '',
    profileImage: student?.profileImage || ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Controlled component input handler
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateStudent(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Demonstrate async/await in action
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulating API call
      onSave(formData);
    } catch (error) {
      console.error('Error saving student:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {student ? 'Edit Student' : 'Add New Student'}
          </h2>
          
          <div className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter student's full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="student@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Course Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enrolled Course *
              </label>
              <select
                value={formData.course}
                onChange={(e) => handleInputChange('course', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.course ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.name}>
                    {course.name}
                  </option>
                ))}
              </select>
              {errors.course && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.course}
                </p>
              )}
            </div>

            {/* Profile Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image URL (Optional)
              </label>
              <input
                type="url"
                value={formData.profileImage}
                onChange={(e) => handleInputChange('profileImage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/profile.jpg"
              />
            </div>

            {/* Form Actions */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    {student ? 'Update' : 'Add'} Student
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Student Card Component - Demonstrates clean component structure
const StudentCard = ({ student, onEdit }) => {
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex items-center space-x-4">
        {/* Profile Image or Initials */}
        <div className="flex-shrink-0">
          {student.profileImage ? (
            <img
              src={student.profileImage}
              alt={student.name}
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className={`w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium ${
              student.profileImage ? 'hidden' : 'flex'
            }`}
          >
            <User className="w-6 h-6" />
          </div>
        </div>

        {/* Student Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {student.name}
          </h3>
          <div className="flex items-center text-gray-600 text-sm mt-1">
            <Mail className="w-4 h-4 mr-1" />
            <span className="truncate">{student.email}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm mt-1">
            <BookOpen className="w-4 h-4 mr-1" />
            <span className="truncate">{student.course}</span>
          </div>
        </div>

        {/* Edit Button */}
        <button
          onClick={() => onEdit(student)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Edit student"
        >
          <Edit2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Main Dashboard Component
const StudentManagementDashboard = () => {
  const { 
    students, setStudents, 
    courses, setCourses, 
    loading, setLoading, 
    error, setError 
  } = useStudentContext();

  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch courses on component mount - demonstrates useEffect and async/await with real API
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Starting to fetch courses...');
        
        // Real API call - demonstrates async/await with actual HTTP request
        const coursesData = await StudentAPI.fetchCourses();
        
        console.log('Courses loaded:', coursesData);
        setCourses(coursesData);
        
        // Show success message briefly
        setTimeout(() => {
          console.log('Courses successfully loaded and displayed');
        }, 100);
        
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setError(`Failed to load courses: ${err.message}`);
        
        // Still try to set fallback data
        setCourses([
          { id: 1, name: "HTML Basics" },
          { id: 2, name: "CSS Mastery" },
          { id: 3, name: "JavaScript Pro" },
          { id: 4, name: "React In Depth" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    // Demonstrate event loop - this will execute after the current execution context
    console.log('About to fetch courses...');
    fetchCourses();
    console.log('Fetch courses initiated (but not completed yet due to async nature)');
  }, []); // Empty dependency array - runs once on mount

  // Memoized filtered students - demonstrates useMemo for performance optimization
  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    
    return students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]); // Only recalculate when students or searchTerm changes

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleSaveStudent = async (studentData) => {
    try {
      if (editingStudent) {
        // Update existing student
        const updatedStudent = await StudentAPI.updateStudent({
          ...studentData,
          id: editingStudent.id
        });
        setStudents(prev => prev.map(s => s.id === editingStudent.id ? updatedStudent : s));
      } else {
        // Add new student
        const newStudent = await StudentAPI.addStudent(studentData);
        setStudents(prev => [...prev, newStudent]);
      }
      
      setShowForm(false);
      setEditingStudent(null);
    } catch (err) {
      setError('Failed to save student. Please try again.');
      console.error('Error saving student:', err);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  if (loading && courses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Management Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your students and their enrolled courses</p>
            </div>
            <button
              onClick={handleAddStudent}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Student
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Search and Stats */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <User className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <BookOpen className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Available Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <Search className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Filtered Results</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredStudents.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Students Grid */}
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No students found' : 'No students yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first student'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={handleAddStudent}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Student
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map(student => (
              <StudentCard
                key={student.id}
                student={student}
                onEdit={handleEditStudent}
              />
            ))}
          </div>
        )}
      </main>

      {/* Form Modal */}
      {showForm && (
        <StudentForm
          student={editingStudent}
          onSave={handleSaveStudent}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
};

// Main App Component with Context Provider
const App = () => {
  return (
    <StudentProvider>
      <StudentManagementDashboard />
    </StudentProvider>
  );
};

export default App;