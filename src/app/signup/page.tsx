"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Telescope, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const { signup } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordRequirements = [
      { regex: /.{8,}/, message: "at least 8 characters" },
      { regex: /[A-Z]/, message: "an uppercase letter" },
      { regex: /[a-z]/, message: "a lowercase letter" },
      { regex: /[0-9]/, message: "a number" },
      { regex: /[^A-Za-z0-9]/, message: "a special character" },
    ];

    const unmetRequirements = passwordRequirements
      .filter((req) => !req.regex.test(password))
      .map((req) => req.message);

    if (unmetRequirements.length > 0) {
      toast({
        variant: "destructive",
        title: "Password is too weak",
        description: `Your password must contain ${unmetRequirements.join(
          ", "
        )}.`,
      });
      return;
    }

    if (name.trim() && email.trim()) {
      setIsLoading(true);
      try {
        await signup(name, email, password);
        // The redirect is handled by the AuthContext
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Sign-up Failed",
          description:
            error.message || "An unknown error occurred. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <Telescope className="size-8 text-primary" />
            <h1 className="text-2xl font-bold">StreamSphere</h1>
          </div>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>
            Enter your details below to get started.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Sign Up"
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="underline underline-offset-2 hover:text-primary"
              >
                Log In
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
