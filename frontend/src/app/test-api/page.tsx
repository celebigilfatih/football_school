'use client';

import { useState } from 'react';
import { API_URL } from '@/config';

export default function TestAPI() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testDirectFetch = async () => {
    setLoading(true);
    setResult('Testing direct fetch...');
    
    try {
      console.log('Starting direct fetch test...');
      const response = await fetch(`${API_URL}/news`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Data received:', data);
      
      setResult(`Success! Received ${data.length} news items. First item: ${JSON.stringify(data[0], null, 2)}`);
    } catch (error) {
      console.error('Direct fetch error:', error);
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testAxios = async () => {
    setLoading(true);
    setResult('Testing axios...');
    
    try {
      console.log('Starting axios test...');
      const { newsService } = await import('@/services/news.service');
      const data = await newsService.getAll();
      console.log('Axios data received:', data);
      
      setResult(`Axios Success! Received ${data.length} news items. First item: ${JSON.stringify(data[0], null, 2)}`);
    } catch (error) {
      console.error('Axios error:', error);
      setResult(`Axios Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
      
      <div className="space-y-4 mb-8">
        <button 
          onClick={testDirectFetch}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Direct Fetch
        </button>
        
        <button 
          onClick={testAxios}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 ml-4"
        >
          Test Axios Service
        </button>
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Result:</h2>
        <pre className="whitespace-pre-wrap text-sm">{result}</pre>
      </div>
    </div>
  );
}