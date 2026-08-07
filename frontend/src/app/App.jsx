import { RouterProvider } from "react-router";
import { routes } from "./app.routes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#161616",
            color: "#f5f5f5",
            border: "1px solid rgba(234, 179, 8, 0.3)",
            fontSize: "13px",
            borderRadius: "10px",
          },
          success: {
            iconTheme: {
              primary: "#EAB308",
              secondary: "#161616",
            },
          },
        }}
      />
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
