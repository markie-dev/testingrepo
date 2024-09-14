import Link from 'next/link';
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth, auth as getFirebaseAuth, clearUserCache } from "@/app/AuthContext";

export default function Navbar() {
  const { user, loading } = useAuth();

  const handleLogout = () => {
    clearUserCache();
    getFirebaseAuth().signOut();
  };

  return (
    <nav className={`sticky top-0 z-10 transition-transform duration-300 bg-white`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="scroll-m-20 font-extrabold tracking-tight lg:text-2xl">
              Doctor Finder
            </Link>
          </div>
          <div className="space-x-4">
            {loading ? (
              <div>Loading...</div>
            ) : user ? (
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
  );
}
