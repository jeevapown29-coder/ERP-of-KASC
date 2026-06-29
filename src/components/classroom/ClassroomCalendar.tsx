import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';
import { Classroom, Subject, Assignment } from '../../types/classroom';
import { 
  Calendar as CalendarIcon, Clock, Bell, AlertCircle, PlusCircle, Trash, Check, 
  MapPin, BookOpen, Sparkles, Star, ChevronLeft, ChevronRight 
} from 'lucide-react';

interface ClassroomCalendarProps {
  classroom: Classroom;
  subjects: Subject[];
  assignments: Assignment[];
}

interface CalendarEvent {
  id: string;
  title: string;
  type: 'CLASS' | 'EXAM' | 'DEADLINE' | 'HOLIDAY' | 'SEMINAR';
  date: string; // YYYY-MM-DD
  time?: string;
  subjectId?: string;
  location?: string;
  reminderSent?: boolean;
}

export default function ClassroomCalendar({
  classroom,
  subjects,
  assignments
}: ClassroomCalendarProps) {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split('T')[0]);

  // Seed events
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    // Generate deadlines from assignments
    const asgEvents: CalendarEvent[] = assignments.map(a => ({
      id: `asg-evt-${a.id}`,
      title: `${a.type}: ${a.title}`,
      type: 'DEADLINE',
      date: a.dueDate.split('T')[0],
      time: a.dueDate.split('T')[1]?.substring(0, 5) || '23:59',
      subjectId: a.subjectId,
      location: 'Online Classroom LMS'
    }));

    const otherEvents: CalendarEvent[] = [
      {
        id: 'evt-1',
        title: 'OOAD Unit 1 Seminar & Guest Lecture',
        type: 'SEMINAR',
        date: new Date(Date.now() + 1 * 24 * 3600000).toISOString().split('T')[0],
        time: '10:00',
        subjectId: 'sub-1',
        location: 'KASC Seminar Hall III'
      },
      {
        id: 'evt-2',
        title: 'Mid-Term Comprehensive Examination 2026',
        type: 'EXAM',
        date: new Date(Date.now() + 4 * 24 * 3600000).toISOString().split('T')[0],
        time: '09:30',
        subjectId: 'sub-2',
        location: 'CS Main Block Hall 4'
      },
      {
        id: 'evt-3',
        title: 'Pongal Festival College Holidays',
        type: 'HOLIDAY',
        date: new Date(Date.now() + 10 * 24 * 3600000).toISOString().split('T')[0],
        location: 'Entire KASC Campus Closed'
      },
      {
        id: 'evt-4',
        title: 'Regular OS Lab Session',
        type: 'CLASS',
        date: new Date().toISOString().split('T')[0],
        time: '13:30',
        subjectId: 'sub-2',
        location: 'Advanced Computing Lab II'
      }
    ];

    return [...asgEvents, ...otherEvents];
  });

  // Event creation form state (Faculty only)
  const [evtTitle, setEvtTitle] = useState('');
  const [evtType, setEvtType] = useState<'CLASS' | 'EXAM' | 'DEADLINE' | 'HOLIDAY' | 'SEMINAR'>('CLASS');
  const [evtDate, setEvtDate] = useState('');
  const [evtTime, setEvtTime] = useState('');
  const [evtSubjectId, setEvtSubjectId] = useState(subjects[0]?.id || '');
  const [evtLocation, setEvtLocation] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const isTeacher = user?.role === Role.FACULTY;

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtTitle.trim() || !evtDate) return;

    const newEvt: CalendarEvent = {
      id: `evt-${Date.now()}`,
      title: evtTitle,
      type: evtType,
      date: evtDate,
      time: evtTime || undefined,
      subjectId: evtType !== 'HOLIDAY' ? evtSubjectId : undefined,
      location: evtLocation || undefined
    };

    setEvents(prev => [...prev, newEvt]);
    setEvtTitle('');
    setEvtDate('');
    setEvtTime('');
    setEvtLocation('');
    setShowAddForm(false);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // Calendar generation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const daysArray = [];
  // Padding cells
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push(null);
  }
  // Month days
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(new Date(year, month, i));
  }

  // Find events on a specific day
  const getEventsForDate = (dateStr: string) => {
    return events.filter(e => e.date === dateStr);
  };

  const selectedDateEvents = getEventsForDate(selectedDateStr);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Calendar Grid & Header Left Side (2 cols) */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-left">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#1e2e6b]" />
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
              {monthNames[month]} {year}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrevMonth}
              className="p-1 border border-slate-200 hover:bg-slate-50 rounded-lg"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <button 
              onClick={handleNextMonth}
              className="p-1 border border-slate-200 hover:bg-slate-50 rounded-lg"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Calendar Grid Header */}
        <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 py-2 border-b border-slate-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2 mt-2">
          {daysArray.map((dateObj, idx) => {
            if (!dateObj) return <div key={`empty-${idx}`} className="h-14 bg-slate-50/30 rounded-lg" />;
            
            const dateString = dateObj.toISOString().split('T')[0];
            const dayEvents = getEventsForDate(dateString);
            const isSelected = selectedDateStr === dateString;
            const isToday = new Date().toISOString().split('T')[0] === dateString;

            return (
              <button
                key={dateString}
                onClick={() => setSelectedDateStr(dateString)}
                className={`h-14 p-1.5 rounded-lg border text-left flex flex-col justify-between transition-all hover:border-[#1e2e6b]/40 relative ${
                  isSelected ? 'bg-[#1e2e6b] border-[#1e2e6b] text-white shadow-xs' :
                  isToday ? 'bg-[#f09a1a]/5 border-[#f09a1a] text-[#f09a1a] font-bold' :
                  'bg-white border-slate-100 text-slate-700'
                }`}
              >
                <span className="text-[11px] font-semibold">{dateObj.getDate()}</span>
                
                {/* Event Dots */}
                {dayEvents.length > 0 && (
                  <div className="flex gap-1 overflow-hidden mt-1">
                    {dayEvents.slice(0, 3).map(e => (
                      <span 
                        key={e.id} 
                        className={`w-2 h-2 rounded-full ${
                          e.type === 'DEADLINE' ? 'bg-rose-500' :
                          e.type === 'EXAM' ? 'bg-amber-500' :
                          e.type === 'HOLIDAY' ? 'bg-indigo-500' :
                          'bg-emerald-500'
                        }`}
                        title={e.title}
                      />
                    ))}
                    {dayEvents.length > 3 && <span className="text-[7px] font-mono">+ {dayEvents.length - 3}</span>}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Faculty Event creation drawer */}
        {isTeacher && (
          <div className="mt-5 border-t border-slate-100 pt-4">
            {!showAddForm ? (
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setEvtDate(selectedDateStr);
                }}
                className="w-full py-2 border border-dashed border-slate-300 hover:bg-[#1e2e6b]/5 hover:border-[#1e2e6b] text-[#1e2e6b] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                Schedule Class, Exam, or Seminar on {selectedDateStr}
              </button>
            ) : (
              <form onSubmit={handleAddEvent} className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-700">Add Class Schedule / Event</span>
                  <button 
                    type="button" 
                    onClick={() => setShowAddForm(false)}
                    className="text-slate-400 hover:text-slate-600 font-bold"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Event Title</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g., Guest Lecture or Practical Review"
                      value={evtTitle}
                      onChange={(e) => setEvtTitle(e.target.value)}
                      className="w-full mt-1 bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Event Type</label>
                    <select
                      value={evtType}
                      onChange={(e: any) => setEvtType(e.target.value)}
                      className="w-full mt-1 bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-700 font-semibold"
                    >
                      <option value="CLASS">Regular Class</option>
                      <option value="EXAM">Semester Exam</option>
                      <option value="SEMINAR">Seminar Session</option>
                      <option value="HOLIDAY">Holiday</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Date</label>
                    <input
                      type="date"
                      required
                      value={evtDate}
                      onChange={(e) => setEvtDate(e.target.value)}
                      className="w-full mt-1 bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-[#1e2e6b] font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Time</label>
                    <input
                      type="time"
                      value={evtTime}
                      onChange={(e) => setEvtTime(e.target.value)}
                      className="w-full mt-1 bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Course Subject</label>
                    <select
                      value={evtSubjectId}
                      onChange={(e) => setEvtSubjectId(e.target.value)}
                      className="w-full mt-1 bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-700"
                    >
                      {subjects.map(s => <option key={s.id} value={s.id}>{s.code}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Location / Venue</label>
                    <input
                      type="text"
                      placeholder="e.g. Lab 3, Hall A"
                      value={evtLocation}
                      onChange={(e) => setEvtLocation(e.target.value)}
                      className="w-full mt-1 bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-700"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-[#1e2e6b] hover:bg-[#132150] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <PlusCircle className="w-4 h-4" /> Save Scheduled Event
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Events detail list Right Side (1 col) */}
      <div className="space-y-6">
        
        {/* Dynamic reminder alert widget */}
        <div className="bg-[#1e2e6b] rounded-xl border border-[#1e2e6b]/30 shadow-md p-5 text-left text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#f09a1a]/10 blur-xl rounded-full" />
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-5 h-5 text-[#f09a1a] animate-bounce" />
            <span className="font-bold text-xs uppercase tracking-wider text-[#f09a1a]">Auto Study Reminders</span>
          </div>
          <div className="space-y-2 text-xs text-slate-100">
            <div className="flex items-start gap-2 bg-white/5 border border-white/10 rounded-lg p-2">
              <Clock className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <strong className="text-white block font-bold text-[11px]">OOAD assignment due</strong>
                <span className="text-[10px] text-slate-300">Case Study due in exactly 4 days. Turn it in early!</span>
              </div>
            </div>
            <div className="flex items-start gap-2 bg-white/5 border border-white/10 rounded-lg p-2">
              <BookOpen className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <strong className="text-white block font-bold text-[11px]">Next Class Session</strong>
                <span className="text-[10px] text-slate-300">Regular OS Lab scheduled tomorrow, CS Lab-II.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Date Detail Cards */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3 border-b border-slate-100 pb-1.5">
            Log for {selectedDateStr}
          </span>

          <div className="space-y-3">
            {selectedDateEvents.length === 0 ? (
              <div className="py-8 text-center text-slate-400 italic text-xs">
                No educational events or classes scheduled for this date.
              </div>
            ) : (
              selectedDateEvents.map(evt => {
                const subObj = subjects.find(s => s.id === evt.subjectId);
                return (
                  <div 
                    key={evt.id} 
                    className={`p-3.5 rounded-xl border flex flex-col justify-between relative text-left transition-all ${
                      evt.type === 'DEADLINE' ? 'border-rose-100 bg-rose-500/5' :
                      evt.type === 'EXAM' ? 'border-amber-100 bg-amber-500/5' :
                      evt.type === 'HOLIDAY' ? 'border-indigo-100 bg-indigo-500/5' :
                      'border-emerald-100 bg-emerald-500/5'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                          evt.type === 'DEADLINE' ? 'bg-rose-100 text-rose-800' :
                          evt.type === 'EXAM' ? 'bg-amber-100 text-amber-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {evt.type}
                        </span>
                        {evt.time && (
                          <span className="text-[10px] font-bold text-slate-500 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {evt.time}
                          </span>
                        )}
                      </div>
                      
                      <h4 className="font-bold text-slate-800 text-xs mt-1">{evt.title}</h4>
                      {subObj && <p className="text-[10px] text-slate-400 mt-0.5">Course Code: {subObj.code}</p>}
                      {evt.location && (
                        <p className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {evt.location}
                        </p>
                      )}
                    </div>

                    {isTeacher && (
                      <button
                        onClick={() => handleDeleteEvent(evt.id)}
                        className="absolute bottom-3 right-3 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete event"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
