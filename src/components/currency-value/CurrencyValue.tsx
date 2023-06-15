import React from 'react';
import { SxProps } from '@mui/system';
import { Typography } from '@mui/material';

interface Props {
    value: number,
    sx?: SxProps,
}

export default function CurrencyValue(props: Props) {
    const {
        value,
        sx,
    } = props;

    return (
        <Typography component="span" sx={sx}>
            {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
            }).format(value)}
        </Typography>
    );
}