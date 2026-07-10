export interface StreamLink {
  id: string;
  url: string;
  quality?: string;
  language?: string;
  type?: string;
  raw?: Record<string, unknown>;
}
