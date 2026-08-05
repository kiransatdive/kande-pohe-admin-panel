import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../assets/logo.png';
import apiClient from '../services/apiClient';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.post('v1/admin/auth/login', {
        adminId,
        password
      }, {
        headers: {
          'bypass-tunnel-reminder': 'true' // Helpful for some tunneling services
        }
      });

      const data = response.data;

      if (data.success) {
        // Prevent inactive admins from logging in
        if (data.data.admin.status && data.data.admin.status.toLowerCase() === 'inactive') {
          setError('Your account is inactive. Please contact an administrator.');
          return;
        }

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('adminData', JSON.stringify(data.data.admin));
        navigate('/');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      console.error("Login connection error:", err);
      // Axios wraps the response error in err.response
      if (err.response?.status === 429) {
        setError('Too many login attempts. Please wait a few minutes and try again.');
      } else {
        const errorMsg = err.response?.data?.message || err.message || 'Server unreachable. Please check if the backend is running.';
        setError(`Connection failed: ${errorMsg}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 font-sans p-4 sm:p-8">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl min-h-[600px]">
        {/* Left Side - Graphic/Branding */}
        <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#e31e43] to-[#a81028] p-10 text-white lg:flex">
        {/* Abstract curve background pattern */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <svg className="h-full w-full" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
            <path d="M -200 400 Q 200 0 800 600" fill="none" stroke="white" strokeWidth="1" />
            <path d="M -200 500 Q 300 50 900 700" fill="none" stroke="white" strokeWidth="1" />
            <path d="M -200 600 Q 400 100 1000 800" fill="none" stroke="white" strokeWidth="1" />
            <path d="M -200 700 Q 500 150 1100 900" fill="none" stroke="white" strokeWidth="1" />
          </svg>
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center p-6">
          {/* Logo */}
          <div className="mb-10">
            <img src={logo} alt="Kande-Pohe Logo" className="h-20 w-auto object-contain brightness-0 invert" />
          </div>

          {/* <h1 className="mb-6 text-6xl font-extrabold leading-tight tracking-tight lg:text-7xl font-marathi-hand drop-shadow-md">
            यशस्वी जोड्या <span className="inline-block hover:animate-pulse text-yellow-300 font-sans">✨</span>
          </h1>
          <p className="max-w-md text-xl text-red-100 font-medium leading-relaxed font-marathi">
            जुळतील मनाचे धागे, पूर्ण होतील सर्व स्वप्ने.
          </p> */}
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full items-center justify-center p-8 sm:p-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Top Right Logo (Mobile only or consistent) */}
          <div className="mb-16 flex items-center justify-between lg:mb-24 lg:justify-end">
            <img src={logo} alt="Kande-Pohe Logo" className="h-10 w-auto object-contain block lg:hidden" />
          </div>

          <h2 className="mb-2 text-3xl font-bold text-gray-900">Welcome Back!</h2>
          <p className="mb-8 text-sm text-gray-500">
            Please enter your admin credentials to access the panel.
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Email/Username*
                </label>
                  <input
                    type="text"
                    id="email"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#e31e43] focus:outline-none focus:ring-1 focus:ring-[#e31e43] placeholder-gray-300 transition-colors"
                    placeholder="admin@example.com"
                    required
                  />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Password*
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#e31e43] focus:outline-none focus:ring-1 focus:ring-[#e31e43] placeholder-gray-300 transition-colors"
                    placeholder="************"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-[#e31e43] focus:ring-[#e31e43]"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-gray-600">
                    Remember me
                  </label>
                </div>
                {/* <div className="text-sm">
                  <a href="#" className="font-semibold text-[#a81028] hover:text-[#e31e43]">
                    Forgot password?
                  </a>
                </div> */}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center rounded-md bg-[#e31e43] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#c41535] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e31e43] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
      
      {/* Footer Text */}
      <div className="mt-8 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} Kande-Pohe Admin. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LoginPage;
