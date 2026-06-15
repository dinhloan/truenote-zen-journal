export type ScreenType = 'today' | 'verification' | 'integration' | 'map' | 'settings';

export interface FactItem {
  id: string;
  text: string;
}

export interface AwarenessTrace {
  id: string;
  date: string;
  time: string;
  title: string;
  summary: string;
  isCompleted: boolean;
  tags: string[];
}

export interface JournalState {
  // Today's session data
  journalText: string;
  
  // Verification data
  originalBelief: string;
  facts: FactItem[];
  beliefIntensity: number; // 1 to 5
  evidence: string;
  alternatives: string;
  conclusionChecked: 'enough' | 'not_enough' | 'unsure';
  finalConclusion: string;

  // Integration data
  oldBelief: string;
  newAwarenessText: string;
  awarenessTodayText: string;
  rememberText: string;
  tags: string[];

  // Saved cognitive traces/history
  traces: AwarenessTrace[];
}
