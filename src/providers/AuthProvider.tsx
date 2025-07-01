import { useMutation, useQuery, type FetchResult } from '@apollo/client';
import { modals } from '@mantine/modals';
import { GraphQLError } from 'graphql';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import signin_MUTATE from '../graphql/mutation/Signin';
import signup_MUTATE from '../graphql/mutation/Signup';
import getMe_QUERY from '../graphql/query/getMe';
import type { AuthModel } from '../scripts/types/types';
import { AuthContext } from './AuthContext';
import { parseJwt } from './parseJwt';

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

const defaultUserData: AuthModel = {
    email: '',
    name: '',
    id: '',
    token: undefined,
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authStore, setAuthStore] = useState<AuthModel>(defaultUserData);

    const [loginMutate, { error: loginError, loading: loginLoading }] =
        useMutation(signin_MUTATE);
    const signin = async (
        email: string,
        password: string
    ): Promise<FetchResult<string> | void> => {
        try {
            const res = await loginMutate({
                variables: { email, password },
            });

            const tokenJWT = res.data?.signin;
            console.log('Login response:', res);
            if (!tokenJWT) {
                return {
                    errors: [new GraphQLError('Invalid email or password')],
                };
            }
            const payload = parseJwt(tokenJWT);
            setAuthStore({
                email: payload.email,
                token: tokenJWT,
                id: payload.sub.toString(),
                name: payload.email.split('@')[0],
            });
            console.log('Parsed JWT payload:', payload);
            localStorage.setItem('token', tokenJWT);
            modals.closeAll();
            return res;
        } catch (e) {
            console.error('Login error:', e);
            return {
                errors: [new GraphQLError('Invalid email or password')],
            };
        }
    };

    const [registerMutate, { error: registerError, loading: registerLoading }] =
        useMutation(signup_MUTATE);
    const signup = async (email: string, password: string) => {
        try {
            const res = await registerMutate({
                variables: { email, password, name: email.split('@')[0] },
            });

            setAuthStore({
                email: res?.data?.signup?.user?.email || '',
                token: res?.data?.signup?.token || '',
                id: res?.data?.signup?.user?.id || -1,
                name: res?.data?.signup?.user?.name || '',
            });

            localStorage.setItem('token', res?.data?.login || '');
            modals.closeAll();
            return res;
        } catch (e) {
            console.error('Signup error:', e);

            return {
                errors: [new GraphQLError('Invalid username or password')],
            };
        }
    };

    const logout = async () => {
        try {
            setAuthStore(defaultUserData);
            localStorage.removeItem('token');
        } catch (error) {
            return error;
        }
    };

    const {
        loading: loadingMe,
        error: errorMe,
        refetch,
    } = useQuery(getMe_QUERY);

    const silentLogin = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const refetchedValues = await refetch();
                setAuthStore({
                    email: refetchedValues?.data?.me?.email || '',
                    token,
                    id: refetchedValues?.data?.me?.id,
                    name: refetchedValues?.data?.me?.name || '',
                });
            } catch (error) {
                console.error('Silent login error:', error);
                logout();
                return;
            }
        }
    }, [refetch]);

    useEffect(() => {
        silentLogin();
    }, [silentLogin]);

    return (
        <AuthContext.Provider
            value={{
                authStore,
                signup,
                signin,
                logout,
                state: {
                    error:
                        loginError?.message ||
                        registerError?.message ||
                        errorMe?.message ||
                        null,
                    loading: registerLoading || loginLoading || loadingMe,
                },
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
