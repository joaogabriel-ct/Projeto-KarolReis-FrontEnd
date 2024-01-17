import App from '@/components/calendar';
import { useState } from 'react';

export default function Home() {
  return (
      <div className="flex-1 bg-gray-100 min-h-screen">
        <App/>
      </div>
    
  );
}
