import type { User, Message, Memory, ChatResponse, ApiError, ConflictingMemory } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export class MemoryConflictError extends Error {
  code = 'MEMORY_CONFLICT';
  existing: ConflictingMemory;

  constructor(message: string, existing: ConflictingMemory) {
    super(message);
    this.name = 'MemoryConflictError';
    this.existing = existing;
  }
}

class ApiClient {
  private userId: string | null = null;

  setUserId(userId: string | null) {
    this.userId = userId;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: unknown
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.userId) {
      headers['x-user-id'] = this.userId;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    // Handle 204 No Content
    if (res.status === 204) {
      return {} as T;
    }

    const json = await res.json();

    if (!res.ok) {
      const error = json as ApiError;
      // Handle 409 MEMORY_CONFLICT specially
      if (res.status === 409 && error.error?.code === 'MEMORY_CONFLICT' && error.error?.existing) {
        throw new MemoryConflictError(
          error.error.message || 'Memory conflict detected',
          error.error.existing
        );
      }
      throw new Error(error.error?.message || 'Request failed');
    }

    // Backend returns { data: ... }, unwrap it
    return json.data ?? json;
  }

  // Auth
  async startSession(name?: string): Promise<{ user: User }> {
    const result = await this.request<{ user: User }>('POST', '/users/start-session', {
      name: name || undefined,
    });
    this.userId = result.user.id;
    return result;
  }

  async newSession(): Promise<{ user: User }> {
    const result = await this.request<{ user: User }>('POST', '/users/me/new-session');
    this.userId = result.user.id;
    return result;
  }

  // Messages
  async getMessages(): Promise<{ messages: Message[] }> {
    return this.request<{ messages: Message[] }>('GET', '/messages');
  }

  async sendMessage(message: string): Promise<ChatResponse> {
    return this.request<ChatResponse>('POST', '/chat', { message });
  }

  // Memories
  async getMemories(status: 'active' | 'all' = 'active'): Promise<{ memories: Memory[] }> {
    return this.request<{ memories: Memory[] }>('GET', `/memories?status=${status}`);
  }

  async createMemory(
    content: string,
    category: string,
    memoryKey?: string,
    replaceMemoryId?: string
  ): Promise<{ memory: Memory }> {
    return this.request<{ memory: Memory }>('POST', '/memories', {
      content,
      category,
      memoryKey,
      replaceMemoryId,
    });
  }

  async updateMemory(
    id: string,
    updates: { content?: string; category?: string }
  ): Promise<{ memory: Memory }> {
    return this.request<{ memory: Memory }>('PUT', `/memories/${id}`, updates);
  }

  async deleteMemory(id: string): Promise<void> {
    await this.request<void>('DELETE', `/memories/${id}`);
  }
}

export const api = new ApiClient();
