"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Loader2, OctagonAlert, Sparkles, MessageSquare, Bot, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { FaGoogle, FaGithub } from "react-icons/fa";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const SignInViews = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setError(null);
    setLoading(true);

    authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          setLoading(false);
          router.push("/");
        },
        onError: ({ error }) => {
          setLoading(false);
          setError(error.message);
        },
      }
    );
  };

  const onSocials = (provider: "google" | "github") => {
    setError(null);
    setLoading(true);

    authClient.signIn.social(
      {
        provider: provider,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          setLoading(false);
        },
        onError: ({ error }) => {
          setLoading(false);
          setError(error.message);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden border border-purple-500/20 bg-[#0d041a]/85 backdrop-blur-2xl shadow-[0_0_60px_-15px_rgba(147,51,234,0.3)] rounded-3xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Left Form Column */}
          <Form {...form}>
            <form
              className="p-8 md:p-10 flex flex-col justify-between bg-gradient-to-b from-[#140827] via-[#0e041d] to-[#090214]"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                    Welcome back
                  </h1>
                  <p className="text-purple-200/60 text-sm mt-1.5">
                    Log in to continue your AI mock interview prep
                  </p>
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-purple-200/70">
                          Email address
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@domain.com"
                            className="h-11 rounded-xl bg-white/[0.04] border-purple-500/20 text-white placeholder:text-purple-300/30 focus-visible:border-purple-400 focus-visible:ring-2 focus-visible:ring-purple-500/30 transition-all"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-rose-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-purple-200/70">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="h-11 rounded-xl bg-white/[0.04] border-purple-500/20 text-white placeholder:text-purple-300/30 focus-visible:border-purple-400 focus-visible:ring-2 focus-visible:ring-purple-500/30 transition-all"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-rose-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {!!error && (
                  <Alert className="bg-rose-500/10 border border-rose-500/30 text-rose-300 py-2.5 rounded-xl">
                    <OctagonAlert className="h-4 w-4 !text-rose-400" />
                    <AlertTitle className="text-xs font-medium ml-2">{error}</AlertTitle>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#F97316] hover:opacity-95 text-white font-medium shadow-[0_4px_20px_rgba(168,85,247,0.35)] transition-all duration-200 cursor-pointer active:scale-[0.99]"
                >
                  {loading && !error ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Sign In <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>

                <div className="relative text-center text-xs">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-purple-500/15" />
                  </div>
                  <span className="relative bg-[#0e041d] px-3 text-purple-300/50 uppercase tracking-wider text-[10px]">
                    Or continue with
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    disabled={loading}
                    onClick={() => onSocials("google")}
                    variant="outline"
                    type="button"
                    className="h-10 rounded-xl border-purple-500/20 bg-white/[0.03] text-purple-100 hover:bg-white/[0.08] hover:text-white transition-all text-xs font-medium"
                  >
                    <FaGoogle className="mr-2 h-3.5 w-3.5 text-purple-300" />
                    Google
                  </Button>

                  <Button
                    disabled={loading}
                    onClick={() => onSocials("github")}
                    variant="outline"
                    type="button"
                    className="h-10 rounded-xl border-purple-500/20 bg-white/[0.03] text-purple-100 hover:bg-white/[0.08] hover:text-white transition-all text-xs font-medium"
                  >
                    <FaGithub className="mr-2 h-3.5 w-3.5 text-purple-300" />
                    GitHub
                  </Button>
                </div>

                <p className="text-center text-xs text-purple-200/50 mt-2">
                  Don't have an account?{" "}
                  <Link
                    href="/sign-up"
                    className="text-[#E0AAFF] hover:text-[#FFA94D] font-medium underline underline-offset-4 transition-colors"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </Form>

          {/* Right Brand & Visual Column */}
          <div className="relative hidden md:flex flex-col items-center justify-between p-10 overflow-hidden bg-gradient-to-br from-[#4C1D95] via-[#2E1065] to-[#120429]">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-[#F97316]/40 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-gradient-to-tr from-[#8B5CF6]/40 to-transparent blur-3xl pointer-events-none" />

            <div className="w-full flex justify-end">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-white/[0.08] border border-white/10 text-purple-200">
                <Sparkles className="w-3 h-3 text-[#F97316]" /> AI Powered
              </span>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center my-auto">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#8B5CF6] to-[#F97316] rounded-2xl blur-xl opacity-60 animate-pulse" />
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-white/15 to-white/5 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                  <Bot className="w-10 h-10 text-white drop-shadow-md" />
                </div>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-200">
                Convo-Cortex
              </h2>

              <p className="mt-2.5 max-w-[240px] text-xs leading-relaxed text-purple-200/75">
                Real-time AI simulations, performance telemetry, and targeted feedback for tech interviews.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-[280px]">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-[11px] text-purple-200/90">
                  <MessageSquare className="w-3 h-3 text-[#F97316]" /> Speech Analysis
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-[11px] text-purple-200/90">
                  <Bot className="w-3 h-3 text-[#A855F7]" /> Live Real-time AI
                </div>
              </div>
            </div>

            <div className="text-[11px] text-purple-300/40 text-center">
              Next-Gen Mock Technical Interviews
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-purple-300/50 text-center text-[11px] *:[a]:text-[#E0AAFF] *:[a]:hover:text-[#FFA94D] *:[a]:underline *:[a]:underline-offset-4">
        By signing in, you agree to our{" "}
        <a href="/terms-of-service" target="_blank" rel="noreferrer">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy-policy" target="_blank" rel="noreferrer">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
};