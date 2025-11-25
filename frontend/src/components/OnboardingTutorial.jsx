import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  VolumeX,
  Smartphone,
  Grid,
  BookOpen,
  User,
  Mic,
  Trophy,
  Target,
  Zap
} from 'lucide-react';

const OnboardingTutorial = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    {
      title: "Welcome to GramSathi! 🎉",
      titleHindi: "GramSathi में आपका स्वागत है! 🎉",
      description: "Your personal guide to learn digital government services safely.",
      descriptionHindi: "सरकारी डिजिटल सेवाओं को सीखने का सबसे आसान तरीका।",
      audio: "GramSathi mein aapka swagat hai. Yeh aapka digital teacher hai.",
      icon: <Smartphone className="text-blue-600" size={48} />,
      position: "center"
    },
    {
      title: "Dashboard - Your Home",
      titleHindi: "डैशबोर्ड - आपका होम पेज",
      description: "See your learning progress, daily challenges, and quick access to services.",
      descriptionHindi: "अपनी प्रगति देखें, रोज़ की चुनौतियां, और सेवाओं का उपयोग करें।",
      audio: "Dashboard par aapko daily challenge aur services milenge. Yahaan aapka naam aur points dikhte hain.",
      icon: <Trophy className="text-orange-600" size={48} />,
      highlight: "dashboard",
      position: "bottom-left"
    },
    {
      title: "Practice Section - Safe Learning",
      titleHindi: "प्रैक्टिस सेक्शन - सुरक्षित सीखना",
      description: "Learn UPI payments, form filling, and more in a SAFE practice environment - no real money used!",
      descriptionHindi: "UPI, फॉर्म भरना सीखें। कोई असली पैसा नहीं - बिल्कुल सुरक्षित!",
      audio: "Practice section mein aap UPI aur form bharna seekh sakte hain. Bilkul safe hai, koi paisa nahi lagta.",
      icon: <Grid className="text-purple-600" size={48} />,
      highlight: "services",
      position: "bottom-center"
    },
    {
      title: "Learning Videos & Quizzes",
      titleHindi: "सीखने के वीडियो और क्विज़",
      description: "Watch step-by-step tutorials in Hindi. Take quizzes to earn points and certificates!",
      descriptionHindi: "हिंदी में वीडियो देखें। क्विज़ दें और पॉइंट्स, सर्टिफिकेट पाएं!",
      audio: "Learn section mein Hindi videos hain. Quiz dekar points kamayen aur certificate payen.",
      icon: <BookOpen className="text-green-600" size={48} />,
      highlight: "learn",
      position: "bottom-center-left"
    },
    {
      title: "Voice Search - Speak to Navigate 🎤",
      titleHindi: "आवाज़ से खोजें - बोलकर जाएं 🎤",
      description: "Can't type? Just speak! Say 'UPI', 'Mandi', 'Doctor' to navigate instantly.",
      descriptionHindi: "टाइप नहीं कर सकते? बोलें! 'UPI', 'मंडी', 'डॉक्टर' बोलकर तुरंत जाएं।",
      audio: "Dashboard par microphone button dabayein aur boliye - UPI, Mandi ya Doctor. Turant khul jayega.",
      icon: <Mic className="text-red-600" size={48} />,
      highlight: "search",
      position: "top"
    },
    {
      title: "Earn Points & Track Progress",
      titleHindi: "पॉइंट्स कमाएं और प्रगति देखें",
      description: "Complete lessons to earn points. See your score grow as you master digital skills!",
      descriptionHindi: "हर लेसन पूरा करने पर पॉइंट्स मिलते हैं। अपना स्कोर बढ़ते देखें!",
      audio: "Har lesson complete karne par aapko points milenge. Aapka score badhta rahega.",
      icon: <Zap className="text-yellow-600" size={48} />,
      highlight: "profile",
      position: "top-right"
    },
    {
      title: "Your Profile & Certificates",
      titleHindi: "आपकी प्रोफाइल और सर्टिफिकेट",
      description: "Track your total score, download certificates, and share your achievements!",
      descriptionHindi: "अपना कुल स्कोर देखें, सर्टिफिकेट डाउनलोड करें और शेयर करें!",
      audio: "Profile mein aapka total score aur certificate milega. Download karke share kar sakte hain.",
      icon: <User className="text-blue-600" size={48} />,
      highlight: "profile",
      position: "bottom-right"
    },
    {
      title: "Ready to Start Your Journey! 🚀",
      titleHindi: "शुरू करने के लिए तैयार! 🚀",
      description: "You can replay this tutorial anytime by clicking 'Tutorial' button. Let's begin your digital learning journey!",
      descriptionHindi: "यह ट्यूटोरियल आप 'Tutorial' बटन दबाकर फिर से देख सकते हैं। चलिए शुरू करें!",
      audio: "Aap bilkul taiyar hain! Tutorial button dabake phir se dekh sakte hain. Ab shuru karte hain!",
      icon: <Target className="text-green-600" size={48} />,
      position: "center"
    }
  ];

  const speak = (text) => {
    if (!isAudioEnabled || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.85;
    utterance.pitch = 1;
    
    // Try to find a Hindi female voice
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => 
      v.lang.includes('hi') && 
      (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira'))
    );
    if (hindiVoice) utterance.voice = hindiVoice;
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    // Ensure voices are loaded
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }

    // Speak when step changes
    if (isAudioEnabled) {
      setTimeout(() => speak(steps[currentStep].audio), 200);
    }
    
    return () => window.speechSynthesis.cancel();
  }, [currentStep, isAudioEnabled]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    window.speechSynthesis.cancel();
    localStorage.setItem('onboarding_completed', 'true');
    if (onComplete) onComplete();
  };

  const toggleAudio = () => {
    if (isAudioEnabled) {
      window.speechSynthesis.cancel();
    } else {
      speak(steps[currentStep].audio);
    }
    setIsAudioEnabled(!isAudioEnabled);
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-in fade-in">
      {/* Tutorial Card */}
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header with Progress */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
          <button
            onClick={handleComplete}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition"
            aria-label="Close tutorial"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <div className="text-white">
                {currentStepData.icon}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium opacity-90 mb-1">
                Step {currentStep + 1} of {steps.length}
              </div>
              <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              {currentStepData.icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentStepData.titleHindi}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {currentStepData.title}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-5 mb-6">
            <p className="text-gray-900 font-medium mb-2 leading-relaxed text-base">
              {currentStepData.descriptionHindi}
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              {currentStepData.description}
            </p>
          </div>

          {/* Audio Control */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <button
              onClick={toggleAudio}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm ${
                isAudioEnabled
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              {isAudioEnabled ? (
                <>
                  {isPlaying ? (
                    <Volume2 size={18} className="animate-pulse" />
                  ) : (
                    <Volume2 size={18} />
                  )}
                  Voice ON
                </>
              ) : (
                <>
                  <VolumeX size={18} />
                  Voice OFF
                </>
              )}
            </button>
            
            {isAudioEnabled && (
              <button
                onClick={() => speak(currentStepData.audio)}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition shadow-sm border border-gray-200"
              >
                🔄 Replay
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition active:scale-95"
              >
                <ChevronLeft size={20} />
                Back
              </button>
            )}
            
            <button
              onClick={handleNext}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition shadow-lg active:scale-95 ${
                currentStep === steps.length - 1
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {currentStep === steps.length - 1 ? (
                <>
                  Start Learning
                  <ChevronRight size={20} />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>

          <button
            onClick={handleComplete}
            className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700 transition font-medium"
          >
            Skip Tutorial
          </button>
        </div>
      </div>

      {/* Optional Visual Highlight Pulse (shows where features are located) */}
      {currentStepData.highlight && currentStepData.position !== 'center' && (
        <div className="absolute inset-0 pointer-events-none">
          {currentStepData.position === 'bottom-left' && (
            <div className="absolute bottom-8 left-8 md:left-auto md:bottom-8">
              <div className="relative">
                <div className="absolute w-20 h-20 border-4 border-yellow-400 rounded-full animate-ping opacity-75" />
                <div className="absolute w-20 h-20 border-4 border-yellow-500 rounded-full" />
              </div>
            </div>
          )}
          {currentStepData.position === 'bottom-center' && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:bottom-8">
              <div className="relative">
                <div className="absolute w-20 h-20 border-4 border-yellow-400 rounded-full animate-ping opacity-75" />
                <div className="absolute w-20 h-20 border-4 border-yellow-500 rounded-full" />
              </div>
            </div>
          )}
          {currentStepData.position === 'top' && (
            <div className="absolute top-24 right-8">
              <div className="relative">
                <div className="absolute w-20 h-20 border-4 border-yellow-400 rounded-full animate-ping opacity-75" />
                <div className="absolute w-20 h-20 border-4 border-yellow-500 rounded-full" />
              </div>
            </div>
          )}
          {currentStepData.position === 'top-right' && (
            <div className="absolute top-8 right-8">
              <div className="relative">
                <div className="absolute w-20 h-20 border-4 border-yellow-400 rounded-full animate-ping opacity-75" />
                <div className="absolute w-20 h-20 border-4 border-yellow-500 rounded-full" />
              </div>
            </div>
          )}
          {currentStepData.position === 'bottom-right' && (
            <div className="absolute bottom-8 right-8 md:right-auto md:bottom-8">
              <div className="relative">
                <div className="absolute w-20 h-20 border-4 border-yellow-400 rounded-full animate-ping opacity-75" />
                <div className="absolute w-20 h-20 border-4 border-yellow-500 rounded-full" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OnboardingTutorial;