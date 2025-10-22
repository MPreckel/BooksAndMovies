export type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onDebouncedChange?: (value: string) => void;
  delay?: number;
  placeholder?: string;
  className?: string;
  name?: string;
  autoFocus?: boolean;
  ariaLabel?: string;
};