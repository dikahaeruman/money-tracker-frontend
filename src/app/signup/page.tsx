'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchRandomImage } from '@/utils/unsplash';
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
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
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
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirm: z.string()
}).refine((data) => data.password === data.confirm, {
  message: "Passwords don't match",
  path: ["confirm"],
});

const SignUp: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirm: "",
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
      setSuccessMessage('');

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.status === 201) {
        setSuccessMessage('Registration successful! Redirecting to login page...');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setErrorMessage('An error occurred during sign up.');
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
          <div className="justify-center lg:mt-40">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-3xl font-bold">Money Tracker</CardTitle>
              <CardDescription>
                Join Money Tracker today and start managing your finances effortlessly!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {(errorMessage || successMessage) && (
                <Alert variant={successMessage ? "default" : "destructive"}>
                  <AlertDescription>
                    {successMessage || errorMessage}
                  </AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Username" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirm"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm Password"
                              className="pl-9"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full font-semibold h-11" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Signing up...
                      </>
                    ) : (
                      'Sign Up'
                    )}
                  </Button>
                </form>
              </Form>

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
                Sign up with Google
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;