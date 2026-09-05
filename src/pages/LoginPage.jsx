import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, FileText, CheckCircle, Clock, User, Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function LoginPage() {
  const [officerName, setOfficerName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');

    const trimmedName = officerName.trim();
    if (!trimmedName) {
      setError('Please enter your Officer Name or Username.');
      return;
    }

    setIsLoading(true);

    // Format display name nicely (e.g. 'raman yadav' -> 'Raman Yadav')
    const formattedName = trimmedName.includes('@')
      ? trimmedName.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      : trimmedName.replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const cleanUsername = trimmedName.toLowerCase().replace(/\s+/g, '.');

    setTimeout(() => {
      setIsLoading(false);
      login({
        id: `OFF-2026-${Math.floor(Math.random() * 900) + 100}`,
        name: formattedName,
        username: cleanUsername,
        email: trimmedName.includes('@') ? trimmedName : `${cleanUsername}@lm.gov.in`,
        role: 'Senior Enforcement Officer',
        badgeNumber: `LMO-DL-${Math.floor(Math.random() * 9000) + 1000}`,
        location: 'Delhi NCR Region'
      });
      navigate('/dashboard');
    }, 400);
  };

  const handleQuickDemo = () => {
    setOfficerName('Rajesh Kumar');
    setPassword('packcheck2026');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Left side - Branding & Hero */}
      <div className="md:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8 lg:p-16 flex flex-col justify-between text-white">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">PackCheck AI</h1>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            Legal Metrology <br />
            <span className="text-blue-400">Compliance Platform</span>
          </h2>
          
          <p className="text-lg text-slate-300 mb-12 max-w-md leading-relaxed">
            Automating package inspections with computer vision. Ensure accurate declarations and compliance with the Legal Metrology (Packaged Commodities) Rules, 2011.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-500/20 p-2 rounded-full mt-1">
                <FileText className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">AI-Powered OCR</h3>
                <p className="text-slate-400">Instantly extract and verify mandatory declarations from package images.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-blue-500/20 p-2 rounded-full mt-1">
                <CheckCircle className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Real-time Compliance</h3>
                <p className="text-slate-400">Automated checks against standard quantities and MRP regulations.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-blue-500/20 p-2 rounded-full mt-1">
                <Clock className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Official Reports</h3>
                <p className="text-slate-400">Generate and export legally sound inspection reports instantly.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-700/50">
          <p className="text-sm text-slate-400 font-medium">
            Ministry of Consumer Affairs, Food and Public Distribution
          </p>
          <p className="text-xs text-slate-500 mt-1">Government of India</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-900">Officer Login</h2>
            <p className="text-slate-500 mt-2">Sign in to access the compliance dashboard.</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800 flex items-start justify-between gap-2.5 mt-4">
            <div className="flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900">Custom Officer Access</p>
                <p className="text-blue-700 mt-0.5">Enter any name (e.g. your own name) to sign in and begin inspections.</p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={handleQuickDemo}
              className="text-xs text-blue-700 underline hover:text-blue-900 shrink-0 font-medium cursor-pointer"
            >
              Demo Fill
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 mt-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Officer Name or Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                    type="text"
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your name (e.g. Raman Yadav)"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="Enter any password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full text-lg py-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Secure Login'
              )}
            </Button>
          </form>

          <div className="mt-12 text-center bg-slate-100 p-4 rounded-lg">
            <p className="text-xs text-slate-500 font-medium">
              <Shield className="w-4 h-4 inline-block mr-1 text-slate-400" />
              This portal is for authorized Legal Metrology Enforcement Officers only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

