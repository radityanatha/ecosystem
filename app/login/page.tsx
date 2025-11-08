"use client";

import { LoginForm } from "@/components/login-form";
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/spotlight";

export default function LoginPage() {
  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-black/[0.96] antialiased">
      {/* Grid Pattern Background */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none",
          "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]"
        )}
      />

      {/* Spotlight Effect */}
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="white"
      />
      
      {/* Login Form - Centered */}
      <div className="relative z-10 flex h-screen w-full items-center justify-center p-4">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}