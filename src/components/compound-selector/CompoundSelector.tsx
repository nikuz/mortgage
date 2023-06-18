import React from 'react';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from '@mui/material';
import { SxProps } from '@mui/system';
import { Compound } from 'src/types';

interface Props {
    value: Compound,
    sx?: SxProps,
    onChange?: (value: Compound) => void,
}

export default function CompoundSelector(props: Props) {
    const {
        value,
        sx,
        onChange,
    } = props;

    return (
        <FormControl sx={sx}>
            <InputLabel id="compound-label">Compound</InputLabel>
            <Select
                labelId="compound-label"
                value={value}
                label="Compound"
                size="small"
                onChange={(event) => onChange?.(event.target.value as Compound)}
            >
                <MenuItem value="annually">Annually</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
        </FormControl>
    );
}