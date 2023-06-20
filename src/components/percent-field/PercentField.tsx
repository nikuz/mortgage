import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { SxProps } from '@mui/system';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

interface Props {
    label?: string,
    value: number,
    min?: number,
    max?: number,
    disabled?: boolean,
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
        disabled,
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
            disabled={disabled}
            InputProps={{
                inputProps: { min: min ?? 0, max: max ?? 100 },
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                inputComponent: NumericFormatCustom as any,
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

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
    function NumericFormatCustom(props, ref) {
        const { onChange, ...other } = props;

        return (
            <NumericFormat
                {...other}
                getInputRef={ref}
                valueIsNumericString
                allowNegative
                onValueChange={(values) => {
                    onChange({
                        target: {
                            name: props.name,
                            value: values.value,
                        },
                    });
                }}
            />
        );
    },
);