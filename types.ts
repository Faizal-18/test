
export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  imageUrl: string;
}

export interface Expert {
  id: string;
  name:string;
  specialty: string;
  rate: string;
  imageUrl: string;
}

export enum MessageAuthor {
  USER = 'user',
  AI = 'ai',
}

export interface ChatMessage {
  author: MessageAuthor;
  text: string;
}

export interface GardenPlan {
    theme: string;
    plants: {
        name: string;
        reason: string;
    }[];
    layout_description: string;
}
