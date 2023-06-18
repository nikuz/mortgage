import React, { useState } from 'react';
import {
    Box,
    Typography,
    Link,
    TextField,
} from '@mui/material';
import { SxProps } from '@mui/system';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    CurrencyField,
    PercentField,
    CurrencyValue,
    CompoundSelector,
} from 'src/components';
import { calculateCompoundPercentsWithContributions } from 'src/tools';
import { Compound } from 'src/types';

interface Props {
    sx?: SxProps,
}

export default function InvestmentFeature(props: Props) {
    const {
        sx,
    } = props;
    const [startingAmount, setStartingAmount] = useState(0);
    const [monthlyContribution, setMonthlyContribution] = useState(0);
    const [years, setYears] = useState(0);
    const [returnRate, setReturnRate] = useState(0);
    const [compound, setCompound] = useState<Compound>('annually');

    return (
        <Accordion sx={sx}>
            <AccordionSummary>
                <Box>
                    <Typography variant="h6" sx={{ mr: 2 }}>Investment</Typography>
                    <Link
                        href="https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator"
                        target="_blank"
                    >
                        Reference Calculator
                    </Link>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Box sx={{ mb: 2, mr: 2 }}>
                    <CurrencyField
                        label="Starting Amount"
                        value={startingAmount}
                        sx={{ width: '150px' }}
                        onChange={setStartingAmount}
                    />
                </Box>
                <Box sx={{ mb: 2, mr: 2 }}>
                    <CurrencyField
                        label="Monthly contribution"
                        value={monthlyContribution}
                        sx={{ width: '150px' }}
                        onChange={setMonthlyContribution}
                    />
                </Box>
                <Box sx={{ mb: 2, mr: 2 }}>
                    <TextField
                        label="Years"
                        value={years}
                        type="number"
                        variant="outlined"
                        size="small"
                        InputProps={{ inputProps: { min: 1 } }}
                        sx={{ width: '100px' }}
                        onChange={(event) => {
                            setYears(Number(event.target.value));
                        }}
                    />
                </Box>
                <Box sx={{ mb: 2, mr: 2 }}>
                    <PercentField
                        label="Return Rate"
                        value={returnRate}
                        sx={{ minWidth: '150px' }}
                        onChange={setReturnRate}
                    />
                </Box>
                <Box sx={{ mb: 2, mr: 2 }}>
                    <CompoundSelector
                        value={compound}
                        sx={{ mb: 2, mr: 2 }}
                        onChange={setCompound}
                    />
                </Box>

                <Typography>
                    In
                    <Typography component="mark" sx={{ ml: 1, mr: 1 }}>
                        {years}
                    </Typography>
                    years, you will have
                    <CurrencyValue
                        value={calculateCompoundPercentsWithContributions({
                            value: startingAmount,
                            percent: returnRate,
                            years: years,
                            contribution: monthlyContribution,
                            compound: compound,
                        })}
                        component="mark"
                        sx={{ ml: 1 }}
                    />
                </Typography>
            </AccordionDetails>
        </Accordion>
    );
}