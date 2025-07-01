import { modals } from '@mantine/modals';
import AuthModal from './AuthModal';
import MorseButton from '../morse/MorseButton';
import useMorse from '../../hook/useMorse';

const ButtonRegister = () => {
    const { handleRender } = useMorse();

    const openModal = () =>
        modals.open({
            title: handleRender('Register'),
            children: <AuthModal type="register" />,
        });

    return <MorseButton onClick={openModal}>Register</MorseButton>;
};

export default ButtonRegister;
