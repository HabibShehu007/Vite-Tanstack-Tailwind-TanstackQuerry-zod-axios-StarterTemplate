// src/routes/__root.tsx
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      {/* The Outlet is where your active route pages will load! */}
      <Outlet />

      {/* Global Hot Toast Notification System wrapped at root level */}
      <Toaster position="top-right" richColors closeButton />

      {/* Devtools for debugging routes during development */}
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
