const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Poll {
  id: number;
  title: string;
  description?: string;
  status: 'active' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface Option {
  id: number;
  text: string;
  poll_id: number;
  created_at: string;
  vote_count?: number;
}

export interface Vote {
  id: number;
  poll_id: number;
  option_id: number;
  user_id: string;
  created_at: string;
}

export interface Like {
  id: number;
  poll_id: number;
  user_id: string;
  created_at: string;
}

export interface PollWithDetails extends Poll {
  options: Option[];
  votes: Vote[];
  likes: Like[];
  total_votes: number;
  total_likes: number;
}

export interface CreatePollData {
  title: string;
  description?: string;
}

export interface CreateOptionData {
  text: string;
  poll_id: number;
}

export interface VoteData {
  poll_id: number;
  option_id: number;
  user_id: string;
}

export interface LikeData {
  poll_id: number;
  user_id: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Poll endpoints
  async createPoll(data: CreatePollData): Promise<Poll> {
    return this.request<Poll>('/polls/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPolls(): Promise<Poll[]> {
    return this.request<Poll[]>('/polls/');
  }

  async getPoll(id: number): Promise<PollWithDetails> {
    return this.request<PollWithDetails>(`/polls/${id}`);
  }

  // Option endpoints
  async addOption(data: CreateOptionData): Promise<Option> {
    return this.request<Option>(`/polls/${data.poll_id}/options/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Vote endpoints
  async vote(data: VoteData): Promise<Vote> {
    return this.request<Vote>(`/polls/${data.poll_id}/vote/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Like endpoints
  async likePoll(data: LikeData): Promise<Like> {
    return this.request<Like>(`/polls/${data.poll_id}/like/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Poll management endpoints
  async closePoll(pollId: number): Promise<Poll> {
    return this.request<Poll>(`/polls/${pollId}/close/`, {
      method: 'POST',
    });
  }

  async reopenPoll(pollId: number): Promise<Poll> {
    return this.request<Poll>(`/polls/${pollId}/reopen/`, {
      method: 'POST',
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
