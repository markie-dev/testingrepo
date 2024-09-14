'use client'

import { useAuth } from '../AuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth as getFirebaseAuth } from '../AuthContext';
import Link from 'next/link';

export default function LogIn() {
  const { user, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/pdashboard');
    }
  }, [user, router]);

  if (loading || user) return null;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isFormValid = email && password;

  const handleLogIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/pdashboard');
    } catch (error: any) {
      const errorMessage = error.message;
      console.error('Log in error:', errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="scroll-m-20 font-extrabold tracking-tight lg:text-2xl">
                Doctor Finder
              </Link>
            </div>
            <div>
              <Link 
                href="/signup" 
                className={buttonVariants({ variant: "outline" })}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="flex-grow flex justify-center px-4 sm:px-0">
        <Tabs defaultValue="patient" className="w-full max-w-2xl mt-10">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="patient">Patient</TabsTrigger>
            <TabsTrigger value="doctor">Doctor</TabsTrigger>
          </TabsList>
          <TabsContent value="patient">
            <Card className="mt-3">
              <form onSubmit={handleLogIn}>
                <CardHeader>
                  <CardTitle>Patient Login</CardTitle>
                  <CardDescription>
                    Log in to your account to book appointments and manage your health.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Input 
                      id="email" 
                      placeholder="Email" 
                      spellCheck="false" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="relative">
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"}
                        placeholder="Password" 
                        spellCheck="false"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </CardContent>
                <CardFooter>
                  <Button type="submit" size="lg" disabled={!isFormValid} className="w-full">Log In</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="doctor">
            <Card className="mt-3">
              <CardHeader>
                <CardTitle>Doctor Login</CardTitle>
                <CardDescription>
                  Log in to manage your appointments and patient records.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Add doctor login form here */}
              </CardContent>
              <CardFooter>
                {/* Add doctor login button here */}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
