import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { SxProps } from '@mui/system';

interface Props {
    label?: string,
    value: number,
    sx?: SxProps,
    onChange: (value: number) => void,
    onFocus?: () => void,
    onBlur?: () => void,
}

export default function PercentField(props: Props) {
    const {
        label,
        value,
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
                inputProps: { min: 0, max: 100 },
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