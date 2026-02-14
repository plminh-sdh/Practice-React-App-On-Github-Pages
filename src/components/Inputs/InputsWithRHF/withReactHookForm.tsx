import React, { useCallback } from "react";
import { useController, useFormContext } from "react-hook-form";

export type RHFInputProps<T> = {
  name: string;
  rules?: any;
  onValueChange?: (value: any) => void;
  onBlurInput?: (e: any) => void;
} & Omit<T, "externalValue" | "setExternalValue">;

function withReactHookForm<T>(
  WrappedComponent: React.FC<Omit<T, "ref">>,
  omitName = true,
) {
  const InputComponentWithReactHookForm = React.forwardRef<
    Element,
    RHFInputProps<T> & { ref: any }
  >(({ name, rules, onValueChange, onBlurInput, ...passedProps }, ref) => {
    const { control } = useFormContext();
    const {
      field: {
        onChange: onControllerChange,
        onBlur: onControllerBlur,
        value,
        ...restOfField
      },
      fieldState: { error },
    } = useController({
      control,
      name,
      rules: rules,
      defaultValue: null,
    });

    const onBlur = useCallback(
      (e: any) => {
        if (onBlurInput) {
          onBlurInput(e);
        } else {
          onControllerBlur();
        }
      },
      [onBlurInput, onControllerBlur],
    );

    return (
      <WrappedComponent
        externalValue={value}
        setExternalValue={(value: any) => {
          onControllerChange(value);
          if (onValueChange) {
            onValueChange(value);
          }
        }}
        onBlur={onBlur}
        onToggle={(show: boolean) => {
          !show && onBlur(undefined);
        }}
        isInvalid={!!error}
        {...restOfField}
        {...(omitName ? {} : { name })}
        {...(passedProps as unknown as T)}
        ref={ref}
      />
    );
  });
  return InputComponentWithReactHookForm;
}

export default withReactHookForm;
