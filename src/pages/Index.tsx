
import React from 'react';
import Header from '../components/Header';
import DatePicker from '../components/DatePicker';
import WeeklySchedule from '../components/WeeklySchedule';
import TaskList from '../components/TaskList';
import NotePad from '../components/NotePad';
import ProgressBar from '../components/ProgressBar';
import GoogleSyncButton from '../components/GoogleSyncButton';
import InstallPWA from '../components/InstallPWA';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DatePicker />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-8">
            <WeeklySchedule />
            <TaskList />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            <ProgressBar />
            <GoogleSyncButton />
            <NotePad />
          </div>
        </div>
      </main>
      
      <InstallPWA />
    </div>
  );
};

export default Index;
