import { Classroom, Subject, Announcement, Assignment, Submission, QuizParticipation, AttendanceRecord, Material, ChatMessage, ChatGroup, AuditLog } from '../types/classroom';
import { Role } from '../types';

export interface ClassroomOSData {
  classrooms: Classroom[];
  subjects: Subject[];
  announcements: Announcement[];
  assignments: Assignment[];
  submissions: Submission[];
  quizParticipations: QuizParticipation[];
  attendanceRecords: AttendanceRecord[];
  materials: Material[];
  chatGroups: ChatGroup[];
  chatMessages: ChatMessage[];
  auditLogs: AuditLog[];
}

const SEED_SUBJECTS: Subject[] = [
  { id: 'sub-1', name: 'Object-Oriented Analysis & Design', code: 'CS-401', department: 'Computer Science', description: 'UML modeling, design patterns, and system architectures.' },
  { id: 'sub-2', name: 'Operating Systems & Security', code: 'CS-402', department: 'Computer Science', description: 'Process management, memory management, threads, and security.' },
  { id: 'sub-3', name: 'Database Management Systems', code: 'CS-403', department: 'Computer Science', description: 'Relational algebra, SQL, normal forms, and transaction control.' },
  { id: 'sub-4', name: 'AI & Neural Networks', code: 'CS-404', department: 'Computer Science', description: 'Deep learning, artificial neural networks, and heuristics.' }
];

const SEED_CLASSROOMS: Classroom[] = [
  {
    id: 'class-1',
    name: 'IV-B.Sc. Computer Science (Aided)',
    code: 'IV-CS-A',
    description: 'Fourth Semester, Section A - computer science core syllabus.',
    subjectIds: ['sub-1', 'sub-2', 'sub-3', 'sub-4'],
    facultyId: 'fac-1', // Faculty: Dr. Elango S
    studentIds: ['1', '2', '3', '4'],
    parentIds: ['par-1', 'par-2'],
    semester: 'Semester IV',
    department: 'Computer Science',
    googleClassroomUrl: 'https://classroom.google.com/c/ODY0NzA4MTI1NTg2/a/ODY0NzA4MTI1NjE0/details',
    createdAt: new Date(Date.now() - 30 * 24 * 3600000).toISOString()
  },
  {
    id: 'class-2',
    name: 'II-B.Sc. CS with Data Analytics',
    code: 'II-CS-DA',
    description: 'Second Semester - focus on big data and analytics methodologies.',
    subjectIds: ['sub-3', 'sub-4'],
    facultyId: 'fac-2', // Faculty: Prof. Priya M
    studentIds: ['3', '4'],
    parentIds: ['par-3'],
    semester: 'Semester II',
    department: 'Computer Science',
    googleClassroomUrl: 'https://classroom.google.com/c/ODY0NzA4MTI1NTg2/a/ODY0NzA4MTI1NjE0/details',
    createdAt: new Date(Date.now() - 15 * 24 * 3600000).toISOString()
  }
];

