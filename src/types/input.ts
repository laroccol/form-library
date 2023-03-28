import { InputDataType } from "./form";

export interface BaseInputProps {
  value: string;
  setValue: (value: InputDataType) => void;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  required?: boolean;
  maxChars?: number;
  type?: string;
  disabled?: boolean;
}
