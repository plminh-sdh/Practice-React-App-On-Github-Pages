import React, { memo, useState } from "react";
import { Input } from "./styles";
import useLocalNumberValue from "./useLocalNumberValue";

export type NumberInputProps = React.HTMLProps<HTMLInputElement> & {
  externalValue: number | null | undefined;
  setExternalValue: (value: number | null | undefined) => void;
  maskFormatter: (value: string) => string;
  valueFormatter: (value: string) => number;
  additionalCondition: (value: string) => boolean;
  isInvalid?: boolean;
  withoutFormatter?: boolean;
};
const NumberInput = memo(
  React.forwardRef(
    (
      {
        externalValue,
        setExternalValue,
        maskFormatter,
        valueFormatter,
        additionalCondition,
        isInvalid = undefined,
        disabled,
        onBlur,
        onFocus,
        name,
        placeholder,
        withoutFormatter,
        className,
      }: NumberInputProps,
      ref,
    ) => {
      const [isFieldFocused, setIsFieldFocused] = useState(false);

      const { maskedValue, setMaskedValue } = useLocalNumberValue(
        externalValue,
        isFieldFocused,
        !withoutFormatter ? maskFormatter : (value) => value,
      );

      return (
        <Input
          className={className}
          name={name}
          ref={ref}
          placeholder={placeholder}
          onChange={(e: any) => {
            const { value } = e.target;

            if (value === "") {
              setMaskedValue("");
              setExternalValue(null);
            }

            if (
              (isNaN(Number(value)) || value.trim() === "") &&
              value !== "."
            ) {
              return;
            }

            if (additionalCondition(value)) {
              setMaskedValue(value);
              setExternalValue(valueFormatter(value));
            }
          }}
          isInvalid={isInvalid}
          value={maskedValue || ""}
          onFocus={(e: any) => {
            if (onFocus) {
              onFocus(e);
            }
            setIsFieldFocused(true);
          }}
          onBlur={(e: any) => {
            if (onBlur) {
              onBlur(e);
            }
            setIsFieldFocused(false);
          }}
          disabled={disabled}
        />
      );
    },
  ),
);

export default NumberInput;
