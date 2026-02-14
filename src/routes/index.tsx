import ConfigurationPage from "../features/display/pages/Configuration";
import DisplayPage from "../features/display/pages/Display";

export const routes = [
  {
    path: "config",
    element: <ConfigurationPage />,
  },
  {
    path: "display",
    element: <DisplayPage />,
  },
];
