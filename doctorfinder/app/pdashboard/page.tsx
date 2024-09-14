'use client'

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useAuth, auth as getFirebaseAuth, db as getFirebaseDb, clearUserCache } from '../AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function PDashboard() {
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [symptomsUpdated, setSymptomsUpdated] = useState(false);
  const [addressUpdated, setAddressUpdated] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const capitalizeWords = (str: string) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        router.push('/login');
        return;
      }

      setIsAuthenticated(true);

      // Check if user data is in cache
      const cachedUser = localStorage.getItem('userCache');
      if (cachedUser) {
        const userData = JSON.parse(cachedUser);
        setUserName(userData.name || '');
        setSelectedSymptoms(userData.symptoms || []);
        setAddress(userData.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
        });
      } else {
        console.log("Fetching user info from db");
        // If not in cache, fetch from Firestore
        const db = getFirebaseDb();
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.name || '');
          setSelectedSymptoms(userData.symptoms || []);
          setAddress(userData.address || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
          });
          // Cache the user data
          localStorage.setItem('userCache', JSON.stringify(userData));
        }
      }
      setIsReady(true);
    };

    fetchUserData();
  }, [user, router]);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;

        if (currentScrollY < lastScrollY) {
          // Scrolling up
          setIsNavVisible(true);
        } else if (currentScrollY > 50 && currentScrollY > lastScrollY) {
          setIsNavVisible(false);
        }

        // Update last scroll position
        setLastScrollY(currentScrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);

      // Cleanup
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  if (!isAuthenticated) {
    return <LoadingSkeleton />;
  }

  if (!isReady) {
    return <LoadingSkeleton />;
  }

  const handleLogout = () => {
    clearUserCache(); // Clear the cache when logging out
    getFirebaseAuth().signOut();
  };

  const handleSaveSymptoms = async () => {
    if (!user) return;
    const db = getFirebaseDb();
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        symptoms: selectedSymptoms
      });
      toast({
        title: "Symptoms saved",
        description: "Your symptoms have been updated successfully.",
        variant: "success",
      });
      setSymptomsUpdated(true);
    } catch (error) {
      console.error("Error saving symptoms:", error);
      toast({
        title: "Error",
        description: "Failed to save symptoms. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAddress = async () => {
    if (!user) return;
    const db = getFirebaseDb();
    try {
      await updateDoc(doc(db, 'users', user.uid), { address });
      toast({
        title: "Address updated",
        description: "Your address has been updated successfully.",
        variant: "success",
      });
      setAddressUpdated(true);
    } catch (error) {
      console.error("Error updating address:", error);
      toast({
        title: "Error",
        description: "Failed to update address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSymptomToggle = (value: string[]) => {
    setSelectedSymptoms(value);
    setSymptomsUpdated(false);
  };

  const handleAddressChange = (field: string, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    setAddressUpdated(false);
  };

  const isAddressComplete = Object.values(address).every(value => value.trim() !== '');

  return (
    <div className="min-h-screen flex flex-col">
      <nav className={`sticky top-0 z-10 transition-transform duration-300 bg-white ${
        isNavVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="scroll-m-20 font-extrabold tracking-tight lg:text-2xl">
                Doctor Finder
              </Link>
            </div>
            <div className="space-x-4">
              <Button onClick={handleLogout}>Log Out</Button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full py-7">
            <h1 className="text-3xl font-bold flex flex-col sm:flex-row sm:items-center">
              <span className="mr-2">Welcome,</span>
              <span>{capitalizeWords(userName)}</span>
            </h1>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle>Symptoms</CardTitle>
                  <CardDescription>Select your current symptoms</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ToggleGroup 
                    type="multiple" 
                    className="flex flex-wrap gap-2" 
                    onValueChange={handleSymptomToggle}
                    value={selectedSymptoms} // Add this line
                  >
                    {[
                      "fever", "cough", "headache", "sore-throat", "fatigue", 
                      "body-aches", "nausea", "diarrhea", "shortness-of-breath", 
                      "chest-pain", "dizziness", "abdominal-pain", "back-pain", 
                      "joint-pain", "rash", "anxiety", "depression", "insomnia"
                    ].map((symptom) => (
                      <ToggleGroupItem 
                        key={symptom}
                        value={symptom} 
                        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=off]:text-gray-400"
                      >
                        {symptom.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button 
                    className="w-full" 
                    disabled={selectedSymptoms.length === 0 || symptomsUpdated}
                    onClick={handleSaveSymptoms}
                  >
                    {symptomsUpdated ? "Symptoms Saved" : "Save Symptoms"}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle>Home Address</CardTitle>
                  <CardDescription>Update your home address</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <Input
                    className="mb-2"
                    placeholder="Street Address"
                    value={address.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                  />
                  <Input
                    className="mb-2"
                    placeholder="City"
                    value={address.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                  />
                  <Input
                    className="mb-2"
                    placeholder="State"
                    value={address.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                  />
                  <Input
                    placeholder="Zip Code"
                    value={address.zipCode}
                    onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                  />
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button 
                    className="w-full" 
                    disabled={!isAddressComplete || addressUpdated}
                    onClick={handleUpdateAddress}
                  >
                    {addressUpdated ? "Address Updated" : "Update Address"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col p-4">
      <Skeleton className="h-12 w-48 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}
