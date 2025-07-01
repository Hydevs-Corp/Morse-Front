import { modals } from '@mantine/modals';
import AuthModal from './AuthModal';
import useMorse from '../../hook/useMorse';
import MorseButton from '../morse/MorseButton';

const ButtonLogin = () => {
    const { handleRender } = useMorse();
    const openModal = () =>
        modals.open({
            title: handleRender('Login'),
            children: <AuthModal type="login" />,
        });

    return <MorseButton onClick={openModal}>Login</MorseButton>;
};

export default ButtonLogin;
