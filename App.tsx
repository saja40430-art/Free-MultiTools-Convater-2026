import React, { useState } from 'react';
import { ToolCategory, ToolDef } from './types';
import { 
    Image, Minimize, Crop, Video, Music, Scissors, Calendar, 
    DollarSign, TrendingUp, QrCode, Lock, Type, FileCode, 
    Droplet, Mic, Speaker, FileJson, Ruler, Activity, Watch,
    Sparkles, X, PenTool, Search
} from 'lucide-react';
import { ImageConverter, ImageCompressor, ImageCropper } from './components/tools/ImageTools';
import { VideoConverter, AudioConverter, AudioTrimmer, TextToSpeech, SpeechToText } from './components/tools/MediaTools';
import { AgeCalculator, EMICalculator, SIPCalculator, BMICalculator } from './components/tools/Calculators';
import { QRGenerator, PasswordGenerator, WordCounter, Base64Tool, JsonFormatter, UnitConverter, ColorPicker, TimerTool } from './components/tools/TextTools';
import { GeminiAssistant, BlogIdeaGenerator } from './components/tools/GeminiTool';

// Tool Registry
const tools: ToolDef[] = [
    { id: 'img-conv', title: 'Image Converter', description: 'Convert JPG, PNG, WEBP', icon: <Image />, category: ToolCategory.IMAGE, component: <ImageConverter /> },
    { id: 'img-comp', title: 'Image Compressor', description: 'Reduce file size', icon: <Minimize />, category: ToolCategory.IMAGE, component: <ImageCompressor /> },
    { id: 'img-crop', title: 'Image Cropper', description: 'Crop & Export', icon: <Crop />, category: ToolCategory.IMAGE, component: <ImageCropper /> },
    { id: 'vid-conv', title: 'Video Converter', description: 'MP4 to WebM', icon: <Video />, category: ToolCategory.AUDIO_VIDEO, component: <VideoConverter /> },
    { id: 'aud-conv', title: 'Audio Converter', description: 'Convert Audio Formats', icon: <Music />, category: ToolCategory.AUDIO_VIDEO, component: <AudioConverter /> },
    { id: 'aud-trim', title: 'Audio Trimmer', description: 'Trim Audio Clips', icon: <Scissors />, category: ToolCategory.AUDIO_VIDEO, component: <AudioTrimmer /> },
    { id: 'age-calc', title: 'Age Calculator', description: 'Calculate exact age', icon: <Calendar />, category: ToolCategory.CALCULATOR, component: <AgeCalculator /> },
    { id: 'emi-calc', title: 'EMI Calculator', description: 'Loan EMI Planner', icon: <DollarSign />, category: ToolCategory.CALCULATOR, component: <EMICalculator /> },
    { id: 'sip-calc', title: 'SIP Calculator', description: 'Investment Return', icon: <TrendingUp />, category: ToolCategory.CALCULATOR, component: <SIPCalculator /> },
    { id: 'qr-gen', title: 'QR Generator', description: 'Create QR Codes', icon: <QrCode />, category: ToolCategory.UTILITY, component: <QRGenerator /> },
    { id: 'pass-gen', title: 'Password Gen', description: 'Secure Passwords', icon: <Lock />, category: ToolCategory.UTILITY, component: <PasswordGenerator /> },
    { id: 'word-cnt', title: 'Word Counter', description: 'Count text stats', icon: <Type />, category: ToolCategory.TEXT, component: <WordCounter /> },
    { id: 'base64', title: 'Base64 Tool', description: 'Encode/Decode', icon: <FileCode />, category: ToolCategory.TEXT, component: <Base64Tool /> },
    { id: 'color', title: 'Color Picker', description: 'HEX, RGB, HSL', icon: <Droplet />, category: ToolCategory.UTILITY, component: <ColorPicker /> },
    { id: 'tts', title: 'Text to Speech', description: 'Listen to text', icon: <Speaker />, category: ToolCategory.AUDIO_VIDEO, component: <TextToSpeech /> },
    { id: 'stt', title: 'Speech to Text', description: 'Voice typing', icon: <Mic />, category: ToolCategory.AUDIO_VIDEO, component: <SpeechToText /> },
    { id: 'json', title: 'JSON Formatter', description: 'Validate JSON', icon: <FileJson />, category: ToolCategory.TEXT, component: <JsonFormatter /> },
    { id: 'unit', title: 'Unit Converter', description: 'Convert Length/Wt', icon: <Ruler />, category: ToolCategory.UTILITY, component: <UnitConverter /> },
    { id: 'bmi', title: 'BMI Calculator', description: 'Health Index', icon: <Activity />, category: ToolCategory.CALCULATOR, component: <BMICalculator /> },
    { id: 'timer', title: 'Stopwatch', description: 'Timer tool', icon: <Watch />, category: ToolCategory.UTILITY, component: <TimerTool /> },
    // AI Tools
    { id: 'gemini', title: 'Gemini Assistant', description: 'AI Powerhouse', icon: <Sparkles className="text-gold-400" />, category: ToolCategory.AI, component: <GeminiAssistant /> },
    { id: 'blog-idea', title: 'Blog Idea Gen', description: 'AI Blog Topics', icon: <PenTool className="text-gold-400" />, category: ToolCategory.AI, component: <BlogIdeaGenerator /> },
];

