import { Col, Row } from "react-bootstrap";
import { Label, LabelDescription, LabelDescriptionList } from "./styles";
import { useFormContext } from "react-hook-form";
import InputErrorMessage from "../InputErrorMessage";

interface Props {
  name: string;
  label: string;
  labelDescriptions?: string[];
  children: React.ReactNode;
  hasAsterisk?: boolean;
}

function LabelledInputWrapper({
  name,
  label,
  labelDescriptions,
  children,
  hasAsterisk,
}: Readonly<Props>) {
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <Col>
      <Row>
        <Label className="p-0 mb-1">
          {label}
          {hasAsterisk && (
            <span className="ms-1 p-0 text-danger fw-bold">*</span>
          )}
        </Label>
      </Row>
      {labelDescriptions && labelDescriptions.length > 0 && (
        <Row className="mb-2">
          <LabelDescriptionList>
            {labelDescriptions.map((description) => (
              <LabelDescription key={description}>
                {description}
              </LabelDescription>
            ))}
          </LabelDescriptionList>
        </Row>
      )}
      <Row>{children}</Row>
      <Row>
        <InputErrorMessage errors={errors} name={name} />
      </Row>
    </Col>
  );
}

export default LabelledInputWrapper;
