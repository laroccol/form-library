import { Fragment, useRef } from "react";
import { FormData, FormLayout, InputDataType, InputType } from "types/form";
import { FormControlState } from "hooks/useFormControl";
import TextInput from "./inputs/TextInput";

const styles = {
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(10, 1fr)",
    gap: "0.5rem",
  },
  gridItem: {
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
  },
} as const;

interface FormProps {
  formLayout: FormLayout;
  formState: FormControlState;
  loading?: boolean;
  disableButton?: boolean;
  onSubmit: () => void;
  onChangeField: (key: string, value: InputDataType) => void;
}

export default function Form({
  formLayout,
  formState: { formData, formErrors },
  loading,
  disableButton,
  onSubmit,
  onChangeField,
}: FormProps) {
  const firstInputRef = useRef(null);
  return (
    <form style={styles.gridContainer}>
      {formLayout.map(
        (
          {
            id,
            inputType,
            length,
            defaultValue,
            displayValue,
            fillLine,
            hideConditions,
            maxChars,
            options,
            paddingLeft,
            paddingRight,
            precision,
            required,
          },
          index
        ) => {
          const SetValue = (value: InputDataType) => {
            onChangeField(id, value);
          };

          let display = <p>INVALID</p>;

          // Check if we should hide input based on other input values
          let isVisible = true;
          if (hideConditions) {
            for (const condition of hideConditions) {
              if (condition.values.includes(formData[id])) {
                isVisible = false;
                break;
              }
            }
          }

          const label = displayValue ?? id;
          display = (
            <TextInput
              value={(formData[id] ?? "") as string}
              setValue={SetValue}
              label={label}
              maxChars={maxChars}
              errorMessage={formErrors[id]}
              required={required}
            />
          );

          const fillPercent = fillLine ? length * 10 : 100;
          return (
            <Fragment key={id}>
              {paddingLeft && (
                <div
                  style={{
                    ...styles.gridItem,
                    gridColumn: `span ${paddingLeft}`,
                  }}
                />
              )}
              <div
                style={{
                  ...styles.gridItem,
                  display: isVisible ? undefined : "none",
                  gridColumn: `span ${
                    fillLine ? 10 - (paddingLeft ?? 0) : length
                  }`,
                }}
              >
                <div style={{ width: `${fillPercent}%` }}> {display}</div>
              </div>
              {paddingRight && (
                <div
                  style={{
                    ...styles.gridItem,
                    gridColumn: `span ${paddingRight}`,
                  }}
                />
              )}
            </Fragment>
          );
        }
      )}
      <div style={{ marginTop: "0.5rem" }}>
        {!disableButton && (
          <button type="button" onClick={onSubmit} disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </button>
        )}
      </div>
    </form>
  );
}
