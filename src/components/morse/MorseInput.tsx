import { TextInput, type TextInputProps } from '@mantine/core';
import useMorse from '../../hook/useMorse';
import { useMemo } from 'react';

const MorseInput = (props: TextInputProps) => {
    const { handleRender } = useMorse();

    const label = useMemo(
        () =>
            typeof props.label === 'string'
                ? handleRender(props.label)
                : props.label,
        [props.label, handleRender]
    );
    const placeholder = useMemo(
        () => handleRender(props.placeholder ?? ''),
        [props.placeholder, handleRender]
    );

    return <TextInput {...props} label={label} placeholder={placeholder} />;
};

export default MorseInput;