const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    classroomId: 'class-1',
    posterId: 'fac-1',
    posterName: 'Dr. Elango S',
    posterRole: Role.FACULTY,
    text: `Welcome to Semester IV of Computer Science! 🚀\n\nI have pinned the detailed syllabus for CS-401 Object-Oriented Analysis & Design. Please review it before our lecture tomorrow at 9:30 AM. We will discuss UML Use Case diagrams in detail.\n\nRequired readings: Chapters 1-3 from the Fowler Reference Book.`,
    attachments: [
      { name: 'CS401_OOAD_Detailed_Syllabus.pdf', type: 'application/pdf', size: '1.24 MB', url: '#' }
    ],
    comments: [
      {
        id: 'c-1',
        text: 'Thank you, Sir! I have downloaded the syllabus.',
        posterId: '1',
        posterName: 'Arun Kumar S',
        posterRole: Role.STUDENT,
        emojiReactions: [{ emoji: '👍', count: 3, users: ['2', 'fac-1', '3'] }],
        createdAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString()
      },
      {
        id: 'c-2',
        text: 'Sir, will we need IBM Rational Rose or StarUML for drawing UML diagrams?',
        posterId: '2',
        posterName: 'Divya Bharathi R',
        posterRole: Role.STUDENT,
        emojiReactions: [{ emoji: '💡', count: 2, users: ['fac-1', '1'] }],
        createdAt: new Date(Date.now() - 1.5 * 24 * 3600000).toISOString()
      },
      {
        id: 'c-3',
        text: 'We will use StarUML as it is lightweight and open-source. I will upload a setup guide shortly.',
        posterId: 'fac-1',
        posterName: 'Dr. Elango S',
        posterRole: Role.FACULTY,
        emojiReactions: [{ emoji: '🙌', count: 2, users: ['2', '1'] }],
        createdAt: new Date(Date.now() - 1 * 24 * 3600000).toISOString()
      }
    ],
    likes: ['1', '2', '3'],
    isPinned: true,
    createdAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString()
  },
  {
    id: 'ann-2',
    classroomId: 'class-1',
    posterId: 'fac-1',
    posterName: 'Dr. Elango S',
    posterRole: Role.FACULTY,
    text: `Hello students, I highly recommend watching this short crash-course video on CPU Scheduling algorithms for our Operating Systems lecture tomorrow.\n\nLink: https://www.youtube.com/watch?v=zFJZ8sX_Xks\n\nIt covers FCFS, SJF, and Round Robin scheduling visually!`,
    attachments: [
      { name: 'Operating_System_Intro_Slides.pptx', type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', size: '4.85 MB', url: '#' }
    ],
    comments: [],
    likes: ['1', '4'],
    isPinned: false,
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString()
  }
];

const SEED_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    classroomId: 'class-1',
    subjectId: 'sub-1',
    title: 'OOAD Use Case & Class Diagram Case Study',
    description: 'Design a complete UML Use Case Diagram and class diagram for a "Smart Hospital Management System". Identify at least 5 primary actors, 10 use cases, and 8 classes with appropriate properties, methods, and relationships (generalization, aggregation, dependency).\n\nSubmit your UML diagram in JPEG/PNG/PDF formats with a 2-page system architecture description.',
    type: 'ASSIGNMENT',
    dueDate: new Date(Date.now() + 5 * 24 * 3600000).toISOString(),
    maxMarks: 20,
    rubrics: [
      { id: 'r-1', criterion: 'Actor & Use Case Mapping', maxPoints: 5, description: 'Identify correct actors, use cases, and include/extend relationships.' },
      { id: 'r-2', criterion: 'Class Diagram Relationships', maxPoints: 5, description: 'Correct representation of associations, compositions, and cardinalities.' },
      { id: 'r-3', criterion: 'System Architectural Flow', maxPoints: 5, description: 'Clear technical writing and robust structural explanation.' },
      { id: 'r-4', criterion: 'UML Standard Notation', maxPoints: 5, description: 'Using correct UML symbols, stereotypes, and notations.' }
    ],
    attachments: [
      { name: 'Hospital_Reservation_SRS_Reference.pdf', type: 'application/pdf', size: '940 KB', url: '#' }
    ],
    lateSubmissionRules: 'ALLOW_WITH_PENALTY',
    createdAt: new Date(Date.now() - 4 * 24 * 3600000).toISOString()
  },
  {
    id: 'asg-2',
    classroomId: 'class-1',
    subjectId: 'sub-2',
    title: 'Operating Systems - Process Management Practice Test',
    description: 'An interactive multiple-choice quiz covering CPU Scheduling, Semaphores, Deadlocks, and IPC.\n\nDuration: 20 minutes. Max Marks: 15.',
    type: 'QUIZ',
    dueDate: new Date(Date.now() + 2 * 24 * 3600000).toISOString(),
    maxMarks: 15,
    rubrics: [],
    attachments: [],
    lateSubmissionRules: 'NOT_ALLOWED',
    questions: [
      {
        id: 'q-1',
        type: 'MCQ',
        text: 'Which CPU scheduling algorithm can lead to starvation/indefinite blocking?',
        options: [
          'First Come First Served (FCFS)',
          'Round Robin (RR)',
          'Shortest Job First (SJF) / Priority Scheduling',
          'None of the above'
        ],
        correctAnswer: 'Shortest Job First (SJF) / Priority Scheduling',
        points: 5
      },
      {
        id: 'q-2',
        type: 'MCQ',
        text: 'A critical section is a program segment...',
        options: [
          'Where shared resources are accessed.',
          'Which runs in a separate kernel thread.',
          'Which causes system deadlock.',
          'Used to print logs.'
        ],
        correctAnswer: 'Where shared resources are accessed.',
        points: 5
      },
      {
        id: 'q-3',
        type: 'TRUE_FALSE',
        text: 'Deadlock avoidance (like Bankers Algorithm) is more dynamic but computationally expensive than Deadlock prevention.',
        correctAnswer: 'True',
        points: 5
      }
    ],
    createdAt: new Date(Date.now() - 1 * 24 * 3600000).toISOString()
  },
  {
    id: 'asg-3',
    classroomId: 'class-1',
    subjectId: 'sub-1',
    title: 'Programming Challenge: Dijkstra Shortest Path Solver',
    description: 'Implement Djikstra\'s algorithm in Python, Java, or C++. Write a function that takes an adjacency matrix representation of a weighted graph and a source node, and returns the shortest path distances to all other vertices.\n\nEnsure to comment your code and state the time and space complexity in Big-O notation.',
    type: 'CODING',
    dueDate: new Date(Date.now() + 8 * 24 * 3600000).toISOString(),
    maxMarks: 10,
    rubrics: [
      { id: 'rc-1', criterion: 'Algorithm Correctness', maxPoints: 5, description: 'Handles positive edge weights, disconnected components, and complex graphs correctly.' },
      { id: 'rc-2', criterion: 'Complexity Analysis', maxPoints: 3, description: 'States correct Big-O complexities and optimizes priority queues.' },
      { id: 'rc-3', criterion: 'Code Quality', maxPoints: 2, description: 'Variable names, documentation, and clean modular structure.' }
    ],
    attachments: [],
    createdAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString()
  }
];

