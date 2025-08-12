import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HardHat, Shield, Award, Users, ChevronRight } from 'lucide-react';
import logo from "../assets/logo.svg";

export default function Landing() {
  const { user, login, register, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    company: '',
    contractorId: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      let success = false;
      
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        success = await register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          company: formData.company,
          contractorId: formData.contractorId
        });
      }

      if (!success) {
        setError(isLogin ? 'Invalid credentials' : 'Registration failed');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-1">
            <div className="flex items-center">
              <img
                src={logo}
                height={30}
                width={120}
                alt="virtual-services-logo"
              />
              <span className="text-2xl font-bold text-gray-900">
                Virtual Water Services Ltd
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Professional Training for Teams
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Hero Section */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Comprehensive Safety Training for Professionals
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Industry-leading training courses designed specifically for
                contractors, site workers, and safety professionals
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <Shield className="h-12 w-12 text-orange-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Safety First
                </h3>
                <p className="text-gray-600">
                  Comprehensive safety protocols and best practices for
                  construction environments
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <Award className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Certified Training
                </h3>
                <p className="text-gray-600">
                  Industry-recognized certificates upon successful course
                  completion
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <Users className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Team Management
                </h3>
                <p className="text-gray-600">
                  Track progress and manage training for your entire
                  construction team
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <HardHat className="h-12 w-12 text-purple-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Equipment Training
                </h3>
                <p className="text-gray-600">
                  Specialized training for heavy machinery and equipment
                  operation
                </p>
              </div>
            </div>

            {/* Demo Credentials */}
            <div className="bg-blue-50 p-4 rounded-lg mb-8">
              <h4 className="font-semibold text-blue-900 mb-2">
                Demo Credentials
              </h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>
                  <strong>Internal:</strong> dawnlawrie@waterservicesgroup.com / admin123456
                </p>
                <p>
                  <strong>External:</strong> petsathome@company.com / password123456
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Login/Register Form */}
        <div className="w-full max-w-md bg-white shadow-xl border-l">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {isLogin ? "Welcome Back" : "Get Started"}
              </h2>
              <p className="text-gray-600 mt-2">
                {isLogin
                  ? "Sign in to continue your training"
                  : "Create your account to begin"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          company: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contractor ID
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.contractorId}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          contractorId: e.target.value,
                        }))
                      }
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <span>{isLogin ? "Sign In" : "Create Account"}</span>
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}