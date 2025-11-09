"use client";

import { useState } from "react";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ShineBorder } from "@/components/ui/shine-border";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const words = [
    {
      text: "Flourish",
    },
    {
      text: "together",
    },
    {
      text: "with",
    },
    {
      text: "Ecosystem.",
      className: "text-purple-500 dark:text-purple-500",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email atau password salah");
      } else if (result?.ok) {
        try {
          const response = await fetch("/api/pegawai/aplikasi");
          if (response.ok) {
            const aplikasi = await response.json();
            if (aplikasi.length === 1) {
              router.push(`/app/${aplikasi[0].aplikasiId}`);
            } else {
              router.push("/login/gate");
            }
          } else {
            router.push("/login/gate");
          }
        } catch (err) {
          router.push("/login/gate");
        }
        router.refresh();
      }
    } catch (err) {
      setError("Terjadi kesalahan, coba lagi");
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className={cn("flex flex-col items-center w-full max-w-[450px]", className)} {...props}>
      <div className="flex flex-col items-center text-center mb-10 w-full">
        <TypewriterEffectSmooth words={words} />
      </div>

      <Card className="relative overflow-hidden border-0 bg-gray-950 p-0 shadow-none w-full">
        <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
        
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center mb-4">
                <p className="text-gray-300 text-sm">
                  Login to your account
                </p>
              </div>

              {error && (
                <div className="rounded-lg bg-destructive/15 border border-destructive/50 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="email" className="text-white">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-gray-900/70 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-purple-500"
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="text-white">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline text-gray-300 hover:text-white transition-colors"
                  >
                    Forgot your password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="pr-10 bg-gray-900/70 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    disabled={loading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </Field>

              <Field>
                <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  {loading ? "Loading..." : "Login"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}