const SEED_SUBMISSIONS: Submission[] = [
  {
    id: 'subm-1',
    assignmentId: 'asg-1',
    studentId: '1', // Arun Kumar S
    studentName: 'Arun Kumar S',
    registerNo: '24BCS101',
    text: `Respected Sir, please find my submission for KASC OOAD Use Case & Class Diagram Case study.\n\nI have designed the diagrams based on the Hospital SRS requirements. Identified 6 actors (Patient, Doctor, Admin, Nurse, Pharmacist, Lab Technician) and 12 use cases including scheduling, billing, and lab testing.\n\nI used StarUML for drafting the class hierarchy and exported the UML models inside the attached PDF.`,
    attachments: [
      { name: 'Arun_Kumar_24BCS101_Hospital_CaseStudy.pdf', type: 'application/pdf', size: '2.45 MB', url: '#' }
    ],
    submittedAt: new Date(Date.now() - 1 * 24 * 3600000).toISOString(),
    status: 'GRADED',
    marksObtained: 18,
    gradedBy: 'Dr. Elango S',
    feedback: 'Excellent actor classification, Arun. Your use case diagram is extremely detailed. In the class diagram, remember that the relationship between Hospital and Ward should be Composition rather than simple Aggregation, as Wards cannot exist independently of the Hospital. Solid attempt overall!',
    rubricScores: {
      'r-1': 5,
      'r-2': 4,
      'r-3': 4,
      'r-4': 5
    },
    version: 1
  },
  {
    id: 'subm-2',
    assignmentId: 'asg-1',
    studentId: '2', // Divya Bharathi R
    studentName: 'Divya Bharathi R',
    registerNo: '24BCS102',
    text: `Sir, submitting my OOAD assignment. Diagrams are attached. Let me know if any corrections are needed.`,
    attachments: [
      { name: 'Divya_Bharathi_Hospital_Model.jpg', type: 'image/jpeg', size: '1.12 MB', url: '#' }
    ],
    submittedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    status: 'SUBMITTED',
    version: 1
  }
];

