import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import Canvas from "../../../../components/Canvas";
import {
  DropDownInputRHF,
  PositiveIntegerInputRHF,
  TextInputRHF,
  TextListInputRHF,
} from "../../../../components/Inputs/InputsWithRHF";
import LabelledInputWrapper from "../../../../components/Inputs/LabelledInputWrapper";
import type { Configuration } from "../../../../models/configuration";
import { InputWrapper, PageWrapper } from "./styles";
import { FontOptions } from "../../values/font-option";
import { Button, Col, Container, Row } from "react-bootstrap";
import { FontWeightOptions } from "../../values/font-weight-options";
import { configurationToQueryParams } from "../../../../utils/config-to-query-params";
import SuccessModal from "../../../../components/SuccessModal";
import { QRCodeCanvas } from "qrcode.react";

export default function ConfigurationPage() {
  const [showQrModal, setShowQrModal] = useState(false);
  const [exportUrl, setExportUrl] = useState<string>("");
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const configurationForm = useForm<Configuration>({
    mode: "all",
    criteriaMode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      startText: "Nhấn vào trái tim để bắt đầu",
      startTextFontSize: 20,
      text: "❤️",
      messages: ["❤️"],
      font: "Helvetical",
      fontSize: 200,
      fontWeight: 500,
      maxTextWidth: 80,
      pixelSize: 3,
      pixelPadding: 2,
      phase1Duration: 1000,
      phase2Duration: 500,
      phase3Duration: 1500,

      outwardMin: 0,
      outwardMax: 40,
      inwardMin: 0,
      inwardMax: 5,

      sideOutwardMin: 0,
      sideOutwardMax: 2,
      sideInwardMin: 0,
      sideInwardMax: 2,

      transitionDuration: 1000,
      transitionRadius: 50,
    },
  });

  const { control, setValue } = configurationForm;

  const configuration = configurationForm.watch();

  const messages = useWatch({ control, name: "messages" }) ?? [];
  const text = useWatch({ control, name: "text" }) ?? "";

  useEffect(() => {
    if (selectedRowIndex == null) {
      setValue("text", "", { shouldDirty: true, shouldTouch: true });
      return;
    }

    const selected = messages[selectedRowIndex] ?? "";
    if (text !== selected) {
      setValue("text", selected, { shouldDirty: true, shouldTouch: true });
    }
  }, [selectedRowIndex, messages, setValue]);

  const playOnClick = useCallback(() => {
    setIsPlaying(true);

    requestAnimationFrame(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [setIsPlaying]);

  const stopPlayOnClick = useCallback(() => {
    setIsPlaying(false);

    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }, [setIsPlaying]);

  const exportConfig = useCallback(() => {
    const cfg = configurationForm.getValues();
    const qs = configurationToQueryParams(cfg);

    const base = import.meta.env.BASE_URL || "/";
    const url = `${window.location.origin}${base}#/display?${qs}`;
    setExportUrl(url);
    setShowQrModal(true);
  }, [configurationForm]);

  return (
    <PageWrapper>
      <InputWrapper>
        <FormProvider {...configurationForm}>
          <Container className="m-0 w-full max-w-none">
            <Row>
              <LabelledInputWrapper name="startText" label="Start Message">
                <TextInputRHF name="startText" disabled={isPlaying} />
              </LabelledInputWrapper>
            </Row>

            <Row className="mt-3">
              <Col xs={12} md={5} lg={2}>
                <LabelledInputWrapper
                  name="startTextFontSize"
                  label="Start Text Font Size"
                >
                  <PositiveIntegerInputRHF
                    name="startTextFontSize"
                    max={200}
                    disabled={isPlaying}
                  />
                </LabelledInputWrapper>
              </Col>
            </Row>

            <Row className="mt-3">
              <LabelledInputWrapper name="text" label="Messages">
                <TextListInputRHF
                  name="messages"
                  placeholder="Enter your message here"
                  selectedRowIndex={selectedRowIndex}
                  setSelectedRowIndex={setSelectedRowIndex}
                  disabled={isPlaying}
                />
              </LabelledInputWrapper>
            </Row>

            <Row>
              <Col xs={4} sm={6} md={5} lg={4}>
                <LabelledInputWrapper name="font" label="Font">
                  <DropDownInputRHF
                    name="font"
                    options={FontOptions}
                    withSearch
                    disabled={isPlaying}
                  />
                </LabelledInputWrapper>
              </Col>

              <Col xs={4} sm={3} md={2} lg={2} xxl={1} className="ps-sm-5">
                <LabelledInputWrapper name="fontSize" label="Font Size">
                  <PositiveIntegerInputRHF
                    name="fontSize"
                    max={200}
                    disabled={isPlaying}
                  />
                </LabelledInputWrapper>
              </Col>

              <Col xs={4} sm={3} md={3} lg={2} xxl={2} className="ps-sm-5">
                <LabelledInputWrapper name="fontWeight" label="Font Weight">
                  <DropDownInputRHF
                    name="fontWeight"
                    options={FontWeightOptions}
                    disabled={isPlaying}
                  />
                </LabelledInputWrapper>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col xs={12} sm={9} md={3} lg={2}>
                <LabelledInputWrapper name="pixelSize" label="Pixel Size">
                  <PositiveIntegerInputRHF
                    name="pixelSize"
                    min={2}
                    disabled={isPlaying}
                  />
                </LabelledInputWrapper>
              </Col>

              <Col
                xs={12}
                sm={9}
                md={3}
                lg={2}
                className="mt-3 mt-md-0 ps-md-5"
              >
                <LabelledInputWrapper name="pixelPadding" label="Pixel Padding">
                  <PositiveIntegerInputRHF
                    name="pixelPadding"
                    min={1}
                    disabled={isPlaying}
                  />
                </LabelledInputWrapper>
              </Col>

              <Col
                xs={12}
                sm={9}
                md={5}
                lg={4}
                xl={3}
                className="mt-3 mt-md-0 ps-md-5"
              >
                <LabelledInputWrapper
                  name="maxTextWidth"
                  label="Max Text Width (% of screen)"
                >
                  <PositiveIntegerInputRHF
                    name="maxTextWidth"
                    max={100}
                    disabled={isPlaying}
                  />
                </LabelledInputWrapper>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col>
                <LabelledInputWrapper
                  name="transitionDuration"
                  label="Transition Duration"
                >
                  <PositiveIntegerInputRHF
                    name="transitionDuration"
                    disabled={isPlaying}
                  />
                </LabelledInputWrapper>
              </Col>

              <Col className="ps-5">
                <LabelledInputWrapper
                  name="transitionRadius"
                  label="Transition Radius"
                >
                  <PositiveIntegerInputRHF
                    name="transitionRadius"
                    disabled={isPlaying}
                  />
                </LabelledInputWrapper>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col>
                <LabelledInputWrapper
                  name="phase1Duration"
                  label="Phase 1 Length (ms)"
                >
                  <PositiveIntegerInputRHF
                    name="phase1Duration"
                    disabled={isPlaying}
                  />
                </LabelledInputWrapper>
              </Col>

              <Col className="ps-5">
                <LabelledInputWrapper
                  name="phase2Duration"
                  label="Phase 2 Length (ms)"
                >
                  <PositiveIntegerInputRHF
                    name="phase2Duration"
                    disabled={isPlaying}
                  />
                </LabelledInputWrapper>
              </Col>

              <Col className="ps-5">
                <LabelledInputWrapper
                  name="phase3Duration"
                  label="Phase 3 Length (ms)"
                >
                  <PositiveIntegerInputRHF
                    name="phase3Duration"
                    disabled={isPlaying}
                  />
                </LabelledInputWrapper>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col>
                <LabelledInputWrapper name="outwardMin" label="Outward Min">
                  <PositiveIntegerInputRHF
                    name="outwardMin"
                    disabled={isPlaying}
                  />
                </LabelledInputWrapper>
              </Col>

              <Col className="ps-5">
                <LabelledInputWrapper name="outwardMax" label="Outward Max">
                  <PositiveIntegerInputRHF
                    name="outwardMax"
                    disabled={isPlaying}
                  />
                </LabelledInputWrapper>
              </Col>

              <Col className="ps-5">
                <LabelledInputWrapper name="inwardMin" label="Inward Min">
                  <PositiveIntegerInputRHF
                    name="inwardMin"
                    disabled={isPlaying}
                  />
                </LabelledInputWrapper>
              </Col>

              <Col className="ps-5">
                <LabelledInputWrapper name="inwardMax" label="Inward Max">
                  <PositiveIntegerInputRHF
                    name="inwardMax"
                    disabled={isPlaying}
                  />
                </LabelledInputWrapper>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col>
                <LabelledInputWrapper
                  name="sideOutwardMin"
                  label="Side Outward Min"
                >
                  <PositiveIntegerInputRHF
                    name="sideOutwardMin"
                    disabled={isPlaying}
                  />
                </LabelledInputWrapper>
              </Col>

              <Col className="ps-5">
                <LabelledInputWrapper
                  name="sideOutwardMax"
                  label="Side Outward Max"
                >
                  <PositiveIntegerInputRHF
                    name="sideOutwardMax"
                    disabled={isPlaying}
                  />
                </LabelledInputWrapper>
              </Col>

              <Col className="ps-5">
                <LabelledInputWrapper
                  name="sideInwardMin"
                  label="Side Inward Min"
                >
                  <PositiveIntegerInputRHF
                    name="sideInwardMin"
                    disabled={isPlaying}
                  />
                </LabelledInputWrapper>
              </Col>

              <Col className="ps-5">
                <LabelledInputWrapper
                  name="sideInwardMax"
                  label="Side Inward Max"
                >
                  <PositiveIntegerInputRHF
                    name="sideInwardMax"
                    disabled={isPlaying}
                  />
                </LabelledInputWrapper>
              </Col>
            </Row>
            <Row className="mt-3 justify-content-center">
              <Button
                className="w-25 my-0"
                onClick={playOnClick}
                disabled={isPlaying}
              >
                Play
              </Button>

              <Button
                className="w-25 my-0 ms-3"
                onClick={stopPlayOnClick}
                disabled={!isPlaying}
              >
                Stop Play
              </Button>

              <Button className="w-25 my-0 ms-3" onClick={exportConfig}>
                Export Configs
              </Button>
            </Row>
          </Container>
        </FormProvider>
      </InputWrapper>

      <Canvas configuration={configuration} isPlaying={isPlaying} />
      <SuccessModal
        title="Title"
        showModal={showQrModal}
        handleCloseModal={() => setShowQrModal(false)}
      >
        <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
          <QRCodeCanvas value={exportUrl} size={220} />
          <div
            style={{
              wordBreak: "break-all",
              textAlign: "center",
              maxWidth: 360,
            }}
          >
            {exportUrl}
          </div>

          <Button
            variant="secondary"
            onClick={() => navigator.clipboard?.writeText(exportUrl)}
            disabled={!exportUrl}
          >
            Copy link
          </Button>
        </div>
      </SuccessModal>
    </PageWrapper>
  );
}
