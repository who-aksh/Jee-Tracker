// Mock data for JEE Tracker Application

export const mockSyllabusData = {
  mains: {
    physics: [
      { id: 'phy1', topic: 'Mechanics', subtopics: ['Kinematics', 'Dynamics', 'Rotational Motion'], status: 'mastered', highYield: true },
      { id: 'phy2', topic: 'Thermodynamics', subtopics: ['Laws of Thermodynamics', 'Heat Engines', 'Kinetic Theory'], status: 'weak', highYield: true },
      { id: 'phy3', topic: 'Waves & Oscillations', subtopics: ['SHM', 'Wave Motion', 'Sound Waves'], status: 'revise-soon', highYield: false },
      { id: 'phy4', topic: 'Electromagnetism', subtopics: ['Electrostatics', 'Current Electricity', 'Magnetic Effects'], status: 'in-progress', highYield: true },
      { id: 'phy5', topic: 'Optics', subtopics: ['Ray Optics', 'Wave Optics', 'Optical Instruments'], status: 'not-started', highYield: false },
    ],
    chemistry: [
      { id: 'chem1', topic: 'Organic Chemistry', subtopics: ['Hydrocarbons', 'Functional Groups', 'Biomolecules'], status: 'mastered', highYield: true },
      { id: 'chem2', topic: 'Inorganic Chemistry', subtopics: ['Periodic Table', 'Chemical Bonding', 'Coordination Compounds'], status: 'in-progress', highYield: true },
      { id: 'chem3', topic: 'Physical Chemistry', subtopics: ['Chemical Kinetics', 'Electrochemistry', 'Solutions'], status: 'weak', highYield: true },
      { id: 'chem4', topic: 'Environmental Chemistry', subtopics: ['Pollution', 'Green Chemistry'], status: 'not-started', highYield: false },
    ],
    mathematics: [
      { id: 'math1', topic: 'Calculus', subtopics: ['Limits', 'Derivatives', 'Integrals', 'Differential Equations'], status: 'mastered', highYield: true },
      { id: 'math2', topic: 'Coordinate Geometry', subtopics: ['Straight Lines', 'Circles', 'Parabola', 'Hyperbola'], status: 'in-progress', highYield: true },
      { id: 'math3', topic: 'Algebra', subtopics: ['Quadratic Equations', 'Sequences & Series', 'Permutations'], status: 'revise-soon', highYield: true },
      { id: 'math4', topic: 'Trigonometry', subtopics: ['Ratios', 'Identities', 'Inverse Functions'], status: 'weak', highYield: false },
      { id: 'math5', topic: 'Vector & 3D Geometry', subtopics: ['Vectors', 'Planes', 'Lines in 3D'], status: 'not-started', highYield: false },
    ]
  },
  advanced: {
    physics: [
      { id: 'adv-phy1', topic: 'Modern Physics', subtopics: ['Quantum Mechanics', 'Nuclear Physics', 'Semiconductor'], status: 'in-progress', highYield: true },
      { id: 'adv-phy2', topic: 'Advanced Mechanics', subtopics: ['Rigid Body Dynamics', 'Fluid Mechanics'], status: 'not-started', highYield: true },
    ],
    chemistry: [
      { id: 'adv-chem1', topic: 'Advanced Organic', subtopics: ['Reaction Mechanisms', 'Stereochemistry'], status: 'weak', highYield: true },
      { id: 'adv-chem2', topic: 'Advanced Inorganic', subtopics: ['Transition Elements', 'Organometallics'], status: 'not-started', highYield: false },
    ],
    mathematics: [
      { id: 'adv-math1', topic: 'Advanced Calculus', subtopics: ['Multiple Integrals', 'Vector Calculus'], status: 'in-progress', highYield: true },
      { id: 'adv-math2', topic: 'Complex Numbers', subtopics: ['De Moivre\'s Theorem', 'Applications'], status: 'revise-soon', highYield: false },
    ]
  }
};

export const mockTestData = [
  {
    id: 'test1',
    type: 'mains',
    date: '2024-12-15',
    score: 245,
    totalMarks: 300,
    accuracy: 81.7,
    timeSpent: 180,
    subjects: {
      physics: { score: 85, total: 100, accuracy: 85 },
      chemistry: { score: 78, total: 100, accuracy: 78 },
      mathematics: { score: 82, total: 100, accuracy: 82 }
    },
    weakTopics: ['Thermodynamics', 'Physical Chemistry', 'Trigonometry']
  },
  {
    id: 'test2',
    type: 'advanced',
    date: '2024-12-10',
    score: 198,
    totalMarks: 372,
    accuracy: 53.2,
    timeSpent: 180,
    subjects: {
      physics: { score: 72, total: 124, accuracy: 58 },
      chemistry: { score: 65, total: 124, accuracy: 52 },
      mathematics: { score: 61, total: 124, accuracy: 49 }
    },
    weakTopics: ['Modern Physics', 'Advanced Organic', 'Complex Numbers']
  }
];

