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
import type { AuthContextType } from './auth.types';
import { defaultUserData } from './auth.types';
import { UPDATE_USER } from '../graphql/mutation/users';
import { notifications } from '@mantine/notifications';

export type { AuthContextType };

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
                avatar: payload.avatar,
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
                avatar: res?.data?.signup?.user?.avatar || '',
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
                    avatar: refetchedValues?.data?.me?.avatar || '',
                });
            } catch (error) {
                console.error('Silent login error:', error);
                logout();
                return;
            }
        }
    }, [refetch]);

    const [userMutate, { error, loading }] = useMutation(UPDATE_USER, {
        onError: error => {
            console.error('Update user error:', error);
            notifications.show({
                title: 'Error',
                message: error.message.includes('413')
                    ? 'Image too large'
                    : error.message,
                color: 'red',
            });
        },
    });
    const updateUser = useCallback(
        async (name: string, avatar: string) => {
            try {
                const res = await userMutate({
                    variables: { name, avatar },
                });
                console.log('Update user response:', res);
                if (!res.data?.updateUser) {
                    return;
                }
                setAuthStore(prev => ({
                    ...prev,
                    name: res.data.updateUser.name,
                    avatar: res.data.updateUser.avatar,
                }));
            } catch (e) {
                console.error('Update user error:', e);
            }
        },
        [userMutate]
    );

    useEffect(() => {
        silentLogin();
    }, [silentLogin]);

    return (
        <AuthContext.Provider
            value={{
                authStore,
                updateUser,
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
                    updateUser: {
                        loading,
                        error: error?.message || null,
                    },
                },
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
