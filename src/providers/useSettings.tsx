import { useContext } from 'react';
import type { SettingsContextType } from './settings.types';
import { SettingsContext } from './SettingsProviders';

export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
