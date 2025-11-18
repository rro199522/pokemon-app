// components/LoginScreen.tsx
import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (username: string, pass: string) => Promise<void>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await onLogin(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-gray-50 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Trainer!</h1>
      <p className="text-gray-600 mb-8">Please sign in to continue.</p>
      
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 bg-white placeholder-gray-500 leading-tight focus:outline-none focus:shadow-outline"
            required
            autoCapitalize="none"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 bg-white placeholder-gray-500 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:bg-gray-400"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>
        <div className="text-center mt-4 text-xs text-gray-500">
            <p>Hint: Pergunte o Mestre</p>
        </div>
      </form>
    </div>
  );
};

export default LoginScreen;