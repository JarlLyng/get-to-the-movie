// Umami analytics event tracking
declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, string>) => void;
    };
  }
}

export function trackEvent(eventName: string, eventData?: Record<string, string>) {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(eventName, eventData);
  }
}

// Predefined events for the app
export const UmamiEvents = {
  QUIZ_STARTED: 'quiz_started',
  QUIZ_COMPLETED: 'quiz_completed',
  QUIZ_RESET: 'quiz_reset',
  RECOMMENDATIONS_RECEIVED: 'recommendations_received',
  TRY_AGAIN_CLICKED: 'try_again_clicked',
  GET_MORE_RECOMMENDATIONS_CLICKED: 'get_more_recommendations_clicked',
  QUIZ_QUESTION_ANSWERED: 'quiz_question_answered',
  QUIZ_NEXT_CLICKED: 'quiz_next_clicked',
  QUIZ_PREVIOUS_CLICKED: 'quiz_previous_clicked',
  RESULT_SHARED: 'result_shared',
  CHOPPA_TRIGGERED: 'choppa_easter_egg',
} as const;