const SEED_QUIZ_PARTICIPATIONS: QuizParticipation[] = [
  {
    id: 'qp-1',
    quizId: 'asg-2',
    studentId: '1',
    studentName: 'Arun Kumar S',
    score: 15,
    maxScore: 15,
    answers: {
      'q-1': 'Shortest Job First (SJF) / Priority Scheduling',
      'q-2': 'Where shared resources are accessed.',
      'q-3': 'True'
    },
    submittedAt: new Date(Date.now() - 8 * 3600000).toISOString()
  }
];

const SEED_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    classroomId: 'class-1',
    subjectId: 'sub-1',
    date: '2026-06-25',
    status: {
      '1': 'PRESENT',
      '2': 'PRESENT',
      '3': 'ABSENT',
      '4': 'PRESENT'
    },
    takenBy: 'Dr. Elango S',
    createdAt: new Date(Date.now() - 4 * 24 * 3600000).toISOString()
  },
  {
    id: 'att-2',
    classroomId: 'class-1',
    subjectId: 'sub-2',
    date: '2026-06-26',
    status: {
      '1': 'PRESENT',
      '2': 'LATE',
      '3': 'PRESENT',
      '4': 'PRESENT'
    },
    takenBy: 'Dr. Elango S',
    createdAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString()
  }
];

const SEED_MATERIALS: Material[] = [
  {
    id: 'mat-1',
    classroomId: 'class-1',
    subjectId: 'sub-1',
    title: 'Syllabus and Course Overview Handout',
    description: 'Detailed syllabus, grading policies, assignment calendar, and recommended reading list.',
    category: 'SYLLABUS',
    fileType: 'application/pdf',
    size: '1.24 MB',
    url: '#',
    uploaderId: 'fac-1',
    uploaderName: 'Dr. Elango S',
    versionHistory: [
      { version: 1, url: '#', date: new Date(Date.now() - 30 * 24 * 3600000).toISOString(), changeLog: 'Initial release of KASC OOAD syllabus.' },
      { version: 2, url: '#', date: new Date(Date.now() - 28 * 24 * 3600000).toISOString(), changeLog: 'Updated tutorial lab hours schedule.' }
    ],
    createdAt: new Date(Date.now() - 30 * 24 * 3600000).toISOString()
  },
  {
    id: 'mat-2',
    classroomId: 'class-1',
    subjectId: 'sub-1',
    title: 'Unit 1: Introduction to UML and OOAD Methodologies',
    description: 'Slides covering structured vs object-oriented design, Agile modeling, and GRASP patterns.',
    category: 'LECTURE',
    fileType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    size: '3.12 MB',
    url: '#',
    uploaderId: 'fac-1',
    uploaderName: 'Dr. Elango S',
    versionHistory: [
      { version: 1, url: '#', date: new Date(Date.now() - 15 * 24 * 3600000).toISOString(), changeLog: 'First release.' }
    ],
    createdAt: new Date(Date.now() - 15 * 24 * 3600000).toISOString()
  }
];

const SEED_CHAT_GROUPS: ChatGroup[] = [
  {
    id: 'group-1',
    name: 'IV-B.Sc. CS General Discussion',
    type: 'GROUP_DISCUSSION',
    classroomId: 'class-1',
    participantIds: ['fac-1', '1', '2', '3', '4']
  },
  {
    id: 'group-2',
    name: 'Faculty Elango ↔ Student Arun S',
    type: 'FACULTY_STUDENT',
    classroomId: 'class-1',
    participantIds: ['fac-1', '1']
  },
  {
    id: 'group-3',
    name: 'Teacher Elango ↔ Parent Sivakumar',
    type: 'FACULTY_PARENT',
    classroomId: 'class-1',
    participantIds: ['fac-1', 'par-1']
  }
];

