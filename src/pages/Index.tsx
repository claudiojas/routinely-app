
import TaskList from '../components/TaskList';
import TaskManager from '../components/TaskManager';
import NotePad from '../components/NotePad';
import ProgressBar from '../components/ProgressBar';
import InstallPWA from '../components/InstallPWA';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-dark-800 to-slate-900">      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <TaskList />
            <TaskManager />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <ProgressBar />
            <NotePad />
          </div>
        </div>
      </main>
      
      <InstallPWA />
    </div>
  );
};

export default Index;
