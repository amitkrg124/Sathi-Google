/**
 * Saathi AI — Senior-First Digital Companion & Emergency SOS
 * @license Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { ShareConfirmationModal } from './components/ShareConfirmationModal';
import { EmergencySosModal } from './components/EmergencySosModal';
import { EmergencySosView } from './components/EmergencySosView';
import { HomeDashboard } from './components/HomeDashboard';
import { AskSaathiView } from './components/AskSaathiView';
import { ExplainView } from './components/ExplainView';
import { HelpMeDoItView } from './components/HelpMeDoItView';
import { DailyBriefView } from './components/DailyBriefView';
import { RemindersView } from './components/RemindersView';
import { TrustedCircleView } from './components/TrustedCircleView';
import { SettingsView } from './components/SettingsView';

const MainContent: React.FC = () => {
  const { currentScreen, notificationMessage, emergencyModalOpen, setEmergencyModalOpen, preferences } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeDashboard />;
      case 'ask':
        return <AskSaathiView />;
      case 'explain':
        return <ExplainView />;
      case 'tasks':
        return <HelpMeDoItView />;
      case 'daily_brief':
        return <DailyBriefView />;
      case 'reminders':
        return <RemindersView />;
      case 'trusted_circle':
        return <TrustedCircleView />;
      case 'settings':
        return <SettingsView />;
      case 'emergency':
        return <EmergencySosView />;
      default:
        return <HomeDashboard />;
    }
  };

  return (
    <div
      className={`flex h-screen overflow-hidden bg-[#FAF8F5] text-slate-900 ${
        preferences.textSize === 'large'
          ? 'text-lg'
          : preferences.textSize === 'extra-large'
          ? 'text-xl'
          : 'text-base'
      } ${preferences.highContrast ? 'contrast-125' : ''}`}
    >
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Sticky Header with Controls */}
        <Header />

        {/* Scrollable Screen Content */}
        <main
          id="main-scrollable-area"
          className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 focus:outline-hidden"
          tabIndex={-1}
        >
          {renderScreen()}
        </main>
      </div>

      {/* Senior Voice Assistant Modal */}
      <VoiceAssistantModal />

      {/* Emergency SOS Modal with Real Sirens, GPS & Dials */}
      <EmergencySosModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />

      {/* Trusted Circle Share Confirmation Gate */}
      <ShareConfirmationModal />

      {/* Non-intrusive Toast Notification */}
      {notificationMessage && (
        <div
          id="saathi-toast"
          role="status"
          aria-live="polite"
          className="fixed bottom-20 md:bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-[#0C1D2E] text-white font-bold text-sm shadow-2xl border border-amber-300/30 animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {notificationMessage}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
