import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2, Clipboard, RefreshCw, Volume2, HelpCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';

interface SuggestionPreset {
  id: string;
  title: string;
  description: string;
  prompt: string;
  roles: Role[];
  iconAccent: string;
}

const PRESET_SUGGESTIONS: SuggestionPreset[] = [
  // Student Presets
  {
    id: 'stud-1',
    title: 'Personalized Study Plan Helper',
    description: 'Draft an active-recall-based technical preparation schedule for upcoming semester exams.',
    prompt: 'You are a student academic coach. Draft a personalized study schedule and active-recall preparation techniques for a student studying Computer Science with upcoming finals. Focus on deep work and spaced repetition.',
    roles: [Role.STUDENT, Role.PARENT],
    iconAccent: 'text-emerald-500 bg-emerald-50 border-emerald-100'
  },
  {
    id: 'stud-2',
    title: 'Attendance Recovery Simulator',
    description: 'Construct a strategy to raise class attendance rating safely above the 75% mandate.',
    prompt: 'A student currently has 88.5% attendance in critical classes but is struggling with commute delays. Produce a practical, motivational rescue action plan with calendar reminders, scheduling tips, and ways to make sure they do not fall below the 75% threshold.',
    roles: [Role.STUDENT, Role.PARENT],
    iconAccent: 'text-amber-500 bg-amber-50 border-amber-100'
  },
  {
    id: 'stud-3',
    title: 'Mock Interview Prep Outline',
    description: 'Prepare technical interview questions matching current B.Sc. IT & CS curricula.',
    prompt: 'Draft 5 high-impact technical interview questions with concise, exemplary responses on "Data Structures and Algorithm Complexity" matching standard Indian university curriculums.',
    roles: [Role.STUDENT],
    iconAccent: 'text-indigo-500 bg-indigo-50 border-indigo-100'
  },
  // Faculty Presets
  {
    id: 'fac-1',
    title: 'Remediation Sheet Constructor',
    description: 'Generate high-impact worksheets for students with low internal assessment marks.',
    prompt: 'You are an academic curriculum specialist. Construct 3 high-impact remediation focus questions (with explanations) for Computer Science students lagging in basic algorithms and data structures.',
    roles: [Role.FACULTY, Role.HOD],
    iconAccent: 'text-rose-500 bg-rose-50 border-rose-100'
  },
  {
    id: 'fac-2',
    title: 'Weekly Interactive Lesson Plan',
    description: 'Outline an industry-aligned lesson syllabus module for React state preservation.',
    prompt: 'Outline a highly interactive, 2-hour lesson plan for teaching modern single-page library state management (such as React Context and effect dependencies). Include one visual diagram description and one active-learning coding challenge.',
    roles: [Role.FACULTY, Role.HOD],
    iconAccent: 'text-purple-500 bg-purple-50 border-purple-100'
  },
  // HOD / Admin / Principal Presets
  {
    id: 'adm-1',
    title: 'Drop-out & Attendance Drop Analyzer',
    description: 'Correlate test cycles with attendance drops to recommend institutional remedies.',
    prompt: 'Historically, Friday attendance drops by 4% during test cycles. Formulate 3 actionable recommendations for Department HODs to balance test-cycle anxiety and keep Friday class engagement high.',
    roles: [Role.ADMIN, Role.PRINCIPAL, Role.HOD],
    iconAccent: 'text-sky-500 bg-sky-50 border-sky-100'
  },
  {
    id: 'adm-2',
    title: 'Admission Outreach Campaign',
    description: 'Draft congratulations emails and next steps for approved portal applicants.',
    prompt: 'Draft an encouraging, professional congratulatory email to newly approved college applicants. Inform them of next counseling steps, document verification instructions, and emphasize the campus community.',
    roles: [Role.ADMIN, Role.PRINCIPAL],
    iconAccent: 'text-teal-500 bg-teal-50 border-teal-100'
  },
  // Support Staff Presets
  {
    id: 'lib-1',
    title: 'Overdue Book Warning CopyWriter',
    description: 'Create a polite yet authoritative template for returning long-overdue library reserves.',
    prompt: 'Draft a friendly, automated email template informing students of library books overdue by 5+ days. Outline instructions for renewal portals or the daily fine-rate structures.',
    roles: [Role.LIBRARIAN],
    iconAccent: 'text-violet-500 bg-violet-50 border-violet-100'
  },
  {
    id: 'ward-1',
    title: 'Hostel Block Inspection Rubric',
    description: 'Establish systematic parameters for Warden monthly safety checkpoints.',
    prompt: 'As a Chief Hostel Warden, write a standardized 5-point monthly safety inspection checklist covering room health, water-leak risks, electrical appliances guidelines, and common area cleanliness.',
    roles: [Role.HOSTEL_WARDEN],
    iconAccent: 'text-pink-500 bg-pink-50 border-pink-100'
  }
];

