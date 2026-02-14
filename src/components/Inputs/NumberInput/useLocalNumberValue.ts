import { useEffect, useState } from "react";

function checkIfValueIsANumber(value: any) {
  return typeof value === "number";
}
function getStringFromValue(value: any) {
  if (typeof value === "number") {
    return value.toString();
  } else return "";
}

function useLocalNumberValue(
  value: any,
  isFieldFocused: boolean,
  maskFormatter: (value: string) => string
) {
  const [maskedValue, setMaskedValue] = useState<string>(
    getStringFromValue(value)
  );

  useEffect(() => {
    if (value === null || value === undefined) {
      setMaskedValue("");
    }
    if (checkIfValueIsANumber(value) && isFieldFocused === false) {
      setMaskedValue(maskFormatter(value.toString()));
    }
  }, [value]);

  useEffect(() => {
    if (isFieldFocused) {
      setMaskedValue(getStringFromValue(value));
    } else {
      setMaskedValue((prev) => {
        return maskFormatter(prev);
      });
    }
  }, [isFieldFocused]);

  return {
    maskedValue,
    setMaskedValue,
  };
}

export default useLocalNumberValue;
