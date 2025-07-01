import { Checkbox, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import MorseButton from '../morse/MorseButton';
import MorseInput from '../morse/MorseInput';
import useMorse from '../../hook/useMorse';
import { useAuth } from '../../providers/useAuth';

const AuthModal = ({ type }: { type: 'login' | 'register' }) => {
    const { handleRender } = useMorse();
    const { signin, signup, state } = useAuth();

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
            termsOfService: false,
        },

        validate: {
            email: value => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: value =>
                value.length >= 6
                    ? null
                    : 'Password must be at least 6 characters long',
            termsOfService: value =>
                type !== 'register' || value
                    ? null
                    : 'You must agree to the terms of service',
        },
    });

    const handleSubmit = (values: {
        email: string;
        password: string;
        termsOfService: boolean;
    }) => {
        console.log('Form submitted with values:', values);
        if (type === 'login') {
            signin(values.email, values.password);
        } else if (type === 'register') {
            if (values.termsOfService) {
                signup(values.email, values.password);
            }
        }
    };

    return (
        <div>
            <form onSubmit={form.onSubmit(values => handleSubmit(values))}>
                <MorseInput
                    withAsterisk={type === 'register'}
                    label="Email"
                    placeholder="your@email.com"
                    key={form.key('email')}
                    {...form.getInputProps('email')}
                />
                <MorseInput
                    withAsterisk={type === 'register'}
                    label="Password"
                    placeholder="123456789"
                    type="password"
                    key={form.key('password')}
                    {...form.getInputProps('password')}
                />

                {type === 'register' && (
                    <Checkbox
                        mt="md"
                        label={handleRender('I agree to sell my privacy')}
                        key={form.key('termsOfService')}
                        {...form.getInputProps('termsOfService', {
                            type: 'checkbox',
                        })}
                    />
                )}

                <Group justify="flex-end" mt="md">
                    <MorseButton type="submit" loading={state.loading}>
                        {type === 'login' ? 'Login' : 'Register'}
                    </MorseButton>
                </Group>
            </form>
        </div>
    );
};

export default AuthModal;
