import React, {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from 'react';

interface Settings {
    language: string;
    soundEnabled: boolean;
    volume: number;
    morsePercent: number;
}

interface SettingsContextType {
    settings: Settings;
    updateSettings: (newSettings: Partial<Settings>) => void;
    resetSettings: () => void;
}

const defaultSettings: Settings = {
    language: 'fr',
    morsePercent: 1,
    soundEnabled: true,
    volume: 0.5,
};

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
        // console.log('Updating settings:', { newSettings, settings });
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

export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
