import type { Settings } from '../scripts/types/types';

export interface SettingsContextType {
    settings: Settings;
    updateSettings: (newSettings: Partial<Settings>) => void;
    resetSettings: () => void;
}

export const defaultSettings: Settings = {
    language: 'fr',
    morsePercent: 1,
    soundEnabled: true,
    volume: 0.5,
};
