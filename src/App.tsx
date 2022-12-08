import { lazy, Suspense } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { FullscreenLoader } from "./layouts/_index";
import { useFirebaseUser } from "./utils/auth";

const ErrorFallback = lazy(() => import("./layouts/ErrorFallback"));
const Authentication = lazy(() => import("./pages/Authentication"));
const Main = lazy(() => import("./pages/Main"));

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

  if (user)
    return (
      <Suspense fallback={<FullscreenLoader />}>
        <QueryClientProvider client={queryClient}>
          <Main user={user} />
        </QueryClientProvider>
      </Suspense>
    );

  return (
    <Suspense fallback={<FullscreenLoader />}>
      <Authentication />
    </Suspense>
  );
};

export default App;
