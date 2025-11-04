import { ActionOption } from './ActionButtonWithDropdown';
import { ReactNode } from 'react';

export interface CardProps {
  id: string | number;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  rating?: number;
  footer?: string | ReactNode;
  onClick?: () => void;
  actionButton?: {
    label: string;
    onClick: (e: React.MouseEvent) => void;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
  };
  actionButtonWithOptions?: {
    options: ActionOption[];
    defaultOption?: number;
    disabled?: boolean;
    mainLabel?: string;
    mainVariant?: 'primary' | 'secondary' | 'danger';
  };
}