import React from 'react';
import {
    ClickAwayListener,
    Tooltip,
    IconButton,
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
    const [open, setOpen] = React.useState(false);

    const closeHandler = () => {
        setOpen(false);
    };

    const openHandler = () => {
        setOpen(true);
    };

    return (
        <ClickAwayListener onClickAway={closeHandler}>
            <Tooltip
                title={title}
                open={open}
                arrow
                disableFocusListener
                disableHoverListener
                disableTouchListener
                sx={{
                    verticalAlign: 'middle',
                    ...sx,
                }}
                PopperProps={{
                    disablePortal: true,
                }}
                onClose={closeHandler}
            >
                <IconButton
                    onClick={openHandler}
                    onMouseOver={openHandler}
                    onMouseLeave={closeHandler}
                >
                    <HelpIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </ClickAwayListener>
    );
}