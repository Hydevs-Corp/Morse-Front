import { Tooltip, type TooltipProps } from '@mantine/core';
import useMorse from '../../hook/useMorse';
import { useMemo } from 'react';

const MorseTooltip = (props: TooltipProps) => {
    const { handleRender } = useMorse();

    const label = useMemo(
        () =>
            typeof props.label === 'string'
                ? handleRender(props.label)
                : props.label,
        [props.label, handleRender]
    );

    return <Tooltip {...props} label={label} />;
};

export default MorseTooltip;