export const mockTimetableData = [
  { id: 'tt1', day: 'Monday', time: '6:00-8:00', subject: 'Physics', topic: 'Mechanics Revision', completed: true },
  { id: 'tt2', day: 'Monday', time: '9:00-11:00', subject: 'Mathematics', topic: 'Calculus Practice', completed: true },
  { id: 'tt3', day: 'Monday', time: '15:00-17:00', subject: 'Chemistry', topic: 'Organic Chemistry', completed: false },
  { id: 'tt4', day: 'Tuesday', time: '6:00-8:00', subject: 'Mathematics', topic: 'Coordinate Geometry', completed: false },
  { id: 'tt5', day: 'Tuesday', time: '9:00-11:00', subject: 'Physics', topic: 'Thermodynamics', completed: false },
  { id: 'tt6', day: 'Tuesday', time: '15:00-17:00', subject: 'Chemistry', topic: 'Physical Chemistry', completed: false },
];

export const mockFlashcards = [
  {
    id: 'fc1',
    subject: 'Physics',
    topic: 'Mechanics',
    question: 'What is Newton\'s Second Law of Motion?',
    answer: 'F = ma (Force equals mass times acceleration)',
    difficulty: 'medium',
    lastReviewed: '2024-12-14',
    nextReview: '2024-12-17'
  },
  {
    id: 'fc2',
    subject: 'Chemistry',
    topic: 'Organic Chemistry',
    question: 'What is the IUPAC name of CH₃CH₂OH?',
    answer: 'Ethanol',
    difficulty: 'easy',
    lastReviewed: '2024-12-13',
    nextReview: '2024-12-16'
  },
  {
    id: 'fc3',
    subject: 'Mathematics',
    topic: 'Calculus',
    question: 'What is the derivative of sin(x)?',
    answer: 'cos(x)',
    difficulty: 'easy',
    lastReviewed: '2024-12-15',
    nextReview: '2024-12-18'
  }
];

export const mockUserStats = {
  totalXP: 2450,
  currentStreak: 15,
  longestStreak: 28,
  totalStudyHours: 245,
  completedTopics: 12,
  totalTopics: 35,
  badges: [
    { id: 'badge1', name: 'Early Bird', description: '7 days of 6 AM study', earned: true, earnedDate: '2024-12-10' },
    { id: 'badge2', name: 'Physics Master', description: 'Complete 10 physics topics', earned: true, earnedDate: '2024-12-08' },
    { id: 'badge3', name: 'Streak Master', description: '15 day study streak', earned: true, earnedDate: '2024-12-15' },
    { id: 'badge4', name: 'Mock Test Champion', description: 'Score 80%+ in 5 mock tests', earned: false },
  ]
};

export const mockGoals = [
  {
    id: 'goal1',
    title: 'Complete Physics Syllabus',
    description: 'Finish all physics topics for JEE Mains',
    deadline: '2024-12-31',
    progress: 65,
    priority: 'high',
    category: 'syllabus'
  },
  {
    id: 'goal2',
    title: 'Mock Test Average 250+',
    description: 'Maintain average score above 250 in JEE Mains mocks',
    deadline: '2024-12-30',
    progress: 80,
    priority: 'high',
    category: 'performance'
  },
  {
    id: 'goal3',
    title: 'Daily 6 Hour Study',
    description: 'Maintain 6+ hours daily study routine',
    deadline: '2024-12-25',
    progress: 45,
    priority: 'medium',
    category: 'routine'
  }
];

export const mockQuotes = [
  {
    quote: "Success is the sum of small efforts repeated day in and day out.",
    tip: "Break complex topics into smaller, manageable chunks for better retention."
  },
  {
    quote: "The expert in anything was once a beginner.",
    tip: "Focus on understanding concepts rather than memorizing formulas."
  },
  {
    quote: "Your limitation—it's only your imagination.",
    tip: "Practice previous year questions to understand exam patterns."
  }
];

export const examDates = {
  jeeMainsSession1: '2024-01-24',
  jeeMainsSession2: '2024-04-04',
  jeeAdvanced: '2024-05-26'
};