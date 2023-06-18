import React from 'react';
import { SxProps } from '@mui/system';
import { Typography } from '@mui/material';

interface Props {
    value: number,
    component?: React.ElementType,
    sx?: SxProps,
}

export default function CurrencyValue(props: Props) {
    const {
        value,
        component,
        sx,
    } = props;

    return (
        <Typography component={component ?? 'span'} sx={sx} fontSize="inherit">
            {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
            }).format(value)}
        </Typography>
    );
}