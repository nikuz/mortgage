import React, { useState, useContext, useCallback } from 'react';
import {
    Accordion as MaterialAccordion,
    AccordionSummary as MaterialAccordionSummary,
    AccordionDetails as MaterialAccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SxProps } from '@mui/system';

interface Props {
    children: NonNullable<React.ReactNode>,
    sx?: SxProps,
}

export default function AccordionComponent(props: Props) {
    const {
        children,
        sx,
    } = props;
    const [expanded, setExpanded] = useState(false);

    const expandToggleHandler = useCallback((event: React.MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.nodeName !== 'A' && !target.closest('.MuiTextField-root')) {
            setExpanded(!expanded);
        }
    }, [expanded]);

    return (
        <AccordionContext.Provider
            value={{
                onSummaryClick: expandToggleHandler,
            }}
        >
            <MaterialAccordion
                expanded={expanded}
                sx={{
                    '& .MuiAccordionSummary-expandIconWrapper': {
                        alignSelf: 'flex-start',
                    },
                    ...sx,
                }}
            >
                {children}
            </MaterialAccordion>
        </AccordionContext.Provider>
    );
}

interface AccordionContextType {
    onSummaryClick?: (event: React.MouseEvent) => void,
}

export const AccordionContext = React.createContext<AccordionContextType>({});

export function AccordionSummary(props: { children: React.ReactNode }) {
    const context = useContext(AccordionContext);
    return (
        <MaterialAccordionSummary
            expandIcon={(
                <ExpandMoreIcon sx={{ margin: '20px 0' }} />
            )}
            onClick={context?.onSummaryClick}
        >
            {props.children}
        </MaterialAccordionSummary>
    );
}

export function AccordionDetails(props: { children: React.ReactNode }) {
    return (
        <MaterialAccordionDetails sx={{ overflow: 'auto' }}>
            {props.children}
        </MaterialAccordionDetails>
    );
}