export default function App() {
  const [activeTool, setActiveTool] = useState<ToolDef | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', ...Object.values(ToolCategory)];

  const filteredTools = tools.filter(tool => {
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-navy-900 text-light font-sans selection:bg-gold-400 selection:text-navy-900">
      
      {/* Header */}
      <header className="bg-navy-800 shadow-lg sticky top-0 z-20 border-b border-navy-700">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🦜</span>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-gold-400 bg-clip-text text-transparent hidden sm:block">
              Sajahan MultiTool Hub
            </h1>
            <h1 className="text-xl font-bold text-white sm:hidden">
              Sajahan Hub
            </h1>
          </div>
          
          {activeTool ? (
            <button 
                onClick={() => setActiveTool(null)}
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 shrink-0"
            >
                <X size={20} /> <span className="hidden sm:inline">Close Tool</span>
            </button>
          ) : (
            <div className="relative flex-1 max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-navy-600 rounded-full leading-5 bg-navy-900 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-navy-800 focus:border-gold-400 focus:ring-1 focus:ring-gold-400 sm:text-sm transition-colors"
                    placeholder="Search tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        
        {/* Tool View (Modal/Overlay replacement) */}
        {activeTool ? (
          <div className="animate-fade-in max-w-4xl mx-auto">
             <div className="bg-navy-800 rounded-xl shadow-2xl overflow-hidden border border-navy-700">
                <div className="p-6 border-b border-navy-700 flex justify-between items-center bg-navy-900/50">
                    <div className="flex items-center gap-3">
                        <div className="text-gold-400">{activeTool.icon}</div>
                        <h2 className="text-2xl font-bold text-white">{activeTool.title}</h2>
                    </div>
                </div>
                <div className="p-6 md:p-8">
                    {activeTool.component}
                </div>
             </div>
          </div>
        ) : (
          /* Grid View */
          <>
            {/* Category Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-8 animate-fade-in sticky top-[72px] z-10 py-2 bg-navy-900/80 backdrop-blur-sm -mx-4 px-4 md:static md:bg-transparent md:p-0">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 transform ${
                            selectedCategory === cat
                            ? 'bg-gold-400 text-navy-900 shadow-[0_0_15px_rgba(255,215,0,0.3)] scale-105'
                            : 'bg-navy-800 text-gray-400 border border-navy-700 hover:border-gold-400 hover:text-gold-400 hover:scale-105'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTools.map((tool) => (
                <div 
                    key={tool.id}
                    onClick={() => setActiveTool(tool)}
                    className="group bg-navy-700 rounded-xl p-6 cursor-pointer hover:bg-gold-400 hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] border border-transparent hover:border-gold-500 flex flex-col h-full"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="text-gold-400 group-hover:text-navy-900 transition-colors duration-300">
                            {React.cloneElement(tool.icon as React.ReactElement, { size: 32 })}
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-navy-900/50 text-gray-300 group-hover:bg-navy-900 group-hover:text-gold-400 transition-colors">
                            {tool.category}
                        </span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 group-hover:text-navy-900 transition-colors">{tool.title}</h3>
                    <p className="text-gray-400 text-sm group-hover:text-navy-800 transition-colors line-clamp-2 flex-grow">
                    {tool.description}
                    </p>
                    
                    <button className="mt-5 w-full py-2 bg-green-600 text-white font-bold rounded-md shadow-md hover:bg-green-700 transition-colors group-hover:bg-navy-900 group-hover:text-gold-400">
                        Open Tool
                    </button>
                </div>
                ))}
            </div>
            
            {filteredTools.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                    <p>No tools found matching "{searchQuery}"</p>
                </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Sajahan MultiTool Hub. Powered by React & Gemini.</p>
      </footer>
    </div>
  );
}