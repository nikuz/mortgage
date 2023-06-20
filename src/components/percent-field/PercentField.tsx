import React, { useState, useCallback, useEffect } from 'react';
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
    const [onMobileScreen, setOnMobileScreen] = useState(false);

    const isOnMobile = useCallback(() => (
        Math.min(window.innerWidth, window.innerHeight) < 768
    ), []);

    const handleWindowSizeChange = useCallback(() => {
        const isOnMobileNow = isOnMobile();
        if (isOnMobileNow !== onMobileScreen) {
            setOnMobileScreen(isOnMobileNow);
        }
    }, [onMobileScreen, isOnMobile]);

    useEffect(() => {
        handleWindowSizeChange();
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, [handleWindowSizeChange]);

    return (
        <TextField
            label={label}
            value={value}
            type={onMobileScreen ? 'string' : 'number'}
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