import React from 'react';
import {
    ClickAwayListener,
    Tooltip,
    TooltipProps,
    tooltipClasses,
    IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
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
            <CustomWidthTooltip
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
            </CustomWidthTooltip>
        </ClickAwayListener>
    );
}

const ForwardRefTooltip = React.forwardRef(({ className, ...props }: TooltipProps, ref) => (
    <Tooltip ref={ref} {...props} classes={{ popper: className }} />
));

const CustomWidthTooltip = styled(ForwardRefTooltip)({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 500,
    },
});