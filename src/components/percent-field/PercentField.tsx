import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { SxProps } from '@mui/system';

interface Props {
    label?: string,
    value: number,
    min?: number,
    max?: number,
    sx?: SxProps,
    onChange: (value: number) => void,
    onFocus?: () => void,
    onBlur?: () => void,
}

export default function PercentField(props: Props) {
    const {
        label,
        value,
        min,
        max,
        sx,
        onChange,
        onFocus,
        onBlur,
    } = props;

    return (
        <TextField
            label={label}
            value={value}
            type="number"
            variant="outlined"
            size="small"
            InputProps={{
                inputProps: { min: min ?? 0, max: max ?? 100 },
                endAdornment: <InputAdornment position="end">%</InputAdornment>
            }}
            sx={sx}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={(event) => {
                onChange(Number(event.target.value));
            }}
        />
    );
}