import { RouterProvider } from "react-router";
import { router } from "./routes";
import { SnackbarProvider } from "notistack";

export default function App() {
  return  (
    <SnackbarProvider>
      <RouterProvider router={router} />
    </SnackbarProvider> 
  )
}