import { analytics } from '../firebase';
import { logEvent, setUserProperties, setUserId } from 'firebase/analytics';

// Type definitions for Firebase Analytics
type FirebaseAnalytics = any;

// Analytics service for tracking user interactions
export class AnalyticsService {
  private static instance: AnalyticsService;
  private sessionStartTime: Date;
  private currentScreen: string = '';
  private userId: string | null = null;
  private isAvailable: boolean = false;

  private constructor() {
    this.sessionStartTime = new Date();
    // Check if analytics is properly initialized
    this.isAvailable = !!analytics;
    if (!this.isAvailable) {
      console.warn("Analytics: Firebase is not available. Events will be logged locally only.");
    }
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Initialize user session
  setUser(userId: string, properties?: Record<string, any>) {
    this.userId = userId;
    if (!this.isAvailable) return;

    try {
      setUserId(analytics, userId);
      if (properties) {
        setUserProperties(analytics, properties);
      }
    } catch (error) {
      console.warn("Analytics: Failed to set user:", error);
    }
  }

  // Track screen views
  trackScreenView(screenName: string, screenClass?: string) {
    if (this.currentScreen !== screenName) {
      this.currentScreen = screenName;
      this.logEvent('screen_view', {
        screen_name: screenName,
        screen_class: screenClass || screenName,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Track time spent on screen
  trackScreenTime(screenName: string, timeSpent: number) {
    this.logEvent('screen_time', {
      screen_name: screenName,
      time_spent_seconds: timeSpent,
      timestamp: new Date().toISOString()
    });
  }

  // Map interaction events
  trackMapInteraction(type: string, data?: any) {
    const eventData = {
      interaction_type: type,
      screen_name: this.currentScreen,
      timestamp: new Date().toISOString(),
      ...data
    };

    switch (type) {
      case 'map_click':
        this.logEvent('map_click', {
          ...eventData,
          latitude: data?.latlng?.lat,
          longitude: data?.latlng?.lng
        });
        break;

      case 'marker_click':
        this.logEvent('marker_click', {
          ...eventData,
          marker_id: data?.markerId,
          marker_type: data?.markerType || 'vendor'
        });
        break;

      case 'zoom_change':
        this.logEvent('map_zoom', {
          ...eventData,
          zoom_level: data?.zoom
        });
        break;

      case 'move_end':
        this.logEvent('map_move', {
          ...eventData,
          center_lat: data?.center?.[0],
          center_lng: data?.center?.[1]
        });
        break;

      case 'geolocation_success':
        this.logEvent('geolocation_success', {
          ...eventData,
          user_lat: data?.position?.[0],
          user_lng: data?.position?.[1]
        });
        break;

      case 'geolocation_error':
        this.logEvent('geolocation_error', {
          ...eventData,
          error_message: data?.error
        });
        break;

      default:
        this.logEvent('map_interaction', eventData);
    }
  }

  // Filter usage tracking
  trackFilterUsage(filterType: string, filterValue: any, resultsCount: number) {
    this.logEvent('filter_applied', {
      filter_type: filterType,
      filter_value: filterValue,
      results_count: resultsCount,
      screen_name: this.currentScreen,
      timestamp: new Date().toISOString()
    });
  }

  // Search tracking
  trackSearch(query: string, resultsCount: number) {
    this.logEvent('search_performed', {
      search_query: query,
      results_count: resultsCount,
      screen_name: this.currentScreen,
      timestamp: new Date().toISOString()
    });
  }

  // User flow tracking
  trackFlowStep(stepName: string, stepIndex: number, totalSteps: number) {
    this.logEvent('flow_step', {
      step_name: stepName,
      step_index: stepIndex,
      total_steps: totalSteps,
      screen_name: this.currentScreen,
      timestamp: new Date().toISOString()
    });
  }

  // Vendor interaction tracking
  trackVendorInteraction(vendorId: string, action: string, vendorData?: any) {
    this.logEvent('vendor_interaction', {
      vendor_id: vendorId,
      action: action,
      vendor_name: vendorData?.name,
      vendor_certified: vendorData?.certified,
      vendor_humidity: vendorData?.humidity,
      screen_name: this.currentScreen,
      timestamp: new Date().toISOString()
    });
  }

  // Session tracking
  trackSessionStart() {
    this.logEvent('session_start', {
      timestamp: this.sessionStartTime.toISOString(),
      user_agent: navigator.userAgent,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
  }

  trackSessionEnd() {
    const sessionDuration = Date.now() - this.sessionStartTime.getTime();
    this.logEvent('session_end', {
      session_duration_ms: sessionDuration,
      session_duration_seconds: Math.round(sessionDuration / 1000),
      timestamp: new Date().toISOString()
    });
  }

  // Generic event logging with full error handling
  logEvent(eventName: string, parameters?: Record<string, any>) {
    if (!this.isAvailable) {
      // Log locally when Firebase is not available
      console.log(`[Analytics - Local] ${eventName}`, parameters);
      return;
    }

    try {
      logEvent(analytics, eventName, parameters);
      console.log(`[Analytics - Firebase] ${eventName}`, parameters);
    } catch (error) {
      console.warn(`[Analytics - Error] ${eventName}:`, error);
      // Fallback to local logging
      console.log(`[Analytics - Fallback] ${eventName}`, parameters);
    }
  }

  // Performance tracking
  trackPerformance(metric: string, value: number, additionalData?: any) {
    this.logEvent('performance_metric', {
      metric_name: metric,
      metric_value: value,
      screen_name: this.currentScreen,
      timestamp: new Date().toISOString(),
      ...additionalData
    });
  }

  // Error tracking
  trackError(error: Error, context?: string, additionalData?: any) {
    this.logEvent('error_occurred', {
      error_message: error.message,
      error_stack: error.stack,
      error_context: context,
      screen_name: this.currentScreen,
      timestamp: new Date().toISOString(),
      ...additionalData
    });
  }
}

// Export singleton instance
export const analyticsService = AnalyticsService.getInstance();