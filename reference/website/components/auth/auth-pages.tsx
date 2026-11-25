import { SignIn, SignUp, useClerk } from "@clerk/react";
import { Link } from "wouter";

export const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
export const spinPath = `${basePath}/spin`;
export const signInPath = `${basePath}/sign-in`;
export const signUpPath = `${basePath}/sign-up`;

function AuthFrame({ children, heading }: { children: React.ReactNode; heading: string }) {
  return (
    <main className="min-h-[100dvh] bg-[#0A0D0A] px-4 py-12 text-[#EDE6D5] flex flex-col items-center justify-center">
      <Link href="/" className="mb-7 flex items-center gap-3 text-sm tracking-[0.22em] uppercase text-[#A78B4B] hover:text-[#EDE6D5]">
        <span aria-hidden="true">$</span>
        POTIFY
      </Link>
      <h1 className="mb-2 font-serif text-4xl sm:text-5xl text-center">{heading}</h1>
      <p className="mb-8 max-w-md text-center text-sm leading-relaxed text-[#a9afa1]">
        Sign in with a verified email to take part in the Spin.
      </p>
      {children}
      <Link href="/" className="mt-8 text-xs uppercase tracking-[0.16em] text-[#A78B4B] hover:text-[#EDE6D5]">
        Return to POTIFY
      </Link>
    </main>
  );
}

export function SignInPage() {
  return (
    <AuthFrame heading="Welcome back">
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
        fallbackRedirectUrl={spinPath}
      />
    </AuthFrame>
  );
}

export function SignUpPage() {
  return (
    <AuthFrame heading="Join the circle">
      <SignUp
        routing="path"
        path={`${basePath}/sign-up`}
        signInUrl={`${basePath}/sign-in`}
        fallbackRedirectUrl={spinPath}
      />
    </AuthFrame>
  );
}

export function LogoutButton({ className }: { className?: string }) {
  const { signOut } = useClerk();
  return (
    <button type="button" className={className} onClick={() => signOut({ redirectUrl: basePath || "/" })}>
      Sign out
    </button>
  );
}