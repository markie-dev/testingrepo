'use client'
import { useAuth } from '../AuthContext';
import { createUserWithEmailAndPassword } from 'firebase/auth';
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
import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { app, auth as getFirebaseAuth, db as getFirebaseDb } from '../AuthContext';
import { doc, setDoc } from 'firebase/firestore';

import Link from 'next/link';

export default function SignUp() {
  const { user, loading } = useAuth();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/pdashboard');
    }
  }, [user, router]);

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  if (loading) return <div>Loading...</div>;
  if (user) return null;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isFormValid = name && username && email && password;

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const auth = getFirebaseAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a user document in Firestore
      const db = getFirebaseDb();
      await setDoc(doc(db, 'users', user.uid), {
        name,
        username,
        email,
        role: 'patient', // Since this is the patient signup form
        createdAt: new Date().toISOString()
      });

      console.log('User signed up and document created:', user);
      router.push('/pdashboard');
    } catch (error: any) {
      console.error('Sign up error:', error);
      setError(error.message);
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
                href="/login" 
                className={buttonVariants({ variant: "outline" })}
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="flex-grow flex justify-center">
        <Tabs defaultValue="patient" className="w-full max-w-2xl mt-10">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="patient">Patient</TabsTrigger>
            <TabsTrigger value="doctor">Doctor</TabsTrigger>
        </TabsList>
        <TabsContent value="patient">
            <Card className="mt-6">
              <form onSubmit={handleSignUp}>
                <CardHeader>
                  <CardTitle>Patient Signup</CardTitle>
                  <CardDescription>
                    Once you sign up, you will be able to find your doctor and book an appointment.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Input 
                      id="name" 
                      ref={nameInputRef} 
                      placeholder="Name" 
                      spellCheck="false" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Input 
                      id="username" 
                      placeholder="Username" 
                      spellCheck="false" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
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
                <CardFooter className="flex">
                  <Button type="submit" size="lg" disabled={!isFormValid}>Create Account</Button>
                </CardFooter>
              </form>
            </Card>
        </TabsContent>
        <TabsContent value="doctor">
            <Card>
            <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                Change your password here. After saving, you'll be logged out.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" />
                </div>
            </CardContent>
            <CardFooter>
                <Button>Save password</Button>
            </CardFooter>
            </Card>
        </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
