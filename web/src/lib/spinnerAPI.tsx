/*
import { useEffect, useState } from 'react';
import Spinner from 'src/components/Spinner/Spinner';

// Delay function to simulate artificial loading time
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface SpinnerAPIProps {
  onDataFetched: (data: any) => void; // Callback to send data to parent
}

const SpinnerAPI = ({ onDataFetched }: SpinnerAPIProps) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock data to simulate API response
  const mockData = {
    fitScore: 90,
    matchedSkills: ['JavaScript', 'HTML', 'CSS'],
    suggestions: ['Add TypeScript', 'Improve formatting', 'Needs to be more Sigma'],
  };

  const fetchData = async () => {
    setLoading(true); // Show spinner
    setError(null); // Reset error state

    await delay(3000); // Simulates a 3-second delay

    try {
      /* const response = await fetch('api/urls'); // Replace with API URL or URLS, might have to set up a list for multiple urls
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setData(result);
      setData(mockData);
      onDataFetched(mockData); // Pass data to parent component
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  useEffect(() => {
    fetchData(); // This will trigger the fetch as soon as the component mounts
  }, []);

  if (loading) {
    return <Spinner />;
    }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Resume Analysis</h1>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
  return null; // No data to render, just shows the spinner while loading
};

export default SpinnerAPI;

import { useState, useEffect } from 'react'
import Spinner from 'src/components/Spinner/Spinner'

const SpinnerAPI = ({
  fetchData,
  onDataFetched,
}: {
  fetchData: () => Promise<any> // Fetching logic from parent
  onDataFetched: (data: any) => void // Callback to send data to parent
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDataWithSpinner = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await fetchData()
        onDataFetched(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchDataWithSpinner()
  }, [fetchData, onDataFetched])

  if (loading) return <Spinner />
  if (error) return <div>Error: {error}</div>

  return null
}

export default SpinnerAPI*/
