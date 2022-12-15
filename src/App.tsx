import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFirebaseUser } from "./utils/auth";

import { FullscreenLoader, OutletLoader } from "./layouts/LoadingSpinners";
const ErrorFallback = lazy(() => import("./layouts/ErrorFallback"));

const Authentication = lazy(() => import("./pages/Authentication"));
const Main = lazy(() => import("./pages/Main"));

const OutletGridDisplay = lazy(() => import("./components/_OutletGridDisplay"));
const CreateList = lazy(() => import("./components/_CreateList"));

const Library = lazy(() => import("./components/_Library"));
const Practice = lazy(() => import("./components/_Practice"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const { user, loading, error } = useFirebaseUser();

  if (loading) return <FullscreenLoader />;

  if (error)
    return (
      <Suspense fallback={<FullscreenLoader />}>
        <ErrorFallback />
      </Suspense>
    );

  if (user) {
    const router = createBrowserRouter([
      {
        path: "/",
        element: <Main user={user} />,
        children: [
          {
            path: "/",
            element: (
              <Suspense fallback={<OutletLoader />}>
                <OutletGridDisplay />
              </Suspense>
            ),
          },
          {
            path: "practice",
            element: (
              <Suspense fallback={<OutletLoader />}>
                <OutletGridDisplay />
              </Suspense>
            ),
          },
          {
            path: "create-list",
            element: (
              <Suspense fallback={<OutletLoader />}>
                <CreateList />
              </Suspense>
            ),
          },
          {
            path: "/library/:userid/:listid",
            element: (
              <Suspense fallback={<OutletLoader />}>
                <Library />
              </Suspense>
            ),
          },
          {
            path: "/practice/:userid/:listid",
            element: (
              <Suspense fallback={<OutletLoader />}>
                <Practice />
              </Suspense>
            ),
          },
        ],
      },
    ]);

    return (
      <Suspense fallback={<FullscreenLoader />}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<FullscreenLoader />}>
      <Authentication />
    </Suspense>
  );
};

export default App;
