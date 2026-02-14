import { createBrowserRouter, RouterProvider } from "react-router";
import "./App.css";
import ConfigurationPage from "./features/display/pages/Configuration";
import DisplayPage from "./features/display/pages/Display";
import { routes } from "./routes";

function App() {
  const browserRouter = createBrowserRouter(routes);
  return <RouterProvider router={browserRouter} />;
}

export default App;
