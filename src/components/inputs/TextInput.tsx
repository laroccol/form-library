import React from "react";
import { BaseInputProps } from "types/input";

export default React.forwardRef<HTMLInputElement, BaseInputProps>(
  function StyledTextInput(
    {
      value,
      setValue,
      label,
      helperText,
      errorMessage,
      maxChars,
      required,
      type,
      disabled,
    },
    ref
  ) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (maxChars != null && event.target.value.length > maxChars) return;
      setValue(event.target.value);
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {label && (
          <label>
            <span>{`${label.toUpperCase()}${required ? " * " : ""}`}</span>
          </label>
        )}
        <input
          style={{
            flexGrow: 1,
          }}
          type={type || "email"}
          value={value}
          onChange={handleChange}
          required={required}
          maxLength={maxChars}
          disabled={disabled}
          ref={ref}
        />
        {helperText && <label>{helperText}</label>}
        {errorMessage && <span style={{ color: "red" }}>{errorMessage}</span>}
      </div>
    );
  }
);
