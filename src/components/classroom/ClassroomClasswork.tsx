import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';
import { Assignment, Submission, QuizQuestion, RubricItem, Subject, Attachment, AssignmentType } from '../../types/classroom';
import { 
  FileText, Calendar, Plus, PlusCircle, Trash, CheckSquare, Sparkles, AlertTriangle, 
  Clock, Award, BookOpen, Send, CheckCircle, Code, HelpCircle, Eye, User, FileMinus 
} from 'lucide-react';

interface ClassroomClassworkProps {
  subjects: Subject[];
  assignments: Assignment[];
  submissions: Submission[];
  onAddAssignment: (assignment: Partial<Assignment>) => void;
  onAddSubmission: (submission: Partial<Submission>) => void;
  onGradeSubmission: (submissionId: string, marks: number, feedback: string, rubricScores?: Record<string, number>) => void;
}

export default function ClassroomClasswork({
  subjects,
  assignments,
  submissions,
  onAddAssignment,
  onAddSubmission,
  onGradeSubmission
}: ClassroomClassworkProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'LIST' | 'CREATE' | 'GRADING_VIEW'>('LIST');

  // Form State for Creating Assignment
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [type, setType] = useState<AssignmentType>('ASSIGNMENT');
  const [dueDate, setDueDate] = useState('');
  const [maxMarks, setMaxMarks] = useState(20);
  const [lateRules, setLateRules] = useState<'NOT_ALLOWED' | 'ALLOW_WITH_PENALTY' | 'ALLOW_ANYTIME'>('ALLOW_WITH_PENALTY');
  
  // Rubrics Creation
  const [rubrics, setRubrics] = useState<RubricItem[]>([
    { id: 'r-seed-1', criterion: 'Completeness', maxPoints: 10, description: 'All aspects of the prompt are fully covered' }
  ]);
  const [newCriterion, setNewCriterion] = useState('');
  const [newMaxPoints, setNewMaxPoints] = useState(5);
  const [newCritDesc, setNewCritDesc] = useState('');

  // Quiz Questions Creation
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [qText, setQText] = useState('');
  const [qType, setQType] = useState<'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'CODE_CHALLENGE'>('MCQ');
  const [qOptions, setQOptions] = useState('');
  const [qCorrectAnswer, setQCorrectAnswer] = useState('');
  const [qPoints, setQPoints] = useState(5);

  // Student Actions State
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionCode, setSubmissionCode] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<Attachment[]>([]);
  const [submittedMessage, setSubmittedMessage] = useState('');

  // Student Active Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Faculty Grading State
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  const [gradingMarks, setGradingMarks] = useState<number>(20);
  const [gradingFeedback, setGradingFeedback] = useState('');
  const [gradingRubricScores, setGradingRubricScores] = useState<Record<string, number>>({});

  const isTeacher = user?.role === Role.FACULTY;

  // Add Rubric Criterion
  const handleAddRubric = () => {
    if (!newCriterion.trim()) return;
    const item: RubricItem = {
      id: `rub-${Date.now()}`,
      criterion: newCriterion,
      maxPoints: newMaxPoints,
      description: newCritDesc
    };
    setRubrics(prev => [...prev, item]);
    // Calculate new total marks
    const sum = rubrics.reduce((a, b) => a + b.maxPoints, 0) + newMaxPoints;
    setMaxMarks(sum);

    setNewCriterion('');
    setNewCritDesc('');
  };

  // Add Quiz Question
  const handleAddQuestion = () => {
    if (!qText.trim() || !qCorrectAnswer.trim()) return;
    const question: QuizQuestion = {
      id: `q-${Date.now()}`,
      type: qType,
      text: qText,
      options: qType === 'MCQ' ? qOptions.split(',').map(o => o.trim()) : undefined,
      correctAnswer: qCorrectAnswer,
      points: qPoints
    };
    setQuestions(prev => [...prev, question]);
    
    // Auto increment maxMarks based on quiz questions
    const sum = questions.reduce((a, b) => a + b.points, 0) + qPoints;
    setMaxMarks(sum);

    setQText('');
    setQOptions('');
    setQCorrectAnswer('');
  };

  // Submit Assignment Creator
  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    onAddAssignment({
      title,
      description,
      subjectId,
      type,
      dueDate,
      maxMarks,
      rubrics: type !== 'QUIZ' ? rubrics : [],
      questions: type === 'QUIZ' ? questions : [],
      attachments: []
    });

    // Reset Creation State
    setTitle('');
    setDescription('');
    setQuestions([]);
    setRubrics([]);
    setMaxMarks(20);
    setActiveTab('LIST');
  };

  // Submit Student Submission
  const handleStudentSubmit = () => {
    if (!selectedAssignment || !user) return;

    onAddSubmission({
      assignmentId: selectedAssignment.id,
      studentId: user.id,
      studentName: user.name,
      registerNo: '24BCS101', // Simulation of roll
      text: submissionText,
      codeSolution: selectedAssignment.type === 'CODING' ? submissionCode : undefined,
      attachments: attachedFiles,
      status: 'SUBMITTED',
      version: 1
    });

    setSubmittedMessage('Assignment successfully submitted to gradebook!');
    setSubmissionText('');
    setSubmissionCode('');
    setAttachedFiles([]);
    setTimeout(() => {
      setSubmittedMessage('');
      setSelectedAssignment(null);
    }, 2500);
  };

  // Student Submit Quiz
  const handleStudentSubmitQuiz = () => {
    if (!selectedAssignment || !user) return;

    // Check answers
    let score = 0;
    const questionsList = selectedAssignment.questions || [];
    questionsList.forEach(q => {
      const studentAns = quizAnswers[q.id]?.trim().toLowerCase();
      const correctAns = q.correctAnswer.trim().toLowerCase();
      if (studentAns === correctAns) {
        score += q.points;
      }
    });

    setQuizScore(score);

    // Save submission record
    onAddSubmission({
      assignmentId: selectedAssignment.id,
      studentId: user.id,
      studentName: user.name,
      registerNo: '24BCS101',
      text: `Completed online quiz. Correct answers scored: ${score} / ${selectedAssignment.maxMarks}`,
      attachments: [],
      status: 'GRADED', // Quizzes are auto-graded
      marksObtained: score,
      feedback: `Auto-graded MCQ assessment. Accurate answers given: ${Object.keys(quizAnswers).length} questions logged.`,
      version: 1
    });

    setTimeout(() => {
      setQuizScore(null);
      setQuizAnswers({});
      setSelectedAssignment(null);
    }, 4000);
  };

  // Trigger Faculty Grading Submit
  const handleFacultySubmitGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    onGradeSubmission(
      gradingSubmission.id,
      gradingMarks,
      gradingFeedback,
      gradingRubricScores
    );

    setGradingSubmission(null);
    setGradingFeedback('');
    setGradingRubricScores({});
  };

  const handleMockAttachFile = () => {
    const mockFiles = [
      { name: 'Arun_Project_Deliverable_v1.zip', type: 'application/zip', size: '12.4 MB', url: '#' },
      { name: 'Hospital_DB_Schema_Draft.pdf', type: 'application/pdf', size: '1.12 MB', url: '#' },
      { name: 'Dijkstra_shortest_path_solution.py', type: 'text/plain', size: '4 KB', url: '#' }
    ];
    const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    if (!attachedFiles.some(f => f.name === randomFile.name)) {
      setAttachedFiles(prev => [...prev, randomFile]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header and navigation tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#1e2e6b]" />
          <h2 className="font-bold text-slate-800 text-lg tracking-tight">Academic Coursework</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setActiveTab('LIST'); setSelectedAssignment(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'LIST' 
                ? 'bg-[#1e2e6b] text-white shadow-xs' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Classwork List
          </button>
          
          {isTeacher && (
            <button
              onClick={() => setActiveTab('CREATE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'CREATE' 
                  ? 'bg-amber-500 text-slate-950 shadow-xs' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Create Classwork
            </button>
          )}
        </div>
      </div>

      {/* Main Content Areas */}
      {activeTab === 'LIST' && !selectedAssignment && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {assignments.map(asg => {
            const subject = subjects.find(s => s.id === asg.subjectId);
            const classSubmissions = submissions.filter(s => s.assignmentId === asg.id);
            const studentSub = user ? submissions.find(s => s.assignmentId === asg.id && s.studentId === user.id) : null;
            
            return (
              <div key={asg.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2 py-0.5 bg-[#1e2e6b]/5 text-[#1e2e6b] font-bold text-[9px] rounded-full border border-[#1e2e6b]/10 uppercase">
                      {subject?.code || 'CS'}
                    </span>
                    <span className={`px-2 py-0.5 font-bold text-[9px] rounded-full uppercase ${
                      asg.type === 'QUIZ' ? 'bg-amber-100 text-amber-800' :
                      asg.type === 'CODING' ? 'bg-indigo-100 text-indigo-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {asg.type}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-sm mb-2 hover:text-[#1e2e6b] transition-colors line-clamp-1">{asg.title}</h3>
                  <p className="text-slate-500 text-xs line-clamp-3 mb-4 leading-relaxed">{asg.description}</p>

                  <div className="space-y-2 border-t border-slate-50 pt-3 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Due: {new Date(asg.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      <span>Max Points: <strong className="text-slate-700">{asg.maxMarks} Marks</strong></span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 mt-4 pt-3 flex items-center justify-between">
                  {/* Status Badges for Faculty vs Students */}
                  {isTeacher ? (
                    <div className="text-[10px] text-slate-400 font-semibold">
                      Submissions: <strong className="text-slate-700">{classSubmissions.length}</strong> ({classSubmissions.filter(s => s.status === 'GRADED').length} Graded)
                    </div>
                  ) : (
                    <div>
                      {studentSub ? (
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          studentSub.status === 'GRADED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {studentSub.status === 'GRADED' ? `GRADED: ${studentSub.marksObtained}/${asg.maxMarks}` : 'SUBMITTED'}
                        </span>
                      ) : (
                        <span className="text-rose-600 text-[10px] font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Pending Submission
                        </span>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedAssignment(asg)}
                    className="px-3 py-1 bg-slate-50 hover:bg-[#1e2e6b] hover:text-white border border-slate-200 text-[#1e2e6b] text-[10px] font-bold rounded-lg shadow-xs transition-all"
                  >
                    {isTeacher ? 'Manage & Grade' : 'Open Assignment'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Creation View (Faculty only) */}
      {activeTab === 'CREATE' && isTeacher && (
        <form onSubmit={handleCreateAssignment} className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 max-w-3xl mx-auto text-left">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Classwork Assignment Constructor
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Subject</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full mt-1 text-xs border border-slate-200 rounded-lg p-2 text-slate-700"
              >
                {subjects.map(s => <option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Activity Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AssignmentType)}
                className="w-full mt-1 text-xs border border-slate-200 rounded-lg p-2 text-slate-700 font-bold"
              >
                <option value="ASSIGNMENT">Standard Written Assignment</option>
                <option value="QUIZ">Interactive MCQ / Quiz</option>
                <option value="CODING">Programming Challenge</option>
                <option value="LAB">Lab Practical Work</option>
                <option value="ESSAY">Essay & Analytical Report</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">Title</label>
            <input
              type="text"
              required
              placeholder="E.g., UML Use Case & Class Modeling"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 text-xs border border-slate-200 rounded-lg p-2 text-slate-700 font-bold"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">Instruction Details</label>
            <textarea
              placeholder="State clear task requirements, submission formats, and reading reference guidelines..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 text-xs border border-slate-200 rounded-lg p-2.5 text-slate-700 min-h-[120px] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Due Date & Time</label>
              <input
                type="datetime-local"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full mt-1 text-xs border border-slate-200 rounded-lg p-2 text-slate-700"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Max Academic Marks</label>
              <input
                type="number"
                value={maxMarks}
                readOnly={type === 'QUIZ'} // auto-computed for quiz
                onChange={(e) => setMaxMarks(Number(e.target.value))}
                className="w-full mt-1 text-xs border border-slate-200 rounded-lg p-2 text-slate-700 font-mono font-bold bg-slate-50"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Late Submission Rule</label>
              <select
                value={lateRules}
                onChange={(e) => setLateRules(e.target.value as any)}
                className="w-full mt-1 text-xs border border-slate-200 rounded-lg p-2 text-slate-700"
              >
                <option value="ALLOW_WITH_PENALTY">Allow (With 10% penalty per day)</option>
                <option value="NOT_ALLOWED">Strict - Block late attempts</option>
                <option value="ALLOW_ANYTIME">Allow anytime with no penalty</option>
              </select>
            </div>
          </div>

          {/* Conditional Rubrics Block (For Non-Quizzes) */}
          {type !== 'QUIZ' && (
            <div className="border border-slate-150 rounded-xl p-4 bg-slate-50/50 space-y-4">
              <span className="text-xs font-bold text-[#1e2e6b] flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-amber-500" />
                Grading Rubrics Builder
              </span>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Criterion Name (e.g. Code Logic)"
                  value={newCriterion}
                  onChange={(e) => setNewCriterion(e.target.value)}
                  className="bg-white text-xs border border-slate-200 rounded-lg p-2 md:col-span-2 text-slate-700"
                />
                <input
                  type="number"
                  placeholder="Max Points"
                  value={newMaxPoints}
                  onChange={(e) => setNewMaxPoints(Number(e.target.value))}
                  className="bg-white text-xs border border-slate-200 rounded-lg p-2 text-slate-700 font-mono font-bold"
                />
                <button
                  type="button"
                  onClick={handleAddRubric}
                  className="py-2 bg-[#1e2e6b] text-white hover:bg-[#132150] text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <PlusCircle className="w-4 h-4" /> Add Rubric
                </button>
              </div>
              <input
                type="text"
                placeholder="Description of excellent execution..."
                value={newCritDesc}
                onChange={(e) => setNewCritDesc(e.target.value)}
                className="w-full bg-white text-xs border border-slate-200 rounded-lg p-2 text-slate-700"
              />

              {rubrics.length > 0 && (
                <div className="space-y-2 mt-2">
                  {rubrics.map((r, i) => (
                    <div key={r.id} className="flex justify-between items-center p-2.5 bg-white border border-slate-100 rounded-lg text-xs">
                      <div>
                        <strong className="text-slate-800">{r.criterion}</strong>
                        <span className="text-[10px] text-slate-400 font-medium ml-1">({r.maxPoints} pts) • {r.description}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRubrics(prev => prev.filter((_, idx) => idx !== i))}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Conditional Quiz Questions Block */}
          {type === 'QUIZ' && (
            <div className="border border-slate-150 rounded-xl p-4 bg-slate-50/50 space-y-4">
              <span className="text-xs font-bold text-[#1e2e6b] flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                Online MCQ & Quiz Questions Panel
              </span>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <select
                  value={qType}
                  onChange={(e: any) => setQType(e.target.value)}
                  className="bg-white text-xs border border-slate-200 p-2 rounded-lg text-slate-700"
                >
                  <option value="MCQ">Multiple Choice (MCQ)</option>
                  <option value="TRUE_FALSE">True / False</option>
                  <option value="SHORT_ANSWER">Short Answer</option>
                </select>
                <input
                  type="number"
                  placeholder="Points"
                  value={qPoints}
                  onChange={(e) => setQPoints(Number(e.target.value))}
                  className="bg-white text-xs border border-slate-200 p-2 rounded-lg text-slate-700 font-mono font-bold"
                />
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="py-2 bg-[#1e2e6b] text-white hover:bg-[#132150] text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 md:col-span-2"
                >
                  <PlusCircle className="w-4 h-4" /> Add Question to Bank
                </button>
              </div>

              <input
                type="text"
                placeholder="Question text..."
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                className="w-full bg-white text-xs border border-slate-200 p-2 rounded-lg text-slate-700 font-bold"
              />

              {qType === 'MCQ' && (
                <input
                  type="text"
                  placeholder="MCQ Options (comma separated, e.g. Option A, Option B, Option C)"
                  value={qOptions}
                  onChange={(e) => setQOptions(e.target.value)}
                  className="w-full bg-white text-xs border border-slate-200 p-2 rounded-lg text-slate-700"
                />
              )}

              <input
                type="text"
                placeholder="Correct Answer (Exact string matches case-insensitive)"
                value={qCorrectAnswer}
                onChange={(e) => setQCorrectAnswer(e.target.value)}
                className="w-full bg-white text-xs border border-slate-200 p-2 rounded-lg text-slate-700 font-semibold"
              />

              {questions.length > 0 && (
                <div className="space-y-2 mt-2">
                  {questions.map((q, i) => (
                    <div key={q.id} className="p-3 bg-white border border-slate-100 rounded-lg text-xs space-y-1">
                      <div className="flex justify-between items-center font-bold text-slate-700">
                        <span>Q{i+1}: {q.text} ({q.points} pts)</span>
                        <button
                          type="button"
                          onClick={() => setQuestions(prev => prev.filter((_, idx) => idx !== i))}
                          className="text-rose-500"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {q.options && <div className="text-[10px] text-slate-400">Options: {q.options.join(' | ')}</div>}
                      <div className="text-[10px] text-emerald-600 font-semibold">Answer: {q.correctAnswer}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveTab('LIST')}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1e2e6b] text-white hover:bg-[#132150] text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" /> Build Classwork
            </button>
          </div>
        </form>
      )}

      {/* Detail / Interactive View (Open Assignment for Student or Gradebook list for Teacher) */}
      {selectedAssignment && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#1e2e6b]" />
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{selectedAssignment.title}</h3>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">{selectedAssignment.type}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="text-xs text-slate-500 hover:underline"
                >
                  ← Back to coursework
                </button>
              </div>

              <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line">{selectedAssignment.description}</p>

              {/* Rubric Criteria List */}
              {selectedAssignment.rubrics.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                    <Award className="w-4 h-4 text-amber-500" /> Grading Rubric Detail
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedAssignment.rubrics.map(rub => (
                      <div key={rub.id} className="p-3 bg-slate-50 border border-slate-150 rounded-lg text-xs">
                        <div className="flex justify-between font-bold text-slate-700 mb-1">
                          <span>{rub.criterion}</span>
                          <span className="text-amber-600 font-mono">{rub.maxPoints} Points</span>
                        </div>
                        <p className="text-slate-500 text-[10px] leading-normal">{rub.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* IF TEACHER: SUBMISSIONS INBOX */}
            {isTeacher && (
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                <span className="text-xs font-bold text-[#1e2e6b] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                  <User className="w-4 h-4 text-amber-500" />
                  Submission Inbox ({submissions.filter(s => s.assignmentId === selectedAssignment.id).length} turned in)
                </span>

                <div className="divide-y divide-slate-100">
                  {submissions.filter(s => s.assignmentId === selectedAssignment.id).map(sub => (
                    <div key={sub.id} className="py-3 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-slate-800">{sub.studentName} ({sub.registerNo})</p>
                        <p className="text-[10px] text-slate-400">Submitted: {new Date(sub.submittedAt).toLocaleString()}</p>
                        {sub.attachments.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <FileText className="w-3.5 h-3.5 text-[#1e2e6b]" />
                            <span className="text-[10px] font-mono text-slate-500">{sub.attachments[0].name} ({sub.attachments[0].size})</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                          sub.status === 'GRADED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {sub.status === 'GRADED' ? `GRADED: ${sub.marksObtained}/${selectedAssignment.maxMarks}` : 'PENDING'}
                        </span>
                        <button
                          onClick={() => {
                            setGradingSubmission(sub);
                            setGradingMarks(sub.marksObtained || selectedAssignment.maxMarks);
                            setGradingFeedback(sub.feedback || '');
                          }}
                          className="px-2.5 py-1 bg-[#1e2e6b] hover:bg-[#132150] text-white font-bold text-[10px] rounded-lg shadow-xs"
                        >
                          Grade Submission
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* POPUP/INLINE GRADING PANEL */}
                {gradingSubmission && (
                  <form onSubmit={handleFacultySubmitGrade} className="border border-amber-300 rounded-xl p-5 bg-amber-500/5 mt-4 space-y-4">
                    <div className="flex justify-between items-center border-b border-amber-150 pb-2">
                      <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-600" />
                        Grading: {gradingSubmission.studentName}
                      </span>
                      <button type="button" onClick={() => setGradingSubmission(null)} className="text-xs font-bold text-slate-500 hover:underline">
                        Cancel
                      </button>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 max-h-[150px] overflow-y-auto">
                      <strong>Student submission text:</strong>
                      <p className="mt-1 leading-relaxed whitespace-pre-wrap">{gradingSubmission.text}</p>
                      {gradingSubmission.codeSolution && (
                        <pre className="mt-2 p-2 bg-slate-900 text-slate-100 font-mono rounded text-[11px] overflow-x-auto">
                          {gradingSubmission.codeSolution}
                        </pre>
                      )}
                    </div>

                    {/* Rubrics breakdown inputs */}
                    {selectedAssignment.rubrics.length > 0 && (
                      <div className="space-y-2 bg-white p-3 border border-slate-100 rounded-lg">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Rubric Scoring Breakout</span>
                        {selectedAssignment.rubrics.map(rub => (
                          <div key={rub.id} className="flex justify-between items-center text-xs border-b border-slate-50 py-1.5 last:border-b-0">
                            <div>
                              <strong className="text-slate-700">{rub.criterion}</strong>
                              <span className="text-[10px] text-slate-400 ml-1">(max {rub.maxPoints} pts)</span>
                            </div>
                            <input
                              type="number"
                              min={0}
                              max={rub.maxPoints}
                              required
                              value={gradingRubricScores[rub.id] ?? rub.maxPoints}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setGradingRubricScores(prev => ({ ...prev, [rub.id]: val }));
                                // Auto sum all rubric entries
                                const updatedScores = { ...gradingRubricScores, [rub.id]: val };
                                const sum = selectedAssignment.rubrics.reduce((acc, r) => acc + (updatedScores[r.id] ?? r.maxPoints), 0);
                                setGradingMarks(sum);
                              }}
                              className="w-16 border border-slate-200 rounded p-1 text-center font-mono font-bold"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                      <div className="md:col-span-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Final Score</label>
                        <input
                          type="number"
                          max={selectedAssignment.maxMarks}
                          value={gradingMarks}
                          onChange={(e) => setGradingMarks(Number(e.target.value))}
                          className="w-full mt-1 border border-slate-200 p-2 rounded-lg font-mono font-bold text-sm text-center"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Feedback Comment</label>
                        <input
                          type="text"
                          required
                          placeholder="Provide constructive learning insights..."
                          value={gradingFeedback}
                          onChange={(e) => setGradingFeedback(e.target.value)}
                          className="w-full mt-1 border border-slate-200 p-2 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" /> Complete Grading Process
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Interaction panel for Students */}
          {!isTeacher && (
            <div className="space-y-6">
              
              {/* SUBMIT COMPONENT */}
              {selectedAssignment.type !== 'QUIZ' && (
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <span className="text-xs font-bold text-[#1e2e6b] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Send className="w-4 h-4 text-amber-500" />
                    Deliver Your Work
                  </span>

                  {submittedMessage ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-emerald-800 text-xs font-medium space-y-1">
                      <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-1 animate-bounce" />
                      <p>{submittedMessage}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* For coding challenge, show a mock code workspace */}
                      {selectedAssignment.type === 'CODING' && (
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5 mb-1">
                            <Code className="w-3.5 h-3.5 text-indigo-500" /> Coding Workspace (IDE)
                          </label>
                          <textarea
                            value={submissionCode}
                            onChange={(e) => setSubmissionCode(e.target.value)}
                            placeholder="def dijkstra(graph, source):&#10;    # Write your algorithmic solution here..."
                            className="w-full text-xs font-mono bg-slate-900 text-slate-100 p-2.5 rounded-lg border border-slate-700 min-h-[140px]"
                          />
                        </div>
                      )}

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Submission Note / Explanations</label>
                        <textarea
                          value={submissionText}
                          onChange={(e) => setSubmissionText(e.target.value)}
                          placeholder="Respected Professor, submitting my deliverables with explanations..."
                          className="w-full text-xs border border-slate-200 rounded-lg p-2 resize-none min-h-[80px]"
                        />
                      </div>

                      {/* Mock Attached Files list */}
                      {attachedFiles.length > 0 && (
                        <div className="space-y-1.5">
                          {attachedFiles.map((f, i) => (
                            <div key={i} className="flex justify-between items-center p-2 bg-slate-50 border border-slate-100 rounded text-[10px]">
                              <span className="truncate max-w-[150px] font-mono">{f.name}</span>
                              <button onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-rose-500 hover:underline">
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-between gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={handleMockAttachFile}
                          className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold rounded-lg flex items-center gap-1"
                        >
                          📎 Attach File
                        </button>
                        <button
                          onClick={handleStudentSubmit}
                          className="px-4 py-1.5 bg-[#1e2e6b] text-white text-[10px] font-bold rounded-lg shadow-sm hover:bg-[#132150] transition-colors"
                        >
                          Turn In Work
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* QUIZ PARTICIPATOR */}
              {selectedAssignment.type === 'QUIZ' && selectedAssignment.questions && (
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <span className="text-xs font-bold text-[#1e2e6b] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                    <HelpCircle className="w-4 h-4 text-amber-500" />
                    Interactive Quiz Arena
                  </span>

                  {quizScore !== null ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-slate-800 text-xs space-y-2">
                      <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-1 animate-bounce" />
                      <p className="font-bold text-slate-700">Quiz Completed!</p>
                      <p className="text-xs">Your answers compiled instantly inside KASC LMS.</p>
                      <p className="text-sm font-extrabold text-[#1e2e6b] bg-white border border-slate-200 py-1.5 rounded-lg">
                        Score: {quizScore} / {selectedAssignment.maxMarks} Points
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 text-left">
                      {selectedAssignment.questions.map((q, qIdx) => (
                        <div key={q.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs space-y-2">
                          <p className="font-bold text-slate-700">Q{qIdx+1}: {q.text}</p>
                          
                          {q.type === 'MCQ' && q.options && (
                            <div className="space-y-1.5 pl-1">
                              {q.options.map(opt => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer py-1 hover:bg-white rounded transition-colors px-1">
                                  <input
                                    type="radio"
                                    name={`quiz-q-${q.id}`}
                                    value={opt}
                                    checked={quizAnswers[q.id] === opt}
                                    onChange={(e) => setQuizAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                    className="text-[#1e2e6b] focus:ring-0"
                                  />
                                  <span className="text-slate-600 text-[11px]">{opt}</span>
                                </label>
                              ))}
                            </div>
                          )}

                          {q.type === 'TRUE_FALSE' && (
                            <div className="flex gap-4 pl-1">
                              {['True', 'False'].map(opt => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`quiz-q-${q.id}`}
                                    value={opt}
                                    checked={quizAnswers[q.id] === opt}
                                    onChange={(e) => setQuizAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                    className="text-[#1e2e6b] focus:ring-0"
                                  />
                                  <span className="text-slate-600 text-[11px]">{opt}</span>
                                </label>
                              ))}
                            </div>
                          )}

                          {q.type === 'SHORT_ANSWER' && (
                            <input
                              type="text"
                              placeholder="Type your answer short & clean..."
                              value={quizAnswers[q.id] || ''}
                              onChange={(e) => setQuizAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                              className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-700"
                            />
                          )}
                        </div>
                      ))}

                      <button
                        onClick={handleStudentSubmitQuiz}
                        className="w-full py-2 bg-[#1e2e6b] hover:bg-[#132150] text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                      >
                        Submit Quiz Participation
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
}