const SEED_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    chatGroupId: 'group-1',
    senderId: 'fac-1',
    senderName: 'Dr. Elango S',
    senderRole: Role.FACULTY,
    text: 'Good morning everyone! Please check the newly added study materials under Unit 1. Let me know if you face any downloading errors.',
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString()
  },
  {
    id: 'msg-2',
    chatGroupId: 'group-1',
    senderId: '1',
    senderName: 'Arun Kumar S',
    senderRole: Role.STUDENT,
    text: 'Downloaded successfully, Sir! The slides are very clear.',
    createdAt: new Date(Date.now() - 47 * 3600000).toISOString()
  },
  {
    id: 'msg-3',
    chatGroupId: 'group-2',
    senderId: '1',
    senderName: 'Arun Kumar S',
    senderRole: Role.STUDENT,
    text: 'Sir, I had a small doubt regarding the Composition relationship in class diagrams. Can we say that a Head cannot exist without a Human Body?',
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: 'msg-4',
    chatGroupId: 'group-2',
    senderId: 'fac-1',
    senderName: 'Dr. Elango S',
    senderRole: Role.FACULTY,
    text: 'Absolutely! That is a classic example of Composition. The lifetime of the Head is completely governed by the Human Body. If the Body is deleted, the Head is deleted. Simple and logical!',
    createdAt: new Date(Date.now() - 1.8 * 3600000).toISOString()
  }
];

const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    action: 'CLASSROOM_CREATION',
    userId: 'admin-1',
    userName: 'KASC Admin',
    userRole: Role.ADMIN,
    ip: '192.168.1.10',
    timestamp: new Date(Date.now() - 30 * 24 * 3600000).toISOString(),
    details: 'Created classroom "IV-B.Sc. Computer Science" with code "IV-CS-A".'
  },
  {
    id: 'log-2',
    action: 'POST_ANNOUNCEMENT',
    userId: 'fac-1',
    userName: 'Dr. Elango S',
    userRole: Role.FACULTY,
    ip: '192.168.1.45',
    timestamp: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
    details: 'Faculty Dr. Elango S posted announcement ID "ann-1" about syllabus rollout.'
  }
];

export function getInitialClassroomData(): ClassroomOSData {
  return {
    classrooms: SEED_CLASSROOMS,
    subjects: SEED_SUBJECTS,
    announcements: SEED_ANNOUNCEMENTS,
    assignments: SEED_ASSIGNMENTS,
    submissions: SEED_SUBMISSIONS,
    quizParticipations: SEED_QUIZ_PARTICIPATIONS,
    attendanceRecords: SEED_ATTENDANCE,
    materials: SEED_MATERIALS,
    chatGroups: SEED_CHAT_GROUPS,
    chatMessages: SEED_CHAT_MESSAGES,
    auditLogs: SEED_AUDIT_LOGS
  };
}

export function loadClassroomOSState(): ClassroomOSData {
  const data = localStorage.getItem('kasc_classroom_state');
  if (data) {
    try {
      const parsed = JSON.parse(data);
      const classrooms: Classroom[] = (parsed.classrooms || []).map((c: any) => {
        if (!c.googleClassroomUrl) {
          return {
            ...c,
            googleClassroomUrl: 'https://classroom.google.com/c/ODY0NzA4MTI1NTg2/a/ODY0NzA4MTI1NjE0/details'
          };
        }
        return c;
      });
      // Fallbacks for missing arrays to ensure backward compatibility
      return {
        classrooms,
        subjects: parsed.subjects || [],
        announcements: parsed.announcements || [],
        assignments: parsed.assignments || [],
        submissions: parsed.submissions || [],
        quizParticipations: parsed.quizParticipations || [],
        attendanceRecords: parsed.attendanceRecords || [],
        materials: parsed.materials || [],
        chatGroups: parsed.chatGroups || [],
        chatMessages: parsed.chatMessages || [],
        auditLogs: parsed.auditLogs || []
      };
    } catch (e) {
      console.error('Error parsing classroom state, resetting', e);
      return getInitialClassroomData();
    }
  }
  
  const seed = getInitialClassroomData();
  saveClassroomOSState(seed);
  return seed;
}

export function saveClassroomOSState(data: ClassroomOSData) {
  localStorage.setItem('kasc_classroom_state', JSON.stringify(data));
}

let saveDebounceTimer: NodeJS.Timeout | null = null;
export function saveClassroomOSStateDebounced(data: ClassroomOSData, delayMs = 500) {
  if (saveDebounceTimer) clearTimeout(saveDebounceTimer);
  saveDebounceTimer = setTimeout(() => {
    saveClassroomOSState(data);
  }, delayMs);
}

export function resetClassroomOSState(): ClassroomOSData {
  const seed = getInitialClassroomData();
  saveClassroomOSState(seed);
  return seed;
}
