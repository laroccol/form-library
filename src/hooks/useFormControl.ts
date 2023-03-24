import { useEffect, useReducer, useState } from "react";
import {
  FormData,
  FormErrors,
  FormLayout,
  InputDataType,
  InputType,
} from "types/form";

/**
 * Set default values if any exist otherwise set to respective empty value (string | number: "", boolean: false)
 * @param formLayout - The layout of the form.
 * @param defaultData - The default data for the form (If the form corresponds to a piece of data that is to be edited).
 * @returns The default data for the form.
 */
const generateDefaultFormData = (
  formLayout: FormLayout,
  defaultData: FormData
): FormData => {
  const formData: FormData = defaultData || {};

  Object.entries(formLayout).map(([key, { inputType, defaultValue }]) => {
    if (formData[key] != null) return; // If the field already has a value then don't overwrite it

    // If the field doesn't spcify a default value then set it to the respective empty value
    if (defaultValue == null) {
      if (inputType === InputType.BOOLEAN) {
        formData[key] = false;
        return;
      } else {
        formData[key] = "";
        return;
      }
    }
    formData[key] = defaultValue;
  });

  return formData;
};

/**
 * Initialize the form state.
 * @param param0 - The form layout and default data.
 * @returns The initial state of the form.
 */
const init = ({ formLayout, defaultData }): FormControlState => {
  const formData = generateDefaultFormData(formLayout, defaultData);
  return {
    formData,
    action: FormAction.NONE,
    formErrors: {},
  };
};

const reset = (
  state: FormControlState,
  formLayout: InputInfo
): FormControlState => {
  const formData = generateDefaultFormData(formLayout, null);

  // Reset date inputs because they are uncontrolled
  Object.keys(formLayout).map((key) => {
    if (formLayout[key].inputType === InputType.DATE) {
      const element = document.getElementById(
        `DATE_${key}`
      ) as HTMLInputElement;
      if (element) {
        element.value = "";
      }
    }
  });

  return { ...state, formData, action: FormAction.NONE, formErrors: {} };
};

const changeField = (
  state: FormControlState,
  key: string,
  value: InputDataType
): FormControlState => {
  return { ...state, formData: { ...state.formData, [key]: value } };
};

const checkData = (data: FormData, formLayout: FormLayout): FormErrors => {
  const errors: FormErrors = {};
  Object.keys(formLayout).map((key) => {
    const input = formLayout[key];
    if ((input.required && data[key] === "") || data[key] === null) {
      errors[key] = "Field is required";
    }
  });
  return errors;
};

const submit = (
  state: FormControlState,
  formLayout: FormLayout,
  onSubmit: (data: FormData) => any | Promise<any>
): FormControlState => {
  const errors = checkData(state.formData, formLayout);

  if (Object.keys(errors).length === 0) {
    onSubmit(state.formData);
  }

  return { ...state, formErrors: errors };
};

interface ResetAction {
  type: "reset";
  formLayout: FormLayout;
}
interface SubmitAction {
  type: "submit";
  formLayout: FormLayout;
  onSubmit: (data: FormData) => any | Promise<any>;
}

interface ChangeFieldAction {
  type: "changeField";
  key: string;
  value: InputDataType;
}

export type FormDataReducerAction =
  | ResetAction
  | SubmitAction
  | ChangeFieldAction;

const reducer = (
  state: FormControlState,
  action: FormDataReducerAction
): FormControlState => {
  switch (action.type) {
    case "reset":
      return reset(state, action.formLayout);
    case "submit":
      return submit(state, action.formLayout, action.onSubmit);
    case "changeField":
      return changeField(state, action.key, action.value);
    default:
      throw new Error();
  }
};

export interface FormControlState {
  formData: FormData;
  formErrors: FormErrors;
}

interface FormControlProps {
  formLayout: FormLayout;
  defaultData?: FormData;
  onSubmit: (data: FormData) => any | Promise<any>;
}

export function useFormControl({
  formLayout,
  onSubmit,
  defaultData,
}: FormControlProps) {
  const [formState, formDispatch] = useReducer(
    reducer,
    { formLayout, defaultData },
    init
  );

  //   const submitMutation = useMutation({
  //     mutationFn: (data: FormData) => {
  //       return onSubmit(data);
  //     },
  //     onSuccess: () => {
  //       toast(successToastConfig("Action Successful"));
  //       queryClient.invalidateQueries({ queryKey: [pathName] });
  //       formDispatch({ type: "done", formLayout });

  //       if (resetOnSuccess) {
  //         formDispatch({ type: "reset", formLayout });
  //       }

  //       if (onSuccess) {
  //         onSuccess();
  //       }
  //     },
  //     onError: (error) => {
  //       console.log(error);
  //       // prettier-ignore
  //       toast(
  //               errorToastConfig(
  //                 // @ts-expect-error TODO: Create TypeScript type for error response
  //                 `Error Submitting Form: ${error?.response?.data?.errorMessage || "Unknown error"}`
  //               )
  //             );
  //       formDispatch({ type: "done", formLayout });
  //     },
  //   });

  const reset = () => {
    formDispatch({ type: "reset", formLayout });
  };

  const submit = () => {
    formDispatch({ type: "submit", formLayout, onSubmit });
  };

  const changeField = (key: string, value: InputDataType) => {
    formDispatch({ type: "changeField", key, value });
  };

  return {
    formState,
    changeField,
    submit,
    reset,
  };
}
