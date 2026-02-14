import { useForm } from "react-hook-form";
import Canvas from "../../../../components/Canvas";
import type { Configuration } from "../../../../models/configuration";
import { useEffect } from "react";
import { queryParamsToConfiguration } from "../../../../utils/query-params-to-config";
import { PageWrapper } from "../Configuration/styles";

export default function DisplayPage() {
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

  useEffect(() => {
    const search = window.location.search;
    if (!search) return;

    const defaults = configurationForm.getValues(); // current defaults
    const cfgFromUrl = queryParamsToConfiguration(search, defaults);

    configurationForm.reset(cfgFromUrl);
  }, [configurationForm]);

  const configuration = configurationForm.watch();

  return (
    <PageWrapper>
      <Canvas configuration={configuration} isPlaying={true} />
    </PageWrapper>
  );
}
