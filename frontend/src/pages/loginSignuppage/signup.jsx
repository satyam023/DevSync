import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../context/authContext.jsx';
import API from '../../utils/axios.jsx';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', bio: '', gender: 'other',
    password: '', role: 'learner', rates: '', skills: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const isValid = formData.name && formData.email && formData.password && formData.role && formData.gender &&
      (formData.role !== 'recruiter' ? formData.skills : true) &&
      (['mentor', 'developer'].includes(formData.role) ? formData.rates : true);
    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'rates' && !['mentor', 'developer'].includes(formData.role)) return;
        if (key === 'skills' && formData.role === 'recruiter') return;
        if (key === 'rates') {
          const rateKey = formData.role === 'mentor' ? 'rates[mentor]' : 'rates[developer]';
          data.append(rateKey, value);
        } else {
          data.append(key, value);
        }
      });
      if (imageFile) data.append('image', imageFile);

      const res = await API.post('/auth/signup', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser(res.data.user);
      navigate('/home');
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl p-8 rounded-xl shadow-md  mt-5 mb-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Your Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} required />

          {/* Email */}
          <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />

          {/* Bio */}
          <InputField label="Short Bio" name="bio" value={formData.bio} onChange={handleChange} isTextarea />

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </button>
            </div>
          </div>

          {/* Role and Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="Role" name="role" value={formData.role} onChange={handleChange}
              options={['learner', 'mentor', 'developer', 'recruiter']} />
            <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleChange}
              options={['other', 'male', 'female']} />
          </div>

          {/* Skills */}
          {formData.role !== 'recruiter' && (
            <InputField label="Skills (comma-separated)" name="skills" value={formData.skills} onChange={handleChange} required />
          )}

          {/* Rates */}
          {['mentor', 'developer'].includes(formData.role) && (
            <InputField
              label={formData.role === 'mentor' ? 'Monthly Rate (₹)' : 'Project Rate (₹)'}
              name="rates"
              type="number"
              value={formData.rates}
              onChange={handleChange}
              required
            />
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
            <label className="flex flex-col items-center px-4 py-3 bg-white text-blue-600 rounded-lg border-2 border-dashed border-blue-300 cursor-pointer hover:bg-blue-50">
              <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-center">
                {imageFile ? imageFile.name : <>Click to upload<br /><span className="text-xs text-gray-500">PNG, JPG up to 5MB</span></>}
              </span>
              <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition ${isFormValid && !loading ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'}`}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-blue-600 hover:text-blue-800 font-medium">
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, required, type = 'text', isTextarea = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required ? ' *' : ''}</label>
    {isTextarea ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows="2"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    )}
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label} *</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      {options.map(opt => (
        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
      ))}
    </select>
  </div>
);

export default Signup;
