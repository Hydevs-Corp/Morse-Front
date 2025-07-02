import React, { createContext, useState, type ReactNode } from 'react';
import type { Settings } from '../scripts/types/types';
import type { SettingsContextType } from './settings.types';
import { defaultSettings } from './settings.types';

const SettingsContext = createContext<SettingsContextType | undefined>(
    undefined
);

interface SettingsProviderProps {
    children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({
    children,
}) => {
    const [settings, setSettings] = useState<Settings>(defaultSettings);

    const updateSettings = (newSettings: Partial<Settings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const resetSettings = () => {
        setSettings(defaultSettings);
    };

    const value: SettingsContextType = {
        settings,
        updateSettings,
        resetSettings,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export { SettingsContext };
