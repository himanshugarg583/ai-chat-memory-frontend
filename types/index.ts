export interface User {
  id: string;
  name?: string;
  sessionStartedAt: string;
  createdAt?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  memoryStatus?: string | null;
  createdAt: string;
  usedMemories?: UsedMemory[];
  memoryChanges?: MemoryChange[];
}

export interface Memory {
  id: string;
  memoryKey: string;
  content: string;
  category: string;
  status: 'active' | 'superseded';
  source: 'auto' | 'manual';
  createdAt: string;
  updatedAt?: string;
}

export interface UsedMemory {
  memoryKey: string;
  content: string;
  similarity: number;
}

export interface MemoryChange {
  action: 'created' | 'updated' | 'removed' | 'unchanged' | 'skipped_duplicate' | 'failed';
  memoryKey: string;
  content?: string;
  error?: string;
}

export interface ChatResponse {
  userMessage: {
    id: string;
    content: string;
    memoryStatus: string | null;
    createdAt: string;
  };
  assistantMessage: {
    id: string;
    content: string;
    createdAt: string;
  } | null;
  memoryChanges: MemoryChange[];
  usedMemories: UsedMemory[];
}

export interface ConflictingMemory {
  id: string;
  memoryKey: string;
  content: string;
  similarity: number;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    existing?: ConflictingMemory;
  };
}
