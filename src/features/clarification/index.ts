// Export the main container component
export { ClarificationContainer } from './components/clarification-container';

// Export the store for external use
export { useClarificationStore } from './store/clarificationStore';

// Export the hooks
export { useClarificationSession } from './hooks/useClarificationSession';

// Export types
export type { 
  Question,
  Answer,
  ClarificationSession,
  ClarificationState,
  StreamEvent 
} from './types'; 