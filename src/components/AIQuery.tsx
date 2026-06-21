import React, { useState } from 'react';
import { Sparkles, Loader2, AlertTriangle, TrendingDown } from 'lucide-react';

export default function AIQuery() {
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [riskForecast, setRiskForecast] = useState<string | null>(null);
  const [isGeneratingRisk, setIsGeneratingRisk] = useState(false);

  const handleGenerateAISummary = async () => {
    if (!aiQuery.trim()) return;
    setIsGenerating(true);
    setAiResponse('');
    
    try {
      const dbContext = "Context: KASC ERP has 4,250 students. Overall attendance: 92.4%. Recent semester marks averages show a 5% improvement in Computer Science.";
      const prompt = `Analyze the following ERP data context and answer the user query professionally.\n\n${dbContext}\n\nUser Query: ${aiQuery}`;

      const res = await fetch('/api/gemini/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate summary');
      
      setAiResponse(data.result);
    } catch (e: any) {
      setAiResponse(`Error connecting to AI: ${e.message}. Please Check your GEMINI_API_KEY.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateRiskForecast = async () => {
    setIsGeneratingRisk(true);
    setRiskForecast('');
    
    try {
      const historicalData = "Historical Data: Last week (Week 12) saw a 4% drop in Friday attendance, correlating with mid-semester assignment deadlines. Out of 4,250 students, 180 have attendance below 75% currently.";
      const prompt = `Analyze the following historical attendance patterns and predict potential student absenteeism in the upcoming week. Provide a concise, actionable 'Risk Forecast' dashboard summary.\n\n${historicalData}`;

      const res = await fetch('/api/gemini/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate forecast');
      
      setRiskForecast(data.result);
    } catch (e: any) {
      setRiskForecast(`Error generating forecast: ${e.message}.`);
    } finally {
      setIsGeneratingRisk(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Main AI Query Widget */}
      <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl p-6 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-slate-900">Gemini AI Smart Analyst</h2>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          Ask questions about institutional data using Google's algorithms. Describe what kind of pattern or insight you are looking for.
        </p>
        
        <div className="flex gap-3">
          <input
            type="text"
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 focus:border-indigo-600 transition-all font-medium"
            placeholder="e.g., 'Summarize the impact of attendance on semester grades...'"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleGenerateAISummary(); }}
          />
          <button 
            onClick={handleGenerateAISummary}
            disabled={isGenerating || !aiQuery.trim()}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate'}
          </button>
        </div>

        {aiResponse && (
          <div className="mt-6 p-5 bg-white border border-indigo-100 rounded-xl relative">
            <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-bl-xl rounded-tr-xl uppercase tracking-wider">
              AI Insight
            </div>
            <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">{aiResponse}</p>
          </div>
        )}
      </div>

      {/* Risk Forecast Widget */}
      <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-2xl p-6 shadow-sm flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-slate-900">Absenteeism Risk Forecast</h2>
          </div>
          {!riskForecast && !isGeneratingRisk && (
            <button 
              onClick={handleGenerateRiskForecast}
              className="px-4 py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <TrendingDown className="w-4 h-4" />
              Generate Forecast
            </button>
          )}
        </div>
        
        {!riskForecast && !isGeneratingRisk && (
          <p className="text-sm text-slate-600">
            Analyze historical patterns to predict next week's absenteeism and identify at-risk student cohorts.
          </p>
        )}

        {isGeneratingRisk && (
          <div className="flex-1 flex flex-col items-center justify-center py-8 text-amber-600">
            <Loader2 className="w-8 h-8 animate-spin mb-3" />
            <p className="text-sm font-medium">Analyzing historical attendance patterns...</p>
          </div>
        )}

        {riskForecast && (
          <div className="flex-1 p-5 bg-white border border-amber-100 rounded-xl relative overflow-y-auto">
            <div className="absolute top-0 right-0 px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-bl-xl rounded-tr-xl uppercase tracking-wider">
              Prediction Alert
            </div>
            <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">{riskForecast}</p>
          </div>
        )}
      </div>
    </div>
  );
}
