'use client'

import Link from 'next/link';
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth, auth as getFirebaseAuth, clearUserCache } from './AuthContext';

export default function Home() {
  const { user } = useAuth();

  const handleLogout = () => {
    clearUserCache(); // Clear the cache
    getFirebaseAuth().signOut();
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
            <div className="space-x-4">
              {user ? (
                <>
                  <Link 
                    href="/pdashboard" 
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Dashboard
                  </Link>
                  <Button onClick={handleLogout}>Log Out</Button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Log In
                  </Link>
                  <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-2/3 py-6">
            {/* Main content */}
          </div>
        </div>
      </main>
    </div>
  );
}
