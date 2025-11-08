import { Sun, Zap, TrendingUp, CloudSun, Brain } from 'lucide-react';
import FractalMountains from './ui/mountainous-shader';
import { Button } from './ui/button';

interface HeroSectionProps {
  onGetStarted?: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <div className="relative w-full h-[650px] overflow-hidden">
      {/* Animated Background Shader */}
      <div className="absolute inset-0 z-0">
        <FractalMountains speed={0.3} octaves={6} scale={2.5} />
      </div>

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/20 z-10" />
      
      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-br from-orange-500/20 to-amber-500/20 backdrop-blur-sm border border-orange-500/30 rounded-2xl shadow-xl mb-8">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg">
                <Sun className="h-8 w-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  HelioCast
                </h1>
                <p className="text-orange-200 text-sm">AI Solar Forecasting</p>
              </div>
            </div>

            {/* Main Headline */}
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Solar Power Forecasting
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
                Made Intelligent
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed max-w-3xl mx-auto">
              Leverage advanced Bidirectional LSTM neural networks to predict solar energy generation. 
            </p>

            {/* CTA Button */}
            <div className="flex justify-center mb-12">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-10 py-7 text-lg font-semibold shadow-2xl shadow-orange-500/40 transition-all duration-300 transform hover:scale-105 hover:shadow-orange-500/60"
              >
                <Zap className="mr-2 h-6 w-6" />
                Start Predicting Now
              </Button>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              <div className="px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-medium text-white shadow-lg">
                <CloudSun className="inline h-4 w-4 mr-2 text-orange-300" />
                Weather Analysis
              </div>
              <div className="px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-medium text-white shadow-lg">
                <TrendingUp className="inline h-4 w-4 mr-2 text-amber-300" />
                24h Forecasting
              </div>
              <div className="px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-medium text-white shadow-lg">
                <Zap className="inline h-4 w-4 mr-2 text-yellow-300" />
                Real-Time Predictions
              </div>
             
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade to blend with page */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-orange-50 via-amber-50/80 to-transparent z-10" />
    </div>
  );
}
