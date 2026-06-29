// Publishing API types

export interface PublishingRequest {
  clientId: string;
  contentId: string;
  title: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  category?: string;
}

export interface LinkedInPublishRequest extends PublishingRequest {
  // LinkedIn-specific fields
}

export interface WordPressPublishRequest extends PublishingRequest {
  // WordPress-specific fields
}

export interface PublishingResponse {
  success: boolean;
  url?: string;
  postId?: string;
  error?: string;
  platform: 'linkedin' | 'wordpress';
  timestamp: string;
}

export interface BatchPublishingRequest {
  contentId: string;
  clientId: string;
  title: string;
  content: string;
  platforms: ('linkedin' | 'wordpress')[];
  excerpt?: string;
  tags?: string[];
  category?: string;
}
