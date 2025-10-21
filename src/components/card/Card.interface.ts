export interface CardProps {
  id: string | number;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  rating?: number;
  footer?: string;
  onClick?: () => void;
}