'use client';

import { useState, useEffect, FormEvent } from 'react';

interface Doctor {
  id: number;
  name: string;
  email: string;
  password: string;
  specialty: string;
  services: string;
  location: string;
  availability: string;
  createdAt: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export default function Home() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newDoctor, setNewDoctor] = useState<Omit<Doctor, 'id'>>({ name: '', email: '', password: '', specialty: '', services: '', location: '', availability: '', createdAt: '' });
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({ name: '', email: '', password: '', createdAt: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorsResponse = await fetch('/api/doctors');
        const doctorsData = await doctorsResponse.json();
        setDoctors(Array.isArray(doctorsData) ? doctorsData : []);

        const usersResponse = await fetch('/api/users');
        const usersData = await usersResponse.json();
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setDoctors([]);
        setUsers([]);
      }
    };

    fetchData();
  }, []);

  const handleDoctorSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDoctor),
      });
      if (response.ok) {
        const newDoctorData = await response.json();
        setDoctors([...doctors, newDoctorData]);
        setNewDoctor({ name: '', email: '', specialty: '', services: '', location: '', availability: '', password: '', createdAt: '' });
      }
    } catch (error) {
      console.error('Error adding doctor:', error);
    }
  };

  const handleUserSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        const newUserData = await response.json();
        setUsers([...users, newUserData]);
        setNewUser({ name: '', email: '', password: '', createdAt: '' });
      } else {
        console.error('Error adding user:', await response.text());
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Doctor Finder Database</h1>
      
      <h2 className="text-2xl font-semibold mb-2">Add New Doctor</h2>
      <form onSubmit={handleDoctorSubmit} className="mb-8 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Name"
          value={newDoctor.name}
          onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})}
          className="border p-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={newDoctor.email}
          onChange={(e) => setNewDoctor({...newDoctor, email: e.target.value})}
          className="border p-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={newDoctor.password}
          onChange={(e) => setNewDoctor({...newDoctor, password: e.target.value})}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Specialty"
          value={newDoctor.specialty}
          onChange={(e) => setNewDoctor({...newDoctor, specialty: e.target.value})}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Services"
          value={newDoctor.services}
          onChange={(e) => setNewDoctor({...newDoctor, services: e.target.value})}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Location"
          value={newDoctor.location}
          onChange={(e) => setNewDoctor({...newDoctor, location: e.target.value})}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Availability"
          value={newDoctor.availability}
          onChange={(e) => setNewDoctor({...newDoctor, availability: e.target.value})}
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Doctor</button>
      </form>

      <h2 className="text-2xl font-semibold mb-2">Doctors</h2>
      <table className="w-full mb-8">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Specialty</th>
            <th className="border px-4 py-2">Services</th>
            <th className="border px-4 py-2">Location</th>
            <th className="border px-4 py-2">Availability</th>
          </tr>
        </thead>
        <tbody>
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <tr key={doctor.id}>
                <td className="border px-4 py-2">{doctor.id}</td>
                <td className="border px-4 py-2">{doctor.name}</td>
                <td className="border px-4 py-2">{doctor.email}</td>
                <td className="border px-4 py-2">{doctor.specialty}</td>
                <td className="border px-4 py-2">{doctor.services}</td>
                <td className="border px-4 py-2">{doctor.location}</td>
                <td className="border px-4 py-2">{doctor.availability}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="border px-4 py-2 text-center">No doctors found</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2 className="text-2xl font-semibold mb-2 mt-8">Add New User</h2>
      <form onSubmit={handleUserSubmit} className="mb-8 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
          className="border p-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
          className="border p-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
          className="border p-2"
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded">Add User</button>
      </form>

      <h2 className="text-2xl font-semibold mb-2">Users</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td className="border px-4 py-2">{user.id}</td>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="border px-4 py-2 text-center">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
