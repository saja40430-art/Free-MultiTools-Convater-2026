import React, { useState, useRef, useEffect } from 'react';
import { generateAIResponse } from '../../services/geminiService';
import { Button } from '../ui/Button';
import { Copy, Check } from 'lucide-react';

// A Super Tool that integrates text and simple reasoning
export const GeminiAssistant: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAsk = async () => {
        if(!prompt) return;
        setLoading(true);
        const res = await generateAIResponse(prompt);
        setResponse(res || "No response.");
        setLoading(false);
    }

    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="bg-navy-800 p-4 rounded-lg flex-1 overflow-auto min-h-[200px] border border-navy-600">
                {response ? (
                    <div className="whitespace-pre-wrap">{response}</div>
                ) : (
                    <div className="text-gray-500 italic text-center mt-10">Ask Gemini anything...</div>
                )}
            </div>
            <div className="flex gap-2">
                <input 
                    type="text" 
                    className="flex-1 bg-navy-700 border border-navy-600 rounded px-4 py-2 focus:border-gold-400 outline-none"
                    placeholder="Type your question..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                />
                <Button onClick={handleAsk} disabled={loading}>
                    {loading ? 'Thinking...' : 'Send'}
                </Button>
            </div>
        </div>
    );
}

export const BlogIdeaGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [ideas, setIdeas] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const resultsRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when ideas update
    useEffect(() => {
        if (resultsRef.current) {
            resultsRef.current.scrollTop = resultsRef.current.scrollHeight;
        }
    }, [ideas]);

    const handleGenerate = async (append: boolean = false) => {
        if(!topic.trim()) return;
        setLoading(true);
        
        let prompt = `You are a creative content strategist. `;
        
        if (append && ideas) {
            // Count existing items to continue numbering roughly
            const count = (ideas.match(/^\d+\./gm) || []).length;
            const nextNum = count + 1;
            
            prompt += `I have already generated these blog post ideas for the topic "${topic}":\n\n${ideas}\n\n`;
            prompt += `Please generate 5 *NEW and DIFFERENT* engaging blog post ideas for the same topic. Do not repeat the ones listed above. `;
            prompt += `IMPORTANT: Start numbering the new list from ${nextNum}. `;
        } else {
            prompt += `Generate 5 engaging blog post ideas for the topic: "${topic}". `;
        }
        
        prompt += `For each idea, provide:
        1. A catchy, SEO-friendly title.
        2. A brief 1-sentence hook or summary.
        Format the output clearly with numbering.`;
        
        const response = await generateAIResponse(prompt);
        
        if (response) {
            if (append) {
                setIdeas(prev => prev + "\n\n" + response);
            } else {
                setIdeas(response);
            }
        } else if (!append) {
            setIdeas("No ideas generated. Please try again.");
        }
        
        setLoading(false);
    }

    const handleCopy = () => {
        if (!ideas) return;
        navigator.clipboard.writeText(ideas);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-4">
             <div>
                <label className="block text-sm text-gray-400 mb-2">Enter your blog topic</label>
                <input 
                    type="text" 
                    className="w-full bg-navy-700 border border-navy-600 rounded px-4 py-2 text-white focus:border-gold-400 outline-none transition-colors"
                    placeholder="e.g. Artificial Intelligence, Healthy Cooking, Remote Work..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate(false)}
                />
            </div>
            
            <div className="flex gap-2">
                <Button fullWidth onClick={() => handleGenerate(false)} disabled={loading || !topic.trim()}>
                    {loading && !ideas ? 'Brainstorming...' : 'Generate Ideas'}
                </Button>
                {ideas && (
                    <Button variant="secondary" onClick={() => handleGenerate(true)} disabled={loading}>
                        {loading ? 'Adding...' : 'Generate More'}
                    </Button>
                )}
            </div>
            
            {ideas && (
                <div className="mt-6 animate-fade-in">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-gold-400 font-bold">Generated Ideas:</h3>
                        <button 
                            onClick={handleCopy}
                            className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-bold transition-all duration-300 border ${
                                copied 
                                ? 'bg-green-500/20 border-green-500 text-green-400' 
                                : 'bg-navy-800 border-navy-600 text-gray-300 hover:border-gold-400 hover:text-gold-400'
                            }`}
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copied!' : 'Copy All'}
                        </button>
                    </div>
                    <div 
                        ref={resultsRef}
                        className="bg-navy-900/50 p-6 rounded-lg border border-navy-700 whitespace-pre-wrap leading-relaxed text-gray-300 shadow-inner max-h-[500px] overflow-y-auto custom-scrollbar"
                    >
                        {ideas}
                    </div>
                </div>
            )}
        </div>
    )
}