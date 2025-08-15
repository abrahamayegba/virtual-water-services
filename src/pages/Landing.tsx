import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { SignIn, SignUp, useUser } from '@clerk/clerk-react';
import { useAuth } from '../context/AuthContext';
import { HardHat, Shield, Award, Users, ChevronRight } from 'lucide-react';
import logo from "../assets/logo.svg";
import Footer from '../components/Footer';

export default function Landing() {
  const { user, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

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
                  <strong>Internal:</strong> dawnlawrie@waterservicesgroup.com /
                  admin123456
                </p>
                <p>
                  <strong>External:</strong> petsathome@company.com /
                  password123456
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

            {isLogin ? (
              <SignIn 
                appearance={{
                  elements: {
                    formButtonPrimary: 'bg-blue-500 hover:bg-blue-600',
                    card: 'shadow-none border-0'
                  }
                }}
                redirectUrl="/dashboard"
              />
            ) : (
              <SignUp 
                appearance={{
                  elements: {
                    formButtonPrimary: 'bg-blue-500 hover:bg-blue-600',
                    card: 'shadow-none border-0'
                  }
                }}
                redirectUrl="/dashboard"
              />
            )}

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

      {/* Footer */}
     <Footer/>
    </div>
  );
}