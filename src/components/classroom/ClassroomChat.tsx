import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';
import { ChatGroup, ChatMessage, Attachment } from '../../types/classroom';
import { 
  MessageSquare, Send, User, Users, ShieldAlert, Sparkles, Phone, Video, 
  BookOpen, FileText, Download, Check 
} from 'lucide-react';

interface ClassroomChatProps {
  chatGroups: ChatGroup[];
  chatMessages: ChatMessage[];
  onSendMessage: (groupId: string, text: string, attachments?: Attachment[]) => void;
}

export default function ClassroomChat({
  chatGroups,
  chatMessages,
  onSendMessage
}: ClassroomChatProps) {
  const { user } = useAuth();
  const [activeGroupId, setActiveGroupId] = useState(chatGroups[0]?.id || '');
  const [inputText, setInputText] = useState('');
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto Scroll Chat on load and new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeGroupId]);

  const activeGroup = chatGroups.find(g => g.id === activeGroupId);
  const activeGroupMessages = chatMessages.filter(m => m.chatGroupId === activeGroupId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(activeGroupId, inputText);
    setInputText('');

    // Trigger Simulated response from simulated participant in active group
    setTimeout(() => {
      let simulatedReply = '';
      let senderName = 'Simulation System';
      let senderRole = Role.STUDENT;

      if (activeGroup?.type === 'GROUP_DISCUSSION') {
        senderName = 'Dr. Elango S';
        senderRole = Role.FACULTY;
        simulatedReply = `Excellent point raised in the chat. Let's discuss this together in our lecture block tomorrow. Please remember to complete your StarUML diagrams!`;
      } else if (activeGroup?.type === 'FACULTY_STUDENT') {
        senderName = user?.role === Role.FACULTY ? 'Arun Kumar S' : 'Dr. Elango S';
        senderRole = user?.role === Role.FACULTY ? Role.STUDENT : Role.FACULTY;
        simulatedReply = user?.role === Role.FACULTY 
          ? `Thank you so much, Professor. I will review the lecture slides again and submit my code repository tonight.`
          : `Hello! I have reviewed your submission. Your logic is extremely sound. Let's refine the composition cardinalities tomorrow!`;
      } else if (activeGroup?.type === 'FACULTY_PARENT') {
        senderName = user?.role === Role.FACULTY ? 'Sivakumar K (Parent)' : 'Dr. Elango S';
        senderRole = user?.role === Role.FACULTY ? Role.PARENT : Role.FACULTY;
        simulatedReply = user?.role === Role.FACULTY
          ? `Thank you, Professor, for sharing Arun's academic report card. We will ensure he reviews CPU Semaphores closely tonight.`
          : `Hello, Sivakumar. Arun is doing exceptionally well in class. His engagement rate in the computer science laboratory is in the top 5%.`;
      }

      onSendMessage(activeGroupId, simulatedReply, undefined);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs h-[550px] grid grid-cols-1 md:grid-cols-4 overflow-hidden text-left">
      
      {/* Sidebar Chat channels (1 col) */}
      <div className="md:col-span-1 border-r border-slate-150 p-4 space-y-4 flex flex-col h-full bg-slate-50/50">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-100 pb-2">
          Academic Channels
        </span>

        <div className="space-y-1.5 flex-1 overflow-y-auto">
          {chatGroups.map(group => {
            const isSelected = group.id === activeGroupId;
            return (
              <button
                key={group.id}
                onClick={() => setActiveGroupId(group.id)}
                className={`w-full p-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2.5 text-left ${
                  isSelected 
                    ? 'bg-[#1e2e6b] text-white shadow-xs' 
                    : 'hover:bg-slate-150/50 text-slate-600 bg-white border border-slate-100'
                }`}
              >
                {group.type === 'GROUP_DISCUSSION' ? (
                  <Users className="w-4 h-4 shrink-0" />
                ) : (
                  <User className="w-4 h-4 shrink-0" />
                )}
                <span className="truncate">{group.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Conversation screen (3 cols) */}
      <div className="md:col-span-3 flex flex-col h-full bg-white relative">
        
        {/* Chat header panel */}
        <div className="p-3 border-b border-slate-150 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1e2e6b]/5 flex items-center justify-center border border-[#1e2e6b]/10 text-[#1e2e6b]">
              {activeGroup?.type === 'GROUP_DISCUSSION' ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-xs">{activeGroup?.name || 'Classroom Discussion'}</h4>
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">{activeGroup?.type.replace('_', ' ')}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-1 text-slate-400 hover:text-slate-600" title="Audio Call"><Phone className="w-3.5 h-3.5" /></button>
            <button className="p-1 text-slate-400 hover:text-slate-600" title="Video Meeting"><Video className="w-3.5 h-3.5" /></button>
          </div>
        </div>

        {/* Conversation flow viewport */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeGroupMessages.length === 0 ? (
            <div className="py-20 text-center text-slate-400 text-xs italic">
              No conversations logged in this channel yet. Say hello to get started!
            </div>
          ) : (
            activeGroupMessages.map((msg) => {
              const isOwnMessage = user && msg.senderId === user.id;
              return (
                <div 
                  key={msg.id} 
                  className={`flex items-start gap-2.5 max-w-[80%] ${
                    isOwnMessage ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-[10px] border border-slate-200">
                    {msg.senderName[0]}
                  </div>

                  <div className="space-y-1 text-left">
                    <div className={`flex items-center gap-1.5 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                      <span className="font-bold text-slate-800 text-[10px]">{msg.senderName}</span>
                      <span className="text-[8px] text-slate-400 bg-slate-50 border border-slate-100 px-1 py-0.5 rounded-sm">
                        {msg.senderRole}
                      </span>
                    </div>

                    <div className={`p-2.5 rounded-xl text-xs relative ${
                      isOwnMessage 
                        ? 'bg-[#1e2e6b] text-white rounded-tr-none' 
                        : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-none'
                    }`}>
                      <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                      
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2 space-y-1.5">
                          {msg.attachments.map((file, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-1.5 bg-black/10 border border-white/10 rounded text-[9px] font-medium text-white">
                              <FileText className="w-3.5 h-3.5" />
                              <span className="truncate max-w-[120px]">{file.name}</span>
                              <Download className="w-3 h-3 cursor-pointer ml-auto hover:text-amber-300" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <p className={`text-[8px] text-slate-400 ${isOwnMessage ? 'text-right' : ''}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-150 bg-slate-50/50 flex gap-2">
          <input
            type="text"
            placeholder="Type your message to active channel..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1e2e6b]"
          />
          <button
            type="submit"
            className="px-3 bg-[#1e2e6b] hover:bg-[#132150] text-white rounded-lg shadow-xs flex items-center justify-center transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>

    </div>
  );
}
