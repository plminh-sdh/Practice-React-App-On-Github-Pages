import { createHashRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { routes } from "./routes";

function App() {
  const router = createHashRouter(routes);
  return <RouterProvider router={router} />;
}

export default App;
