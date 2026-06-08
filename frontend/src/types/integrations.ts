export interface WordPressConfig {
  url: string;
  username: string;
  apiKey: string;
}

export interface WordPressPage {
  id: number;
  title: string;
  content: string;
  status: 'draft' | 'publish' | 'pending' | 'private';
  slug: string;
  date: string;
  author: number;
  excerpt: string;
  featured_media: number;
}

export interface WordPressPost extends WordPressPage {
  categories: number[];
  tags: number[];
}

export interface ClientWordPressIntegration {
  isConnected: boolean;
  config?: WordPressConfig;
  lastSync?: string;
  lastError?: string;
}

export interface ClientSocialIntegration {
  isConnected: boolean;
  accessToken?: string;
  accountId?: string;
  accountName?: string;
  lastSync?: string;
  lastError?: string;
}

export interface ClientIntegrations {
  clientId: string;
  clientName: string;
  wordpress: ClientWordPressIntegration;
  linkedin?: ClientSocialIntegration;
  instagram?: ClientSocialIntegration;
  tiktok?: ClientSocialIntegration;
  facebook?: ClientSocialIntegration;
  x?: ClientSocialIntegration;
  googlemybusiness?: ClientSocialIntegration;
}

export interface IntegrationConfig {
  wordpress?: WordPressConfig;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'connected' | 'disconnected';
  config?: IntegrationConfig;
  lastSync?: string;
}
