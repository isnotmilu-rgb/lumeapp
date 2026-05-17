import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, createContext, useContext, useEffect, type ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SplashScreen } from './components/SplashScreen';
import { Onboarding } from './components/Onboarding';
import { MapScreen } from './components/MapScreen';
import { SellerProfile } from './components/SellerProfile';
import { ContactScreen } from './components/ContactScreen';
import { ListScreen } from './components/ListScreen';
import { VendorDashboard } from './components/VendorDashboard';
import { MeasureScreen } from './components/MeasureScreen';
import { ConfirmationScreen } from './components/ConfirmationScreen';
import { CertificationScreen } from './components/CertificationScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { BuyerProfileScreen } from './components/BuyerProfileScreen';
import { VendorProfileScreen } from './components/VendorProfileScreen';
import { FAQScreen } from './components/FAQScreen';
import { HowItWorksScreen } from './components/HowItWorksScreen';
import { StatsScreen } from './components/StatsScreen';
import { ComingSoonModal } from './components/ComingSoonModal';
import { analyticsService } from '../services/analytics';

// Analytics route tracker
function RouteWrapper({ children }: { children: ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    // Track screen view on route change
    const screenName = location.pathname.replace('/', '').replace('-', '_') || 'home';
    analyticsService.trackScreenView(`${screenName}_screen`);
  }, [location.pathname]);

  return <>{children}</>;
}

type UserType = 'buyer' | 'vendor' | null;

interface AppContextType {
  userType: UserType;
  setUserType: (type: UserType) => void;
  showComingSoon: boolean;
  setShowComingSoon: (show: boolean) => void;
  currentFlow: string[];
  setCurrentFlow: (flow: string[]) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [userType, setUserType] = useState<UserType>(null);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [currentFlow, setCurrentFlow] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Initialize analytics on app start
  useEffect(() => {
    try {
      analyticsService.trackSessionStart();

      // Track session end on app close
      const handleBeforeUnload = () => {
        try {
          analyticsService.trackSessionEnd();
        } catch (error) {
          console.warn('Error tracking session end:', error);
        }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        try {
          analyticsService.trackSessionEnd();
        } catch (error) {
          console.warn('Error tracking session end on unmount:', error);
        }
      };
    } catch (error) {
      console.warn('Error initializing analytics:', error);
      // Application continues even if analytics fails
    }
  }, []);

  if (showSplash) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-[#0d3d11] to-[#1B5E20] flex items-center justify-center">
        <div className="w-full h-full bg-[#F9FBE7] overflow-hidden">
          <SplashScreen onFinish={() => setShowSplash(false)} />
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        userType,
        setUserType,
        showComingSoon,
        setShowComingSoon,
        currentFlow,
        setCurrentFlow,
        currentStep,
        setCurrentStep,
      }}
    >
      <BrowserRouter>
        <div className="h-screen w-screen bg-gradient-to-br from-[#0d3d11] to-[#1B5E20] text-[#0f380f]">
          <div className="h-full w-full bg-[#F9FBE7] overflow-hidden">
            <Routes>
              <Route path="/" element={<RouteWrapper>{userType ? <Navigate to={userType === 'buyer' ? '/map' : '/dashboard'} /> : <Onboarding />}</RouteWrapper>} />
              <Route path="/onboarding" element={<RouteWrapper><Onboarding /></RouteWrapper>} />
              <Route path="/map" element={<RouteWrapper><MapScreen /></RouteWrapper>} />
              <Route path="/seller/:id" element={<RouteWrapper><SellerProfile /></RouteWrapper>} />
              <Route path="/contact/:id" element={<RouteWrapper><ContactScreen /></RouteWrapper>} />
              <Route path="/list" element={<RouteWrapper><ListScreen /></RouteWrapper>} />
              <Route path="/dashboard" element={<RouteWrapper><VendorDashboard /></RouteWrapper>} />
              <Route path="/measure" element={<RouteWrapper><MeasureScreen /></RouteWrapper>} />
              <Route path="/confirmation" element={<RouteWrapper><ConfirmationScreen /></RouteWrapper>} />
              <Route path="/certification" element={<RouteWrapper><CertificationScreen /></RouteWrapper>} />
              <Route path="/history/:id" element={<RouteWrapper><HistoryScreen /></RouteWrapper>} />
              <Route path="/profile/buyer" element={<RouteWrapper><BuyerProfileScreen /></RouteWrapper>} />
              <Route path="/profile/vendor" element={<RouteWrapper><VendorProfileScreen /></RouteWrapper>} />
              <Route path="/faq" element={<RouteWrapper><FAQScreen /></RouteWrapper>} />
              <Route path="/how-it-works" element={<RouteWrapper><HowItWorksScreen /></RouteWrapper>} />
              <Route path="/stats" element={<RouteWrapper><StatsScreen /></RouteWrapper>} />
            </Routes>
          </div>

          {showComingSoon && <ComingSoonModal />}
        </div>
      </BrowserRouter>
      <Analytics />
    </AppContext.Provider>
  );
}
