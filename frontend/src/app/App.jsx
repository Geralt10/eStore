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
            background: "#ffffff",
            color: "#0f172a",
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.08)",
            fontSize: "13px",
            borderRadius: "10px",
          },
          success: {
            iconTheme: {
              primary: "#0f172a",
              secondary: "#ffffff",
            },
          },
        }}
      />
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
