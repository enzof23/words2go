import { lazy, Suspense, useEffect } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { FullscreenLoader } from "./layouts/_index";
import { useFirebaseUser } from "./utils/auth";
import { useNavigate, useParams } from "react-router-dom";

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

type ParamsType = { userid: string };

const App = () => {
  const { user, loading, error } = useFirebaseUser();
  const { userid } = useParams<keyof ParamsType>() as ParamsType;

  const navigate = useNavigate();

  useEffect(() => {
    if (userid && user && userid !== user.uid) {
      navigate("/");
    }
  }, [user]);

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
