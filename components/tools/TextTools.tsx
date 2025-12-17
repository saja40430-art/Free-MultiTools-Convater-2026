import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { Button } from '../ui/Button';

// --- Tool 10: QR Generator ---
export const QRGenerator: React.FC = () => {
    const [text, setText] = useState('https://google.com');
    
    const download = () => {
        const svg = document.getElementById("qr-code-svg");
        if(svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx?.drawImage(img, 0, 0);
                const a = document.createElement("a");
                a.href = canvas.toDataURL("image/png");
                a.download = "qrcode.png";
                a.click();
            };
            img.src = "data:image/svg+xml;base64," + btoa(svgData);
        }
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            <input type="text" value={text} onChange={e => setText(e.target.value)} className="w-full bg-navy-700 p-2 rounded text-white" />
            <div className="bg-white p-4 rounded">
                <QRCode id="qr-code-svg" value={text} size={200} />
            </div>
            <Button onClick={download}>Download QR</Button>
        </div>
    )
}

// --- Tool 11: Password Generator ---
export const PasswordGenerator: React.FC = () => {
    const [len, setLen] = useState(12);
    const [pass, setPass] = useState('');

    const generate = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
        let res = "";
        for(let i=0; i<len; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
        setPass(res);
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <label>Length: {len}</label>
                <input type="range" min="6" max="30" value={len} onChange={e=>setLen(Number(e.target.value))} />
            </div>
            <div className="bg-navy-900 p-4 rounded text-gold-400 font-mono text-center break-all">{pass || 'Click Generate'}</div>
            <Button fullWidth onClick={generate}>Generate Password</Button>
        </div>
    )
}

// --- Tool 12: Word Counter ---
export const WordCounter: React.FC = () => {
    const [text, setText] = useState('');
    const stats = {
        words: text.trim() ? text.trim().split(/\s+/).length : 0,
        chars: text.length,
        spaces: text.split(' ').length - 1,
        time: Math.ceil(text.trim().split(/\s+/).length / 200) + ' min'
    };

    return (
        <div className="space-y-4">
            <textarea className="w-full h-40 bg-navy-700 p-2 rounded" value={text} onChange={e=>setText(e.target.value)} placeholder="Type here..."></textarea>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-sm">
                <div className="bg-navy-800 p-2 rounded"><div className="text-gold-400 font-bold">{stats.words}</div>Words</div>
                <div className="bg-navy-800 p-2 rounded"><div className="text-gold-400 font-bold">{stats.chars}</div>Chars</div>
                <div className="bg-navy-800 p-2 rounded"><div className="text-gold-400 font-bold">{stats.spaces}</div>Spaces</div>
                <div className="bg-navy-800 p-2 rounded"><div className="text-gold-400 font-bold">{stats.time}</div>Read Time</div>
            </div>
        </div>
    )
}

// --- Tool 13: Base64 ---
export const Base64Tool: React.FC = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    return (
        <div className="space-y-4">
            <textarea className="w-full bg-navy-700 p-2 rounded" value={input} onChange={e=>setInput(e.target.value)} placeholder="Input" />
            <div className="flex gap-2">
                <Button onClick={() => setOutput(btoa(input))} fullWidth>Encode</Button>
                <Button onClick={() => { try { setOutput(atob(input)) } catch(e) { alert("Invalid Base64") } }} fullWidth variant="secondary">Decode</Button>
            </div>
            <textarea className="w-full bg-navy-900 p-2 rounded text-gold-400" value={output} readOnly placeholder="Output" />
        </div>
    )
}

// --- Tool 17: JSON Formatter ---
export const JsonFormatter: React.FC = () => {
    const [input, setInput] = useState('');
    const [error, setError] = useState('');

    const format = () => {
        try {
            const parsed = JSON.parse(input);
            setInput(JSON.stringify(parsed, null, 4));
            setError('');
        } catch(e) {
            setError("Invalid JSON");
        }
    }

    return (
        <div className="space-y-2">
            <textarea className="w-full h-64 bg-navy-700 font-mono text-sm p-2 rounded" value={input} onChange={e=>setInput(e.target.value)} placeholder="Paste JSON here..." />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button onClick={format}>Format & Validate</Button>
        </div>
    )
}

// --- Tool 18: Unit Converter ---
export const UnitConverter: React.FC = () => {
    const [val, setVal] = useState<number>(0);
    const [type, setType] = useState('length');
    // Simplified logic for demo
    const result = type === 'length' ? `${val} m = ${(val * 3.28084).toFixed(2)} ft` : 
                   type === 'weight' ? `${val} kg = ${(val * 2.20462).toFixed(2)} lbs` :
                   `${val} °C = ${(val * 9/5 + 32).toFixed(1)} °F`;

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                {['length', 'weight', 'temp'].map(t => (
                    <button key={t} onClick={()=>setType(t)} className={`px-3 py-1 rounded capitalize ${type===t ? 'bg-gold-400 text-navy-900' : 'bg-navy-700'}`}>{t}</button>
                ))}
            </div>
            <input type="number" value={val} onChange={e=>setVal(Number(e.target.value))} className="w-full bg-navy-700 p-2 rounded" />
            <div className="text-xl text-center text-gold-400 font-bold">{result}</div>
        </div>
    )
}

// --- Tool 14: Color Picker ---
export const ColorPicker: React.FC = () => {
    const [color, setColor] = useState('#FFD700');
    return (
        <div className="flex flex-col items-center space-y-4">
            <input type="color" value={color} onChange={e=>setColor(e.target.value)} className="w-32 h-32 cursor-pointer border-none bg-transparent" />
            <div className="text-xl font-mono">{color.toUpperCase()}</div>
            <div className="text-sm text-gray-400">RGB: {parseInt(color.slice(1,3),16)}, {parseInt(color.slice(3,5),16)}, {parseInt(color.slice(5,7),16)}</div>
        </div>
    )
}

// --- Tool 20: Timer ---
export const TimerTool: React.FC = () => {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    
    useEffect(() => {
        let int: any;
        if(running) {
            int = setInterval(() => setTime(t => t+10), 10);
        } else {
            clearInterval(int);
        }
        return () => clearInterval(int);
    }, [running]);

    const format = (ms: number) => {
        const m = Math.floor(ms / 60000).toString().padStart(2,'0');
        const s = Math.floor((ms % 60000) / 1000).toString().padStart(2,'0');
        const ms_str = Math.floor((ms % 1000) / 10).toString().padStart(2,'0');
        return `${m}:${s}:${ms_str}`;
    }

    return (
        <div className="text-center space-y-4">
            <div className="text-5xl font-mono text-gold-400">{format(time)}</div>
            <div className="flex justify-center gap-4">
                <Button onClick={()=>setRunning(!running)}>{running ? 'Stop' : 'Start'}</Button>
                <Button variant="secondary" onClick={()=>{setRunning(false); setTime(0)}}>Reset</Button>
            </div>
        </div>
    )
}
