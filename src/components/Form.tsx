import { Fragment, useRef } from "react";
import { FormData, FormLayout, InputDataType, InputType } from "types/form";
import { FormControlState, FormDataReducerAction } from "hooks/useFormControl";

interface FormProps {
  formLayout: FormLayout;
  formControl: FormControlState;
  disableButton?: boolean;
  onSubmit: (date: FormData) => void;
  onChangeField: (key: string) => void;
}

export default function Form({
  formLayout,
  formControl: { formData, formErrors },
  formDispatch,
  idString,
  disableButton,
  disableUpdateInfo,
}: FormProps) {
  const firstInputRef = useRef(null);
  return (
    <>
      <Grid templateColumns="repeat(10, 1fr)" gap={"15px 15px"} as="form">
        {formData?.dtlastupdt && !disableUpdateInfo ? (
          <GridItem colSpan={10}>
            <UpdateInfo
              ccreatedby={formData.ccreatedby as string}
              dtadded={formData.dtadded as string}
              cupdatedby={formData.username as string}
              dtlastupdt={formData.dtlastupdt as string}
            />
          </GridItem>
        ) : null}

        {Object.entries(formLayout).map(([key, _], index) => {
          const SetValue = (value: InputDataType) => {
            formDispatch({ type: "changeField", key, value });
          };
          let display = <p key={`key_${key}`}>INVALID</p>;

          // Check if we should hide input based on other input values
          let isVisible = true;
          for (const [k, v] of Object.entries(
            formLayout[key].hideConditions || {}
          )) {
            if (v.includes(formData[k])) {
              isVisible = false;
              break;
            }
          }

          const keyName = formLayout[key].displayValue || key;
          switch (formLayout[key].inputType || InputType.STRING) {
            case InputType.STRING:
              display = (
                <StyledTextInput
                  value={(formData[key] || "") as string}
                  setValue={SetValue}
                  label={keyName}
                  maxChars={formLayout[key].maxChars}
                  disabled={key === idString}
                  errorMessage={formErrors[key]}
                  required={formLayout[key].required}
                  ref={index === 0 ? firstInputRef : undefined}
                />
              );
              break;
            case InputType.TEXTAREA:
              display = (
                <StyledTextArea
                  value={(formData[key] || "") as string}
                  setValue={SetValue}
                  label={keyName}
                  maxChars={formLayout[key].maxChars}
                  disabled={key === idString}
                  errorMessage={formErrors[key]}
                  required={formLayout[key].required}
                  ref={index === 0 ? firstInputRef : undefined}
                />
              );
              break;
            case InputType.NUMBER:
              display = (
                <StyledNumberInput
                  value={(formData[key] || "") as number}
                  defaultValue={formData[key] as number}
                  setValue={SetValue}
                  label={keyName}
                  precision={formLayout[key].precision}
                  maxChars={formLayout[key].maxChars}
                  disabled={key === idString}
                  errorMessage={formErrors[key]}
                  required={formLayout[key].required}
                  ref={index === 0 ? firstInputRef : undefined}
                />
              );
              break;
            case InputType.DROPDOWN:
              display = (
                <StyledDropdown
                  options={formLayout[key].options}
                  displays={formLayout[key].displays}
                  value={(formData[key] || "") as string}
                  setValue={SetValue}
                  label={keyName}
                  disabled={key === idString}
                  errorMessage={formErrors[key]}
                  required={formLayout[key].required}
                  ref={index === 0 ? firstInputRef : undefined}
                />
              );
              break;
            case InputType.LISTDROPDOWN:
              const { pathName, idKey, nameKey, nonNpk } =
                formLayout[key].listOptions;
              display = (
                <ListDropdown
                  pathName={pathName}
                  idKey={idKey}
                  nameKey={nameKey}
                  value={(formData[key] || "") as string}
                  setValue={SetValue}
                  label={keyName}
                  disabled={key === idString}
                  errorMessage={formErrors[key]}
                  required={formLayout[key].required}
                  nonNpk={nonNpk}
                  ref={index === 0 ? firstInputRef : undefined}
                />
              );
              break;
            case InputType.DATE:
              display = (
                <StyledDateInput
                  id={`DATE_${key}`}
                  value={(formData[key] || "") as string}
                  setValue={SetValue}
                  label={keyName}
                  errorMessage={formErrors[key]}
                  required={formLayout[key].required}
                  ref={index === 0 ? firstInputRef : undefined}
                />
              );
              break;
            case InputType.BOOLEAN:
              display = (
                <StyledCheckBox
                  value={(formData[key] || false) as boolean}
                  setValue={SetValue}
                  label={keyName}
                />
              );
              break;
            case InputType.RADIO:
              display = (
                <StyledRadioButtons
                  name={keyName}
                  options={formLayout[key].options}
                  displays={formLayout[key].displays}
                  onChange={SetValue}
                />
              );
              break;
            default:
              break;
          }

          const length = formLayout[key].length || 10;
          const fillPercent = formLayout[key].fillLine ? length * 10 : 100;
          return (
            <Fragment key={`form_input_${key}`}>
              {formLayout[key].paddingLeft ? (
                <GridItem colSpan={formLayout[key].paddingLeft}>
                  {/* <Box background="red" height="40px"></Box> */}
                </GridItem>
              ) : null}
              <GridItem
                colSpan={
                  formLayout[key].fillLine
                    ? 10 - (formLayout[key].paddingLeft || 0)
                    : length
                }
                display={isVisible ? undefined : "none"}
              >
                <Box width={`${fillPercent}%`}> {display}</Box>
              </GridItem>
              {formLayout[key].paddingRight ? (
                <GridItem colSpan={formLayout[key].paddingRight} />
              ) : null}
            </Fragment>
          );
        })}
      </Grid>
      <Flex gap={5} marginTop={5}>
        {!disableButton && (
          <Button
            colorScheme="messenger"
            onClick={() => formDispatch({ type: "savePress" })}
            disabled={action !== FormAction.NONE}
          >
            {action !== FormAction.NONE ? <Spinner /> : "Submit"}
          </Button>
        )}
      </Flex>
    </>
  );
}
