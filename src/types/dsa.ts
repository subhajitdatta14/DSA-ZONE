export type NavPage = 'home' | 'visualizer' | 'learn' | 'practice';

export type CategoryId = 'data-structures' | 'trees' | 'graphs' | 'algorithms';

export interface Topic {
  id: string;
  name: string;
  category: CategoryId;
  categoryName: string;
  description: string;
  isImplemented: boolean;
  phase: number;
  tags: string[];
  timeComplexity: {
    access?: string;
    search?: string;
    insertion?: string;
    deletion?: string;
    best?: string;
    average?: string;
    worst?: string;
  };
  spaceComplexity: string;
}

export type OperationType = 'insert' | 'delete' | 'search' | 'update' | 'access';

export interface ArrayVisualizerStep {
  stepIndex: number;
  totalSteps: number;
  array: number[];
  highlightIndices: number[];
  comparingIndex?: number;
  targetIndex?: number;
  shiftedIndex?: number;
  insertedIndex?: number;
  deletedIndex?: number;
  message: string;
  operation: OperationType;
  timeComplexity: string;
  spaceComplexity: string;
  isFinished?: boolean;
  status: 'info' | 'active' | 'success' | 'warning';
}

export type QuestionCategory = 'MCQ' | 'Complexity' | 'Output Prediction' | 'Visual Challenge' | 'Coding Challenge';
export type QuestionDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Question {
  id: string;
  topicId: string;
  topicName: string;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  question: string;
  codeSnippet?: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  explanation: string;
}

export interface UserProgress {
  completedTopics: string[];
  practicedQuestions: {
    questionId: string;
    selectedOption: string;
    isCorrect: boolean;
    timestamp: number;
  }[];
  operationsRunCount: number;
  visitedVisualizers: string[];
}
