import { WordPressConfig, WordPressPost } from '../types/integrations';

export class WordPressService {
  private baseUrl: string;
  private credentials: string; // base64 encoded username:password

  constructor(config: WordPressConfig) {
    this.baseUrl = config.url.replace(/\/$/, ''); // Remove trailing slash
    this.credentials = btoa(`${config.username}:${config.apiKey}`);
  }

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/wp-json/wp/v2${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Basic ${this.credentials}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `WordPress API error: ${response.statusText}`
      );
    }

    return response.json();
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.fetch('/posts?per_page=1');
      return true;
    } catch (error) {
      console.error('WordPress connection test failed:', error);
      return false;
    }
  }

  async publishPost(post: Partial<WordPressPost>): Promise<WordPressPost> {
    return this.fetch('/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        status: post.status || 'draft',
        categories: post.categories,
        tags: post.tags,
      }),
    });
  }

  async updatePost(postId: number, post: Partial<WordPressPost>): Promise<WordPressPost> {
    return this.fetch(`/posts/${postId}`, {
      method: 'POST',
      body: JSON.stringify({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        status: post.status,
        categories: post.categories,
        tags: post.tags,
      }),
    });
  }

  async getPosts(
    page: number = 1,
    perPage: number = 10,
    status: 'draft' | 'publish' = 'publish'
  ): Promise<WordPressPost[]> {
    return this.fetch(
      `/posts?page=${page}&per_page=${perPage}&status=${status}&orderby=date&order=desc`
    );
  }

  async getPostById(postId: number): Promise<WordPressPost> {
    return this.fetch(`/posts/${postId}`);
  }

  async deletePost(postId: number): Promise<void> {
    await this.fetch(`/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  async getCategories(): Promise<Array<{ id: number; name: string }>> {
    return this.fetch('/categories?per_page=100');
  }

  async getTags(): Promise<Array<{ id: number; name: string }>> {
    return this.fetch('/tags?per_page=100');
  }

  async createCategory(name: string): Promise<{ id: number; name: string }> {
    return this.fetch('/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async createTag(name: string): Promise<{ id: number; name: string }> {
    return this.fetch('/tags', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }
}
