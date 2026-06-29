import { Role } from '../types';

export interface Classroom {
  id: string;
  name: string;
  code: string;
  description: string;
  subjectIds: string[];
  facultyId: string;
  studentIds: string[];
  parentIds: string[];
  semester: string;
  department: string;
  googleClassroomUrl?: string;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  department: string;
  description: string;
}

export interface Attachment {
  name: string;
  type: string;
  size: string;
  url: string;
}

export interface EmojiReaction {
  emoji: string;
  count: number;
  users: string[]; // User IDs who reacted
}

export interface Comment {
  id: string;
  text: string;
  posterId: string;
  posterName: string;
  posterRole: Role;
  emojiReactions: EmojiReaction[];
  createdAt: string;
}

export interface Announcement {
  id: string;
  classroomId: string;
  posterId: string;
  posterName: string;
  posterRole: Role;
  text: string;
  attachments: Attachment[];
  comments: Comment[];
  likes: string[]; // List of user IDs who liked
  isPinned: boolean;
  scheduledAt?: string; // If scheduled, this will be set
  createdAt: string;
}

export type AssignmentType = 
  | 'ASSIGNMENT' 
  | 'QUIZ' 
  | 'CODING' 
  | 'ESSAY' 
  | 'MCQ' 
  | 'PRACTICE' 
  | 'GROUP' 
  | 'LAB' 
  | 'HOMEWORK';

export interface RubricItem {
  id: string;
  criterion: string;
  maxPoints: number;
  description: string;
}

export interface QuizQuestion {
  id: string;
  type: 'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'CODE_CHALLENGE';
  text: string;
  options?: string[]; // for MCQ
  correctAnswer: string;
  points: number;
  rubric?: string;
}

export interface Assignment {
  id: string;
  classroomId: string;
  subjectId: string;
  title: string;
  description: string;
  type: AssignmentType;
  dueDate: string;
  maxMarks: number;
  rubrics: RubricItem[];
  attachments: Attachment[];
  lateSubmissionRules?: 'NOT_ALLOWED' | 'ALLOW_WITH_PENALTY' | 'ALLOW_ANYTIME';
  questions?: QuizQuestion[];
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  registerNo: string;
  text: string;
  codeSolution?: string; // For coding challenges
  attachments: Attachment[];
  submittedAt: string;
  status: 'SUBMITTED' | 'LATE' | 'GRADED' | 'REJECTED' | 'RESUBMISSION';
  marksObtained?: number;
  gradedBy?: string;
  feedback?: string;
  rubricScores?: Record<string, number>; // Maps RubricItem.id to score
  annotatedPDFUrl?: string; // Annotation layer simulation
  version: number;
}

export interface QuizParticipation {
  id: string;
  quizId: string;
  studentId: string;
  studentName: string;
  score: number;
  maxScore: number;
  answers: Record<string, string>; // maps questionId to answer
  submittedAt: string;
}

export interface AttendanceRecord {
  id: string;
  classroomId: string;
  subjectId: string;
  date: string;
  status: Record<string, 'PRESENT' | 'ABSENT' | 'LATE'>; // maps studentId to status
  takenBy: string;
  createdAt: string;
}

export interface VersionHistoryItem {
  version: number;
  url: string;
  date: string;
  changeLog: string;
}

export interface Material {
  id: string;
  classroomId: string;
  subjectId: string;
  title: string;
  description: string;
  category: 'LECTURE' | 'SYLLABUS' | 'NOTES' | 'REFERENCE';
  fileType: string;
  size: string;
  url: string;
  uploaderId: string;
  uploaderName: string;
  versionHistory: VersionHistoryItem[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  chatGroupId: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  text: string;
  attachments?: Attachment[];
  createdAt: string;
}

export interface ChatGroup {
  id: string;
  name: string;
  type: 'GROUP_DISCUSSION' | 'FACULTY_STUDENT' | 'FACULTY_PARENT';
  classroomId?: string;
  participantIds: string[];
}

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  userName: string;
  userRole: Role;
  ip: string;
  timestamp: string;
  details: string;
}
