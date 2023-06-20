import React from 'react';
import { TextField } from '@mui/material';
import { SxProps } from '@mui/system';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

interface Props {
    label?: string,
    value: number,
    disabled?: boolean,
    sx?: SxProps,
    onChange?: (value: number) => void,
    onFocus?: () => void,
    onBlur?: () => void,
}

export default function CurrencyField(props: Props) {
    const {
        label,
        value,
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
            variant="outlined"
            size="small"
            disabled={disabled}
            InputProps={{
                inputComponent: NumericFormatCustom as any,
            }}
            sx={sx}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={(event) => {
                onChange?.(Number(event.target.value));
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
                thousandSeparator
                valueIsNumericString
                suffix="$"
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