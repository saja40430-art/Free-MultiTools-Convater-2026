import React, { useState } from 'react';
import { Button } from '../ui/Button';

// --- Tool 7: Age Calculator ---
export const AgeCalculator: React.FC = () => {
  const [dob, setDob] = useState('');
  const [age, setAge] = useState<{y:number, m:number, d:number} | null>(null);

  const calculate = () => {
    const birthDate = new Date(dob);
    const today = new Date();
    let y = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    let d = today.getDate() - birthDate.getDate();

    if (d < 0) { m--; d += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    
    setAge({ y, m, d });
  };

  return (
    <div className="space-y-4">
      <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full bg-navy-700 text-white p-2 rounded" />
      <Button fullWidth onClick={calculate}>Calculate Age</Button>
      {age && <div className="text-center text-xl text-gold-400 font-bold">{age.y} Years, {age.m} Months, {age.d} Days</div>}
    </div>
  );
};

// --- Tool 8: EMI Calculator ---
export const EMICalculator: React.FC = () => {
    const [p, setP] = useState(100000);
    const [r, setR] = useState(10);
    const [n, setN] = useState(12);
    const [result, setResult] = useState<number | null>(null);

    const calc = () => {
        const rate = r / 12 / 100;
        const emi = p * rate * (Math.pow(1 + rate, n) / (Math.pow(1 + rate, n) - 1));
        setResult(emi);
    }

    return (
        <div className="space-y-3">
            <input type="number" placeholder="Loan Amount" value={p} onChange={e => setP(Number(e.target.value))} className="w-full bg-navy-700 p-2 rounded" />
            <input type="number" placeholder="Interest Rate %" value={r} onChange={e => setR(Number(e.target.value))} className="w-full bg-navy-700 p-2 rounded" />
            <input type="number" placeholder="Months" value={n} onChange={e => setN(Number(e.target.value))} className="w-full bg-navy-700 p-2 rounded" />
            <Button fullWidth onClick={calc}>Calculate EMI</Button>
            {result && <div className="text-center text-gold-400 text-xl font-bold">Monthly EMI: {result.toFixed(2)}</div>}
        </div>
    )
}

// --- Tool 9: SIP Calculator ---
export const SIPCalculator: React.FC = () => {
    const [invest, setInvest] = useState(5000);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(10);
    const [val, setVal] = useState<number|null>(null);

    const calc = () => {
        const i = rate / 100 / 12;
        const n = years * 12;
        const fv = invest * ( (Math.pow(1 + i, n) - 1) / i ) * (1 + i);
        setVal(fv);
    }

    return (
        <div className="space-y-3">
            <input type="number" placeholder="Monthly Investment" value={invest} onChange={e => setInvest(Number(e.target.value))} className="w-full bg-navy-700 p-2 rounded" />
            <input type="number" placeholder="Expected Return %" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full bg-navy-700 p-2 rounded" />
            <input type="number" placeholder="Years" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full bg-navy-700 p-2 rounded" />
            <Button fullWidth onClick={calc}>Calculate SIP</Button>
            {val && <div className="text-center text-gold-400 text-xl font-bold">Future Value: {val.toFixed(2)}</div>}
        </div>
    )
}

// --- Tool 19: BMI Calculator ---
export const BMICalculator: React.FC = () => {
    const [w, setW] = useState(70); // kg
    const [h, setH] = useState(170); // cm
    const [bmi, setBmi] = useState<number|null>(null);

    const calc = () => {
        const hm = h / 100;
        setBmi(w / (hm * hm));
    }

    return (
        <div className="space-y-3">
             <input type="number" placeholder="Weight (kg)" value={w} onChange={e => setW(Number(e.target.value))} className="w-full bg-navy-700 p-2 rounded" />
             <input type="number" placeholder="Height (cm)" value={h} onChange={e => setH(Number(e.target.value))} className="w-full bg-navy-700 p-2 rounded" />
             <Button fullWidth onClick={calc}>Calculate BMI</Button>
             {bmi && <div className="text-center text-gold-400 text-xl font-bold">BMI: {bmi.toFixed(1)}</div>}
        </div>
    )
}