import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Globe, Mail, Lock, User, MapPin, Calendar, Briefcase, Building2, Users, Award, CheckCircle, Upload, X, ArrowRight, Phone, Flag } from 'lucide-react';

interface SignUpPageProps {
  onClose: () => void;
}

export default function SignUpPage({ onClose }: SignUpPageProps) {
  const [userType, setUserType] = useState<'player' | 'agent' | 'club'>('player');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Common fields
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    country: '',

    // Player fields
    position: '',
    age: '',
    currentClub: '',
    league: '',
    preferredFoot: '',
    height: '',
    weight: '',
    nationality: '',

    // Agent fields
    company: '',
    licenseNumber: '',
    yearsExperience: '',
    specialization: '',

    // Club fields
    clubName: '',
    clubType: '',
    founded: '',
    stadium: '',
    capacity: ''
  });

  const backgroundImages = [
    "https://images.unsplash.com/photo-1777529565014-2b0b39d0d250?w=1200",
    "https://images.unsplash.com/photo-1766525155813-e6375a0be54d?w=1200",
    "https://images.unsplash.com/flagged/photo-1550413231-202a9d53a331?w=1200"
  ];

  const [currentBgImage, setCurrentBgImage] = useState(0);

  // Auto-rotate background
  useState(() => {
    const interval = setInterval(() => {
      setCurrentBgImage((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col md:flex-row my-8">
        {/* Left Side - Dynamic Background */}
        <div className="md:w-2/5 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 relative overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Background Images */}
          <div className="absolute inset-0">
            {backgroundImages.map((img, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  idx === currentBgImage ? 'opacity-30' : 'opacity-0'
                }`}
              >
                <ImageWithFallback
                  src={img}
                  alt="Background"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-90"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold">Scoutify</span>
            </div>

            <h2 className="text-3xl font-bold mb-6">Join the Global Football Network</h2>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Connect Globally</h3>
                  <p className="text-sm text-blue-100">Access to 320+ verified clubs and 850+ professional agents worldwide</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Track Your Value</h3>
                  <p className="text-sm text-blue-100">Real-time market valuations updated daily with AI-powered analytics</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Showcase Your Talent</h3>
                  <p className="text-sm text-blue-100">Upload videos, stats, and achievements to stand out to scouts</p>
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="mt-12">
              <p className="text-sm text-blue-200 mb-3">Sign Up Progress</p>
              <div className="flex gap-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`flex-1 h-2 rounded-full transition-all ${
                      s <= step ? 'bg-white' : 'bg-white bg-opacity-30'
                    }`}
                  ></div>
                ))}
              </div>
              <p className="text-xs text-blue-100 mt-2">Step {step} of 3</p>
            </div>

            {/* Recent Sign Ups */}
            <div className="mt-12">
              <p className="text-sm font-semibold mb-4">Recently Joined</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Carlos M.</p>
                    <p className="text-xs text-blue-100">Forward • Spain • 2 min ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Lisa K.</p>
                    <p className="text-xs text-blue-100">Agent • Germany • 8 min ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-3/5 p-8 overflow-y-auto">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
            <p className="text-gray-600 mb-8">Get started in minutes - all fields are required</p>

            {/* User Type Selection - Step 1 */}
            {step === 1 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">I am a:</h3>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <button
                    onClick={() => setUserType('player')}
                    className={`p-6 rounded-xl border-2 transition ${
                      userType === 'player'
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Users className="w-8 h-8 mx-auto mb-3" />
                    <p className="font-semibold">Player</p>
                    <p className="text-xs text-gray-600 mt-1">Showcase your talent</p>
                  </button>
                  <button
                    onClick={() => setUserType('agent')}
                    className={`p-6 rounded-xl border-2 transition ${
                      userType === 'agent'
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Award className="w-8 h-8 mx-auto mb-3" />
                    <p className="font-semibold">Agent</p>
                    <p className="text-xs text-gray-600 mt-1">Build your roster</p>
                  </button>
                  <button
                    onClick={() => setUserType('club')}
                    className={`p-6 rounded-xl border-2 transition ${
                      userType === 'club'
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Building2 className="w-8 h-8 mx-auto mb-3" />
                    <p className="font-semibold">Club/Scout</p>
                    <p className="text-xs text-gray-600 mt-1">Find talent</p>
                  </button>
                </div>

                {/* Basic Information */}
                <h3 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Country *
                    </label>
                    <div className="relative">
                      <Flag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                        required
                      >
                        <option value="">Select Country</option>
                        <option value="England">England</option>
                        <option value="Spain">Spain</option>
                        <option value="Germany">Germany</option>
                        <option value="Italy">Italy</option>
                        <option value="France">France</option>
                        <option value="Brazil">Brazil</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Portugal">Portugal</option>
                        <option value="Netherlands">Netherlands</option>
                        <option value="Belgium">Belgium</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 - Specific Information */}
            {step === 2 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  {userType === 'player' ? 'Player Information' : userType === 'agent' ? 'Agent Details' : 'Club Information'}
                </h3>

                {/* Player Fields */}
                {userType === 'player' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Position *</label>
                        <select
                          name="position"
                          value={formData.position}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Position</option>
                          <option value="Goalkeeper">Goalkeeper</option>
                          <option value="Defender">Defender</option>
                          <option value="Midfielder">Midfielder</option>
                          <option value="Forward">Forward</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Age *</label>
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          placeholder="25"
                          min="16"
                          max="45"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Current Club *</label>
                      <input
                        type="text"
                        name="currentClub"
                        value={formData.currentClub}
                        onChange={handleInputChange}
                        placeholder="e.g., Manchester United or Free Agent"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">League *</label>
                      <select
                        name="league"
                        value={formData.league}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select League</option>
                        <option value="Premier League">Premier League</option>
                        <option value="La Liga">La Liga</option>
                        <option value="Serie A">Serie A</option>
                        <option value="Bundesliga">Bundesliga</option>
                        <option value="Ligue 1">Ligue 1</option>
                        <option value="Other">Other / Free Agent</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Foot *</label>
                        <select
                          name="preferredFoot"
                          value={formData.preferredFoot}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select</option>
                          <option value="Right">Right</option>
                          <option value="Left">Left</option>
                          <option value="Both">Both</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Height (cm) *</label>
                        <input
                          type="number"
                          name="height"
                          value={formData.height}
                          onChange={handleInputChange}
                          placeholder="180"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (kg) *</label>
                        <input
                          type="number"
                          name="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          placeholder="75"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Agent Fields */}
                {userType === 'agent' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Agency Name *</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder="Elite Sports Management"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Agent License Number *</label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        placeholder="FIFA/FA License Number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Years of Experience *</label>
                        <input
                          type="number"
                          name="yearsExperience"
                          value={formData.yearsExperience}
                          onChange={handleInputChange}
                          placeholder="5"
                          min="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization *</label>
                        <select
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select</option>
                          <option value="Youth Players">Youth Players</option>
                          <option value="Professional">Professional</option>
                          <option value="International">International</option>
                          <option value="All Levels">All Levels</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700">
                        <strong>Note:</strong> Your license will be verified by our team within 24-48 hours. You'll receive full access once verified.
                      </p>
                    </div>
                  </div>
                )}

                {/* Club Fields */}
                {userType === 'club' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Club Name *</label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="clubName"
                          value={formData.clubName}
                          onChange={handleInputChange}
                          placeholder="Manchester United FC"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Club Type *</label>
                      <select
                        name="clubType"
                        value={formData.clubType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="Professional Club">Professional Club</option>
                        <option value="Academy">Academy</option>
                        <option value="Semi-Professional">Semi-Professional</option>
                        <option value="Scouting Agency">Scouting Agency</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Founded Year *</label>
                        <input
                          type="number"
                          name="founded"
                          value={formData.founded}
                          onChange={handleInputChange}
                          placeholder="1878"
                          min="1800"
                          max="2026"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Stadium Capacity</label>
                        <input
                          type="number"
                          name="capacity"
                          value={formData.capacity}
                          onChange={handleInputChange}
                          placeholder="50000"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Stadium Name</label>
                      <input
                        type="text"
                        name="stadium"
                        value={formData.stadium}
                        onChange={handleInputChange}
                        placeholder="Old Trafford"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700">
                        <strong>Verification Required:</strong> Your club will be verified by our team. You'll need to provide official documentation.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3 - Security & Confirmation */}
            {step === 3 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Security & Profile</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters with numbers and letters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Profile Photo Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Photo (Optional)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-3 pt-4">
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="w-5 h-5 text-blue-600 rounded mt-0.5" required />
                      <span className="text-sm text-gray-700">
                        I agree to Scoutify's <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                      </span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="w-5 h-5 text-blue-600 rounded mt-0.5" />
                      <span className="text-sm text-gray-700">
                        Send me updates about new features, transfer opportunities, and platform news
                      </span>
                    </label>
                  </div>

                  {/* Summary */}
                  <div className="bg-gray-50 rounded-lg p-6 mt-6">
                    <h4 className="font-bold text-gray-900 mb-3">Account Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Type:</span>
                        <span className="font-semibold text-gray-900 capitalize">{userType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-semibold text-gray-900">{formData.fullName || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-semibold text-gray-900">{formData.email || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Country:</span>
                        <span className="font-semibold text-gray-900">{formData.country || 'Not selected'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
                >
                  Create Account
                  <CheckCircle className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Sign In Link */}
            <p className="text-center text-gray-600 mt-6">
              Already have an account?{' '}
              <button className="text-blue-600 font-semibold hover:text-blue-700">
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
