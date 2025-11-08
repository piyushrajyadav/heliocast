import { useRef } from 'react';
import HeroSection from './components/HeroSection';
import ForecastForm from './components/ForecastForm';
import { GLSLHills } from './components/ui/glsl-hills';

function App() {
  const forecastRef = useRef<HTMLDivElement>(null);

  const scrollToForecast = () => {
    forecastRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Animated Background */}
      <HeroSection onGetStarted={scrollToForecast} />

      {/* Main Content with GLSL Hills Background */}
      <div className="relative min-h-screen pb-20">
        {/* Animated Hills Background - positioned absolutely within this section */}
        <div className="absolute inset-0 overflow-hidden">
          <GLSLHills width="100%" height="100%" />
        </div>

        {/* Content Layer */}
        <main className="relative z-10 container mx-auto px-4 py-12" ref={forecastRef}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Start Your Forecast
            </h2>
            <p className="text-gray-600">
              Enter weather conditions or view the 24-hour forecast
            </p>
          </div>

          <ForecastForm />
        </div>
      </main>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-orange-200 bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>HelioCast © 2025 • Powered by TensorFlow & React</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
