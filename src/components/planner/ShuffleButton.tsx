// src/components/planner/ShuffleButton.tsx
import { useState } from 'react';

interface ShuffleButtonProps {
  householdId: string;
  startDate: string;
  endDate: string;
  onShuffle: (householdId: string, startDate: string, endDate: string) => void;
  disabled?: boolean;
}

export default function ShuffleButton({ 
  householdId, 
  startDate, 
  endDate, 
  onShuffle, 
  disabled = false 
}: ShuffleButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleShuffle = async () => {
    if (disabled) return;
    
    setIsLoading(true);
    setShowConfirmation(false);
    
    try {
      await onShuffle(householdId, startDate, endDate);
    } catch (error) {
      console.error('Error during shuffle:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Fill empty slots?</span>
        <button
          onClick={handleShuffle}
          disabled={isLoading}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {isLoading ? 'Shuffling...' : 'Yes'}
        </button>
        <button
          onClick={() => setShowConfirmation(false)}
          disabled={isLoading}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setShowConfirmation(true)}
      disabled={disabled || isLoading}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Shuffling...
        </>
      ) : (
        'Fill Empty Slots'
      )}
    </button>
  );
}