import { Title, type TitleProps } from '@mantine/core';
import useMorse from '../../hook/useMorse';
import { useMemo, type ReactNode } from 'react';

const MorseTitle = (props: TitleProps & { children: ReactNode }) => {
    const { handleRender } = useMorse();
    const children = useMemo(
        () =>
            typeof props.children !== 'string'
                ? props.children
                : handleRender(props.children),
        [props.children, handleRender]
    );

    return <Title {...props}>{children}</Title>;
};

export default MorseTitle;
