'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchRandomImage } from '@/utils/unsplash';
import { useUser } from '@/contexts/UserContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Link from 'next/link';
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { refreshUser } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { data: imageUrl, error: imageError } = useQuery({
    queryKey: ['randomImage'],
    queryFn: () => fetchRandomImage('technology'),
    staleTime: Infinity,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
        credentials: 'include',
      });

      if (!loginResponse.ok) {
        setErrorMessage('Login failed. Please check your credentials.');
        return;
      }

      await refreshUser();
      router.push('/dashboard');
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'An error occurred during login.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Image Container */}
      <div className="hidden lg:block lg:w-3/4 margin-top-0 lg:overflow-auto lg:p-1">
        {imageUrl ? (
          <div className="w-full h-full">
            <img
              src={imageUrl}
              alt="Random technology"
              className="w-full h-full object-cover rounded-xl"
              />
          </div>
        ) : imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-muted/30">
            <p className="text-destructive">Error loading image</p>
          </div>
        ) : (
          <div className="w-full h-full bg-muted/30 animate-pulse" />
        )}
      </div>

      {/* Form Container */}
      <div className="hidden lg:block lg:w-1/4 margin-top-0 lg:overflow-auto lg:p-1">
          <Card className="w-full h-full">
            <div className='justify-center lg:mt-40'>

          <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-3xl font-bold">Money Tracker</CardTitle>
              <CardDescription>
                Track your expenses effortlessly and save more with our easy-to-use app.
                Sign in to get started!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Alert */}
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              {/* Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Email" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Password"
                              className="pl-9"
                              {...field}
                            />
<Button
  type="button"
  variant="ghost"
  size="sm"
  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
  onClick={() => setShowPassword(!showPassword)}
>
  {showPassword ? (
    <EyeOff className="h-4 w-4 text-muted-foreground" />
  ) : (
    <Eye className="h-4 w-4 text-muted-foreground" />
  )}
</Button>                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Forgot Password Link */}
                  <Link
                    href="#"
                    className="text-sm text-primary hover:underline block text-right"
                  >
                    Forgot Password?
                  </Link>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full font-semibold h-11" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </Form>

              {/* Separator */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Sign In */}
              <Button 
                variant="outline" 
                className="w-full font-semibold h-11" 
                type="button"
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google logo"
                  className="h-5 w-5 mr-2"
                />
                Sign in with Google
              </Button>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-muted-foreground mt-4">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </CardContent>
            </div>
          </Card>
      </div>
      
    </div>
  );
};

export default Login;