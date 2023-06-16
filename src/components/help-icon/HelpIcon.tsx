import React from 'react';
import {
    Tooltip,
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help'
import { SxProps } from '@mui/system';

interface Props {
    title: React.ReactNode,
    sx?: SxProps,
}

export default function HelpIconComponent(props: Props) {
    const {
        title,
        sx,
    } = props;

    return (
        <Tooltip title={title} sx={sx}>
            <HelpIcon fontSize="small" />
        </Tooltip>
    );
}