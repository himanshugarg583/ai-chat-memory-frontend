import type { User, Message, Memory, ChatResponse, ApiError } from '@/types';

const API_BASE = '/api';

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

    const data = await res.json();

    if (!res.ok) {
      const error = data as ApiError;
      throw new Error(error.error?.message || 'Request failed');
    }

    return data;
  }

  // Auth
  async login(email: string, name?: string): Promise<{ user: User }> {
    const result = await this.request<{ user: User }>('POST', '/users/login', {
      email,
      name: name || undefined,
    });
    this.userId = result.user.id;
    return result;
  }

  async newSession(): Promise<{ user: User }> {
    return this.request<{ user: User }>('POST', '/users/me/new-session');
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
    memoryKey?: string
  ): Promise<{ memory: Memory }> {
    return this.request<{ memory: Memory }>('POST', '/memories', {
      content,
      category,
      memoryKey,
    });
  }

  async updateMemory(
    id: string,
    updates: { content?: string; category?: string }
  ): Promise<{ memory: Memory }> {
    return this.request<{ memory: Memory }>('PUT', `/memories/${id}`, updates);
  }

  async deleteMemory(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>('DELETE', `/memories/${id}`);
  }
}

export const api = new ApiClient();
