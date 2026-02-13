import React from "react";

export type FormattedInputProps<T> = Omit<
  T,
  "maskFormatter" | "valueFormatter" | "additionalCondition"
>;

function withFormatValidation<T>(
  WrappedComponent: React.FC<Omit<T, "ref">>,
  maskFormatter: (value: string) => string,
  valueFormatter: (value: string) => number,
  additionalCondition: (value: string) => boolean,
) {
  const InputComponentWithFormatValidation = React.forwardRef<
    Element,
    FormattedInputProps<T>
  >((passedProps, ref) => {
    return (
      <WrappedComponent
        {...(passedProps as T)}
        ref={ref}
        maskFormatter={maskFormatter}
        valueFormatter={valueFormatter}
        additionalCondition={additionalCondition}
      />
    );
  });
  return InputComponentWithFormatValidation;
}

export default withFormatValidation;
