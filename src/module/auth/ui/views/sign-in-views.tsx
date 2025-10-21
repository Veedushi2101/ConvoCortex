"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { FaGoogle, FaGithub } from "react-icons/fa";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Loader2, OctagonAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email(),
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

  const onSocial = (provider: "google" | "github") => {
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
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form
              action=""
              className="p-6 md:p-8"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome Back</h1>
                  <p className="text-muted-foreground text-balance">
                    Login to your account to continue
                  </p>
                </div>

                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="example@gmail.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {!!error && (
                  <Alert className="bg-destructive/10 border-none">
                    <OctagonAlert className="h-4 w-4 !text-destructive" />
                    <AlertTitle>Error: {error}</AlertTitle>
                  </Alert>
                )}
                <Button
                  type="submit"
                  className="w-full hover:cursor-pointer"
                  disabled={loading}
                >
                  {loading && !error ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0
                after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 ">
                  <Button
                    disabled={loading}
                    variant="outline"
                    type="button"
                    className="w-full hover:cursor-pointer"
                    onClick={() => {onSocial("google")}}  
                  >
                    <FaGoogle/> Google
                  </Button>
                  <Button
                    disabled={loading}
                    variant="outline"
                    type="button"
                    className="w-full hover:cursor-pointer"
                    onClick={() => {onSocial("github")}}
                  >
                    <FaGithub/> GitHub
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don't have an account?{" "}
                  <Link
                    href="/sign-up"
                    className="underline underline-offset-4"
                  >
                    {" "}
                    Sign Up
                  </Link>
                </div>
              </div>
            </form>
          </Form>

          <div className="bg-radial from-green-700 to-green-900 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
            <img src="/next.svg" alt="Image" className="h-[92px] w-[92px]" />
            <p className="text-2xl font-semibold text-white">Convo-Cortex</p>
          </div>
        </CardContent>
      </Card>
      <div
        className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance
      *:[a]:underline *:[a]:underline-offset-4"
      >
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
