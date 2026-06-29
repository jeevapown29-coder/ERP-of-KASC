import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';
import { Subject } from '../../types/classroom';
import { 
  Sparkles, BookOpen, BrainCircuit, ListTodo, HelpCircle, ArrowRight, Eye, 
  RotateCw, Plus, CheckCircle, FileText, Calendar, BookOpenCheck 
} from 'lucide-react';

interface ClassroomAIHubProps {
  subjects: Subject[];
}

interface Flashcard {
  question: string;
  answer: string;
}

export default function ClassroomAIHub({ subjects }: ClassroomAIHubProps) {
  const { user } = useAuth();
  const [activeTool, setActiveTool] = useState<'LESSON' | 'QUIZ_GEN' | 'REVISION' | 'FLASHCARDS'>('LESSON');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState('');

  // 1. AI Lesson Planner Form State (Faculty)
  const [lessonTopic, setLessonTopic] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [lectureCount, setLectureCount] = useState(3);

  // 2. AI Quiz Generator Form State (Faculty)
  const [quizTopic, setQuizTopic] = useState('');
  const [questionCount, setQuestionCount] = useState(3);

  // 3. AI Study/Revision Planner Form State (Student)
  const [weakTopics, setWeakTopics] = useState('');
  const [daysAvailable, setDaysAvailable] = useState(7);

  // 4. Flashcards Studio State (Student)
  const [flashcardTopic, setFlashcardTopic] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const isTeacher = user?.role === Role.FACULTY;

  // Run AI Lesson Planner query
  const handleGenerateLessonPlan = async () => {
    if (!lessonTopic.trim()) return;
    setIsAiLoading(true);
    setAiOutput('');

    const subject = subjects.find(s => s.id === selectedSubjectId)?.name || 'Computer Science';
    const prompt = `You are a Senior Academic Curriculum designer at KASC College.
Generate an enterprise-grade structured Lesson Plan for the topic: "${lessonTopic}" inside the course "${subject}".
The plan must cover exactly ${lectureCount} lectures.

Include:
1. Lecture-by-lecture breakdown (Lecture objectives, Slides layout structure, active learning activities)
2. Suggested assignments or lab practical topics
3. Recommended textbooks and resources.

Output in beautiful, clean markdown format.`;

    try {
      const response = await fetch('/api/gemini/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          model: 'gemini-2.5-pro',
          systemInstruction: 'You are an Elite Academic Syllabus Architect at Kongunadu Arts and Science College. Build structured, rigorous lesson plans.'
        })
      });
      const data = await response.json();
      if (data.result) {
        setAiOutput(data.result);
      }
    } catch (e) {
      console.error(e);
      setAiOutput('Connection failed. Please check your network block.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Run AI Quiz Generator query
  const handleGenerateQuiz = async () => {
    if (!quizTopic.trim()) return;
    setIsAiLoading(true);
    setAiOutput('');

    const prompt = `You are an Elite AI examiner. Generate ${questionCount} multiple-choice questions (MCQs) for the topic: "${quizTopic}".
For each question:
1. Clearly state the Question text
2. Provide 4 distinct options (labeled A, B, C, D)
3. State the correct answer
4. Provide a brief 1-sentence analytical explanation.

Output in clean, readable markdown structure.`;

    try {
      const response = await fetch('/api/gemini/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          model: 'gemini-2.5-pro',
          systemInstruction: 'You are an Elite Academic Assessment Specialist and Examiner at Kongunadu Arts and Science College. Formulate highly balanced, rigorous multiple-choice questions.'
        })
      });
      const data = await response.json();
      if (data.result) {
        setAiOutput(data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Run AI Study / Revision Planner query
  const handleGenerateRevisionPlan = async () => {
    if (!weakTopics.trim()) return;
    setIsAiLoading(true);
    setAiOutput('');

    const prompt = `You are an Elite Academic Coach and Study Specialist.
The student has reported the following weak topics: "${weakTopics}".
They have exactly ${daysAvailable} days to prepare before their comprehensive examination at KASC.

Generate a highly structured, day-by-day Personalized Revision Planner.
For each of the ${daysAvailable} days, outline:
- Core review concepts (concepts to read)
- Quick self-assessment questions
- A 1-hour active practice drill.

Ensure the tone is motivating, professional, and clear.`;

    try {
      const response = await fetch('/api/gemini/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          model: 'gemini-2.5-pro',
          systemInstruction: 'You are a Senior Student Success Coach and Revision Director at Kongunadu Arts and Science College. Design highly motivating, precise day-by-day revision guides.'
        })
      });
      const data = await response.json();
      if (data.result) {
        setAiOutput(data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Run AI Flashcards Generator (JSON or structured string parse)
  const handleGenerateFlashcards = async () => {
    if (!flashcardTopic.trim()) return;
    setIsAiLoading(true);
    setFlashcards([]);
    setAiOutput('');

    const prompt = `Generate exactly 5 Q&A study flashcards for the academic topic: "${flashcardTopic}".
Output ONLY as a raw valid JSON array, with no markdown surrounding block wrapper syntax, so that it can be parsed instantly.
Example structure:
[
  {"question": "What is process starvation?", "answer": "Starvation is when a process is perpetually denied access to CPU resources because other processes are continuously prioritized."},
  {"question": "What does ACID stand for in DBMS?", "answer": "Atomicity, Consistency, Isolation, and Durability, ensuring reliable transactional database processing."}
]`;

    try {
      const response = await fetch('/api/gemini/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          model: 'gemini-2.5-flash',
          systemInstruction: 'You are an Elite Flashcard Compiler. Output ONLY a clean, valid raw JSON array containing exactly five study items with no explanation outside the array.'
        })
      });
      const data = await response.json();
      
      let cleanText = data.result || '[]';
      // Strip markdown code fences if Gemini returns them anyway
      if (cleanText.includes('```')) {
        cleanText = cleanText.replace(/```json/g, '').replace(/```/g, '').trim();
      }

      const cards = JSON.parse(cleanText);
      if (Array.isArray(cards) && cards.length > 0) {
        setFlashcards(cards);
        setActiveCardIdx(0);
        setIsFlipped(false);
      } else {
        setAiOutput('Failed to parse clean flashcard blocks. Please retry topic generation!');
      }
    } catch (e) {
      console.error('Flashcard parse failed', e);
      setAiOutput('Error compiling custom flashcards. Please try another academic concept!');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-left">
      
      {/* Navigation list left side (1 col) */}
      <div className="lg:col-span-1 space-y-3 bg-white p-4 rounded-xl border border-slate-200">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-100 pb-2">
          Google Gemini 3.5 Tools
        </span>

        <button
          onClick={() => { setActiveTool('LESSON'); setAiOutput(''); }}
          className={`w-full p-3 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 text-left ${
            activeTool === 'LESSON' 
              ? 'bg-[#1e2e6b] text-white shadow-xs' 
              : 'hover:bg-slate-50 text-slate-600'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Lesson Plan Builder
        </button>

        <button
          onClick={() => { setActiveTool('QUIZ_GEN'); setAiOutput(''); }}
          className={`w-full p-3 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 text-left ${
            activeTool === 'QUIZ_GEN' 
              ? 'bg-[#1e2e6b] text-white shadow-xs' 
              : 'hover:bg-slate-50 text-slate-600'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          AI Exam MCQ Generator
        </button>

        <button
          onClick={() => { setActiveTool('REVISION'); setAiOutput(''); }}
          className={`w-full p-3 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 text-left ${
            activeTool === 'REVISION' 
              ? 'bg-[#1e2e6b] text-white shadow-xs' 
              : 'hover:bg-slate-50 text-slate-600'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Exam Revision Planner
        </button>

        <button
          onClick={() => { setActiveTool('FLASHCARDS'); setAiOutput(''); }}
          className={`w-full p-3 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 text-left ${
            activeTool === 'FLASHCARDS' 
              ? 'bg-[#1e2e6b] text-white shadow-xs' 
              : 'hover:bg-slate-50 text-slate-600'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          Flashcards Studio
        </button>
      </div>

      {/* Inputs Form and Outputs right side (3 cols) */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* Active Tool Form Column */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          
          {/* LESSON PLANNER TAB */}
          {activeTool === 'LESSON' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                AI Lesson Plan Builder
              </h4>
              <p className="text-xs text-slate-400">Generate a structured lecture plan for any topic inside your course, perfect for professors planning out semesters.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Lesson Core Topic</label>
                  <input
                    type="text"
                    placeholder="E.g., UML Use Case modeling or Process Scheduling algorithms"
                    value={lessonTopic}
                    onChange={(e) => setLessonTopic(e.target.value)}
                    className="w-full mt-1 border border-slate-200 rounded-lg p-2 text-xs text-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Lecture Count</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={lectureCount}
                    onChange={(e) => setLectureCount(Number(e.target.value))}
                    className="w-full mt-1 border border-slate-200 rounded-lg p-2 text-xs text-slate-700 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Academic Subject</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full mt-1 border border-slate-200 rounded-lg p-2 text-xs text-slate-700"
                >
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}
                </select>
              </div>

              <button
                onClick={handleGenerateLessonPlan}
                disabled={isAiLoading || !lessonTopic.trim()}
                className="px-4 py-2 bg-[#1e2e6b] hover:bg-[#132150] disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isAiLoading ? 'Drafting Coursework Plan...' : 'Generate Comprehensive Lesson Plan'}
              </button>
            </div>
          )}

          {/* QUIZ GENERATOR TAB */}
          {activeTool === 'QUIZ_GEN' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                AI Exam MCQ Generator
              </h4>
              <p className="text-xs text-slate-400">Instantly generate high-quality assessment questions that you can copy/paste directly into your assignments.</p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Topic to Test</label>
                  <input
                    type="text"
                    placeholder="E.g., CPU Semaphores, Normal Forms in DBMS, or Big-O complexity"
                    value={quizTopic}
                    onChange={(e) => setQuizTopic(e.target.value)}
                    className="w-full mt-1 border border-slate-200 rounded-lg p-2 text-xs text-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Questions</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full mt-1 border border-slate-200 rounded-lg p-2 text-xs text-slate-700 font-mono font-bold"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerateQuiz}
                disabled={isAiLoading || !quizTopic.trim()}
                className="px-4 py-2 bg-[#1e2e6b] hover:bg-[#132150] disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isAiLoading ? 'Synthesizing MCQ Pool...' : 'Formulate Multiple-Choice Questions'}
              </button>
            </div>
          )}

          {/* REVISION PLANNER TAB */}
          {activeTool === 'REVISION' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                Personal Study & Revision Planner
              </h4>
              <p className="text-xs text-slate-400">Students can input concepts they struggle with and get an organized daily study planner to prepare for exams.</p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">What are your weak topics?</label>
                  <input
                    type="text"
                    placeholder="E.g., Normalization, Dijkstra algorithm, CPU scheduling priority queue"
                    value={weakTopics}
                    onChange={(e) => setWeakTopics(e.target.value)}
                    className="w-full mt-1 border border-slate-200 rounded-lg p-2 text-xs text-slate-700 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Days Left</label>
                  <input
                    type="number"
                    min={3}
                    max={30}
                    value={daysAvailable}
                    onChange={(e) => setDaysAvailable(Number(e.target.value))}
                    className="w-full mt-1 border border-slate-200 rounded-lg p-2 text-xs text-slate-700 font-mono"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerateRevisionPlan}
                disabled={isAiLoading || !weakTopics.trim()}
                className="px-4 py-2 bg-[#1e2e6b] hover:bg-[#132150] disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isAiLoading ? 'Compiling revision modules...' : 'Assemble Personalized Revision Planner'}
              </button>
            </div>
          )}

          {/* FLASHCARDS STUDIO TAB */}
          {activeTool === 'FLASHCARDS' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <BrainCircuit className="w-4 h-4 text-amber-500" />
                AI Flashcards Studio
              </h4>
              <p className="text-xs text-slate-400">Generate visual, interactive digital study flashcards to review definitions and core algorithms before class.</p>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter study chapter / topic (e.g. Operating Systems Processes)"
                  value={flashcardTopic}
                  onChange={(e) => setFlashcardTopic(e.target.value)}
                  className="flex-1 border border-slate-200 rounded-lg p-2 text-xs text-slate-700 font-bold"
                />
                <button
                  onClick={handleGenerateFlashcards}
                  disabled={isAiLoading || !flashcardTopic.trim()}
                  className="px-4 py-2 bg-[#1e2e6b] hover:bg-[#132150] disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isAiLoading ? 'Writing Studio Cards...' : 'Generate Flashcards'}
                </button>
              </div>

              {/* Flashcards Interactive Deck Render */}
              {flashcards.length > 0 && (
                <div className="pt-4 flex flex-col items-center justify-center space-y-4">
                  
                  {/* Card wrapper with interactive 3D flip styling */}
                  <button
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="w-full max-w-md h-52 relative focus:outline-none perspective-1000 select-none group"
                  >
                    <div 
                      className={`w-full h-full duration-500 preserve-3d relative rounded-2xl shadow-md border ${
                        isFlipped ? 'rotate-y-180 border-amber-300' : 'border-slate-200'
                      }`}
                    >
                      {/* Front: Question */}
                      <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 flex flex-col justify-between items-center text-center">
                        <span className="text-[9px] font-bold text-[#1e2e6b] bg-[#1e2e6b]/5 px-2.5 py-1 rounded-full border border-[#1e2e6b]/10 uppercase tracking-widest">
                          Flashcard Question
                        </span>
                        <p className="font-bold text-slate-800 text-sm leading-relaxed max-w-[300px]">
                          {flashcards[activeCardIdx].question}
                        </p>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
                          <RotateCw className="w-3 h-3 text-slate-400 group-hover:rotate-45 transition-all" />
                          Click Card to reveal answer
                        </span>
                      </div>

                      {/* Back: Answer */}
                      <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between items-center text-center">
                        <span className="text-[9px] font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20 uppercase tracking-widest">
                          AI Answer Key
                        </span>
                        <p className="text-slate-300 text-xs leading-relaxed max-w-[320px]">
                          {flashcards[activeCardIdx].answer}
                        </p>
                        <span className="text-[10px] text-slate-500 font-medium">
                          Click to flip back to question
                        </span>
                      </div>

                    </div>
                  </button>

                  {/* Slider controls */}
                  <div className="flex items-center gap-4 text-xs font-bold">
                    <button
                      disabled={activeCardIdx === 0}
                      onClick={() => { setActiveCardIdx(prev => prev - 1); setIsFlipped(false); }}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 disabled:opacity-40"
                    >
                      Prev
                    </button>
                    <span className="text-slate-500">
                      Card {activeCardIdx + 1} of {flashcards.length}
                    </span>
                    <button
                      disabled={activeCardIdx === flashcards.length - 1}
                      onClick={() => { setActiveCardIdx(prev => prev + 1); setIsFlipped(false); }}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

        {/* AI Output Result Box */}
        {(aiOutput || isAiLoading) && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative text-white">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#1e2e6b]/10 blur-2xl rounded-full" />
            
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              <h4 className="font-bold text-white text-sm">
                Google Gemini 3.5 Desk
              </h4>
            </div>

            {isAiLoading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-slate-400 font-medium animate-pulse">Running advanced Large Language Reasoning models on KASC cluster...</p>
              </div>
            ) : (
              <div className="text-xs text-slate-300 leading-relaxed text-left whitespace-pre-wrap font-sans prose prose-invert select-text max-h-[450px] overflow-y-auto pr-2">
                {aiOutput}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