export default function AISuggestionsModule() {
  const { user } = useAuth();
  const [selectedPreset, setSelectedPreset] = useState<SuggestionPreset | null>(null);
  const [customContext, setCustomContext] = useState('');
  const [response, setResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  // Filter presets based on user role
  const userPresets = PRESET_SUGGESTIONS.filter(preset => preset.roles.includes(user.role as Role));

  // Fallback default presets if a specific role doesn't have an exact preset
  const displayPresets = userPresets.length > 0 ? userPresets : PRESET_SUGGESTIONS.slice(0, 3);

  const handleGenerate = async (preset: SuggestionPreset) => {
    setSelectedPreset(preset);
    setIsGenerating(true);
    setResponse('');
    setCopied(false);

    try {
      let finalPrompt = preset.prompt;
      if (customContext.trim()) {
        finalPrompt += `\n\nAdditionally, incorporate the following custom context/parameters: ${customContext.trim()}`;
      }
      
      const res = await fetch('/api/gemini/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to communicate with Gemini API');

      setResponse(data.result);
    } catch (err: any) {
      setResponse(`Error generating suggestions: ${err.message}. Please verify your GEMINI_API_KEY is configured in Settings.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="ai-smart-suggestions-box" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Module Header */}
      <div className="bg-gradient-to-r from-[#1e2e6b] to-[#132150] p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#f09a1a] animate-pulse" />
            AI Smart Suggestions & Action Engine
          </h3>
          <p className="text-xs text-slate-200 mt-1">
            Personalized, role-based recommendations powered by Gemini 3.5. Select an action preset to generate custom summaries.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 text-xs font-mono font-bold self-start md:self-auto shrink-0 text-[#f09a1a]">
          <span>Role Authed: {user.role}</span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Presets List Column (Takes 2 blocks) */}
        <div className="lg:col-span-2 space-y-3.5 border-r border-slate-100 lg:pr-6">
          <div className="flex items-center gap-1.5 text-xs font-black text-slate-400 uppercase tracking-wider">
            <span>Available AI Action Presets</span>
          </div>

          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {displayPresets.map(preset => {
              const active = selectedPreset?.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleGenerate(preset)}
                  disabled={isGenerating}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 group relative ${
                    active 
                      ? 'bg-slate-50 border-slate-300 shadow-xs ring-1 ring-[#1e2e6b]/25' 
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border shrink-0 text-xs font-bold transition-transform ${preset.iconAccent} group-hover:scale-105`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-900 group-hover:text-[#1e2e6b] transition-colors leading-snug">
                      {preset.title}
                    </h4>
                    <p className="text-[10px] leading-relaxed text-slate-500 font-sans">
                      {preset.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#1e2e6b] absolute right-3.5 top-3.5 transition-all group-hover:translate-x-0.5 opacity-0 group-hover:opacity-100" />
                </button>
              );
            })}
          </div>

          {/* Advanced Context Input */}
          <div className="space-y-1.5 pt-2">
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">
              Add Custom Context / Constraints (Optional)
            </label>
            <textarea
              rows={2}
              value={customContext}
              onChange={(e) => setCustomContext(e.target.value)}
              placeholder="e.g. Include focus on Tamil grammar / specific lab block schedules..."
              className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-50/70 focus:bg-white border border-slate-200 text-xs text-slate-900 rounded-lg focus:ring-2 focus:ring-[#1e2e6b]/20 focus:outline-none placeholder-slate-400 transition-all font-sans"
            />
          </div>
        </div>

        {/* Output Column (Takes 3 blocks) */}
        <div className="lg:col-span-3 flex flex-col min-h-[300px] justify-between relative bg-slate-50/50 border border-slate-200/60 rounded-xl p-5">
          {isGenerating ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <Loader2 className="w-8 h-8 text-[#1e2e6b] animate-spin mb-3" />
              <p className="text-xs font-bold text-[#1e2e6b] uppercase tracking-wider animate-pulse">Running Spaced-Out Reasoning...</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs leading-relaxed">
                Gemini is synthesizing academic regulations, historic attendance correlations, and curriculum models for your profile.
              </p>
            </div>
          ) : response ? (
            <div className="flex-grow flex flex-col justify-between h-full space-y-4">
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-1">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                    Synthesized Suggestions Response
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="text-[10px] font-bold text-[#1e2e6b] bg-white border border-slate-200 px-2.5 py-1 rounded-lg hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-1"
                    >
                      <Clipboard className="w-3 h-3 text-[#f09a1a]" />
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    {selectedPreset && (
                      <button
                        onClick={() => handleGenerate(selectedPreset)}
                        className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 p-1 rounded-lg hover:bg-slate-50 transition-all"
                        title="Regenerate suggestions"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap font-sans bg-white p-4 rounded-lg border border-slate-200/50">
                  {response}
                </div>
              </div>

              <div className="border-t border-slate-200/60 pt-3 flex items-center gap-2 text-[10px] text-slate-400">
                <HelpCircle className="w-4 h-4 text-[#f09a1a] shrink-0" />
                <span>The advice above is formatted dynamically. Select other presets to explore further customized action plans.</span>
              </div>
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-8 py-12">
              <div className="w-12 h-12 bg-[#1e2e6b]/5 border border-[#1e2e6b]/10 rounded-full flex items-center justify-center text-[#1e2e6b] mb-3">
                <Sparkles className="w-5 h-5 text-[#f09a1a]" />
              </div>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-1">No AI Action Triggered</h4>
              <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
                Select any personalized action preset on the left. The AI suggestion compiler will synthesize optimal recommendations instantly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
