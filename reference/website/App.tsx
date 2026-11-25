import { useEffect, useRef } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { ClerkProvider, useClerk } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { dark } from "@clerk/themes";
import { SignInPage, SignUpPage, basePath, signInPath, signUpPath, spinPath } from "@/components/auth/auth-pages";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Greenhouse from "@/pages/greenhouse";
import Admin from "@/pages/admin";
import Community from "@/pages/community";
import CommunityAdmin from "@/pages/community-admin";
import GreenLightPay from "@/pages/green-light-pay";
import Regulatory from "@/pages/regulatory";
import PlantDoctor from "@/pages/plant-doctor";
import Organization from "@/pages/organization";
import FormationMap from "@/pages/formation-map";
import Spin from "@/pages/spin";
import SpinOwner from "@/pages/spin-owner";
import SpinVerify from "@/pages/spin-verify";

const queryClient = new QueryClient();

// Resolve keys per hostname, including Clerk custom domains.
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
// Empty in development; provisioned automatically for the production proxy.
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env file");
}

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

const clerkAppearance = {
  theme: dark,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/potify-wordmark.svg`,
    socialButtonsPlacement: "bottom" as const,
  },
  variables: {
    colorPrimary: "#A78B4B",
    colorForeground: "#EDE6D5",
    colorMutedForeground: "#acb3a3",
    colorDanger: "#ff8585",
    colorBackground: "#0F1B12",
    colorInput: "#18251b",
    colorInputForeground: "#EDE6D5",
    colorNeutral: "#7f957f",
    fontFamily: "Inter, sans-serif",
    borderRadius: "8px",
  },
  elements: {
    rootBox: { width: "100%", display: "flex", justifyContent: "center" },
    cardBox: { width: "440px", maxWidth: "100%", background: "#0F1B12", border: "1px solid #344b34", borderRadius: "16px", overflow: "hidden", boxShadow: "0 20px 60px #0009" },
    card: { boxShadow: "none", border: "none", background: "transparent" },
    footer: { boxShadow: "none", border: "none", background: "transparent" },
    headerTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", color: "#EDE6D5" },
    headerSubtitle: { color: "#acb3a3" },
    socialButtonsBlockButtonText: { color: "#EDE6D5" },
    formFieldLabel: { color: "#EDE6D5" },
    footerActionLink: { color: "#d7b668" },
    footerActionText: { color: "#acb3a3" },
    dividerText: { color: "#acb3a3" },
    identityPreviewEditButton: { color: "#d7b668" },
    formFieldSuccessText: { color: "#96c69d" },
    alertText: { color: "#EDE6D5" },
    logoBox: { justifyContent: "center" },
    logoImage: { width: "180px", height: "45px" },
    socialButtonsBlockButton: { background: "#18251b", border: "1px solid #465846" },
    formButtonPrimary: { background: "#A78B4B", color: "#0A0D0A", fontWeight: 600 },
    formFieldInput: { background: "#18251b", color: "#EDE6D5", border: "1px solid #465846" },
    footerAction: { color: "#acb3a3" },
    dividerLine: { background: "#465846" },
    alert: { background: "#253025", border: "1px solid #465846" },
    otpCodeFieldInput: { color: "#EDE6D5", background: "#18251b" },
    formFieldRow: { color: "#EDE6D5" },
    main: { background: "transparent" },
  },
};

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const client = useQueryClient();
  const previousUserId = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (previousUserId.current !== undefined && previousUserId.current !== userId) {
        client.clear();
      }
      previousUserId.current = userId;
    });
    return unsubscribe;
  }, [addListener, client]);
  return null;
}

function HashNavigation() {
  const [location] = useLocation();
  useEffect(() => {
    let frame = 0;
    const scrollToTarget = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let id: string;
        try {
          id = decodeURIComponent(window.location.hash.slice(1));
        } catch {
          return;
        }
        if (id) document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "instant" });
      });
    };
    scrollToTarget();
    window.addEventListener("hashchange", scrollToTarget);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", scrollToTarget);
    };
  }, [location]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />
      <Route path="/spin/owner" component={SpinOwner} />
      <Route path="/spin/verify/:code" component={SpinVerify} />
      <Route path="/spin/verify" component={SpinVerify} />
      <Route path="/spin" component={Spin} />
      <Route path="/greenhouse" component={Greenhouse} />
      <Route path="/admin" component={Admin} />
      <Route path="/community/admin" component={CommunityAdmin} />
      <Route path="/community" component={Community} />
      <Route path="/green-light-pay" component={GreenLightPay} />
      <Route path="/regulatory" component={Regulatory} />
      <Route path="/plant-doctor" component={PlantDoctor} />
      <Route path="/company/formation-map" component={FormationMap} />
      <Route path="/company" component={Organization} />
      <Route component={NotFound} />
    </Switch>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      signInFallbackRedirectUrl={spinPath}
      signUpFallbackRedirectUrl={spinPath}
      localization={{
        signIn: { start: { title: "Welcome back", subtitle: "Sign in to enter the Spin" } },
        signUp: { start: { title: "Join the circle", subtitle: "Create your account to enter the Spin" } },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <ClerkQueryClientCacheInvalidator />
      <Router />
      <HashNavigation />
    </ClerkProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={basePath}>
          <ClerkProviderWithRoutes />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
