export interface CropRecommendation {
  name: string;
  yield: string;
  cost: string;
  profit: string;
  risk: string;
  reason: string;
}

export interface DiseaseDiagnosis {
  disease: string;
  confidence: string;
  severity: string;
  treatment: {
    organic: string;
    chemical: string;
  };
  prevention: string;
}

export interface MarketInsight {
  currentPrice: string;
  trend: string;
  forecast: {
    week: string;
    price: number;
  }[];
  recommendation: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  location: string;
  language: string;
  farmSize: string;
  crops: string[];
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  imageUrl?: string;
  timestamp: any;
  likes: number;
  comments: number;
}
