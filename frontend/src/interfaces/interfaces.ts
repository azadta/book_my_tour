export interface FormField {
  id: string;
  type: string;
  placeholder?: string;
  label?: string;
  options?: { label: string; value: string }[];
  multiple?: boolean;
  disabled?: boolean;
  required:boolean
  readOnly?:boolean
}