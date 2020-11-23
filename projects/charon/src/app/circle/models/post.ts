export interface Post {
  author: {
    avatar: string;
    name: string;
  };
  content: string;
  pdv: number;
  rating: {
    dislikes: number;
    likes: number;
  }
  time: number;
  title: string;
}
