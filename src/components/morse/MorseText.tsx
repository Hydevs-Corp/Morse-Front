import { Text, type TextProps } from '@mantine/core';
import useMorse from '../../hook/useMorse';
import { useMemo, type ReactNode } from 'react';

const MorseText = (props: TextProps & { children: ReactNode }) => {
    const { handleRender } = useMorse();
    const children = useMemo(
        () =>
            typeof props.children !== 'string'
                ? props.children
                : handleRender(props.children),
        [props.children, handleRender]
    );

    return <Text {...props}>{children}</Text>;
};

export default MorseText;
