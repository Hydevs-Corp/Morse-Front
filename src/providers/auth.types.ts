import type { AuthModel } from '../scripts/types/types';

export interface AuthContextType {
    authStore: AuthModel;
    state: {
        loading: boolean;
        error: string | null;
    };
    signin: (email: string, password: string) => void;
    signup: (email: string, password: string) => void;
    logout: () => void;
}

export const defaultUserData: AuthModel = {
    email: '',
    name: '',
    id: '',
    token: undefined,
};
