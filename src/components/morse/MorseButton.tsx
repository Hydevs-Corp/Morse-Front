import { Button, type ButtonProps } from '@mantine/core';
import useMorse from '../../hook/useMorse';
import { useMemo } from 'react';

const MorseButton = (
    props: ButtonProps & {
        type?: 'button' | 'submit' | 'reset' | undefined;
        onClick?: () => void;
        children?: React.ReactNode;
    }
) => {
    const { handleRender } = useMorse();

    const text = useMemo(
        () =>
            typeof props.children === 'string'
                ? handleRender(props.children)
                : props.children,
        [props.children, handleRender]
    );

    return (
        <Button {...props} type={props.type}>
            {text}
        </Button>
    );
};

export default MorseButton;
