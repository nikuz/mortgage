import React, { useState, useRef, useCallback } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Grid,
} from '@mui/material';
import { SxProps } from '@mui/system';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    CurrencyField,
    PercentField,
    CurrencyValue,
    HelpIcon,
} from 'src/components';
import {
    calculateCompoundPercents,
    calculateCompoundPercentsSum,
    calculateCompoundPercentsWithContributions,
} from 'src/tools';

interface Props {
    savings: number,
    budget: number,
    budgetIncreaseRate: number,
    investmentReturnRate: number,
    years: number,
    sx?: SxProps,
}

export default function RentFeature(props: Props) {
    const {
        savings,
        budget,
        budgetIncreaseRate,
        investmentReturnRate,
        years,
        sx,
    } = props;
    const [rentPrice, setRentPrice] = useState(2685);
    const [rentAnnualIncrease, setRentAnnualIncrease] = useState(2);
    const [expanded, setExpanded] = useState(false);
    const fieldFocusState = useRef<boolean>(false);

    const calculateInvestmentBalance = useCallback((years: number) => {
        let result = savings;
        for (let i = 0; i < years; i++) {
            const rent = calculateCompoundPercents({
                value: rentPrice,
                percent: rentAnnualIncrease,
                years: i,
            });
            const adjustedBudget = calculateCompoundPercents({
                value: budget,
                percent: budgetIncreaseRate,
                years: i,
            });
            const investmentAmount = adjustedBudget - rent;
            result = calculateCompoundPercentsWithContributions({
                value: result,
                percent: investmentReturnRate,
                years: 1,
                contribution: Math.max(investmentAmount, 0),
            });
        }
        return result;
    }, [savings, budget, budgetIncreaseRate, rentPrice, rentAnnualIncrease, investmentReturnRate]);

    const accordionClickHandler = useCallback(() => {
        if (!fieldFocusState.current) {
            setExpanded(!expanded);
        }
    }, [expanded]);

    return (
        <Accordion expanded={expanded} sx={sx}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                onClick={accordionClickHandler}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                        <Typography variant="h6" sx={{ mr: 2 }}>Rent</Typography>
                        <Typography>
                            Overall expenses:&nbsp;
                            <CurrencyValue
                                value={-calculateCompoundPercentsSum({
                                    value: rentPrice * 12,
                                    percent: rentAnnualIncrease,
                                    years,
                                })}
                                sx={{ fontWeight: 'bold' }}
                            />
                        </Typography>
                        <Typography>
                            Balance in {years} years:&nbsp;
                            <CurrencyValue
                                value={calculateInvestmentBalance(years)}
                                sx={{ fontWeight: 'bold' }}
                            />
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <CurrencyField
                            label="Price"
                            value={rentPrice}
                            sx={{ m: 1, mr: 2 }}
                            onFocus={() => {
                                fieldFocusState.current = true;
                            }}
                            onBlur={() => {
                                fieldFocusState.current = false;
                            }}
                            onChange={setRentPrice}
                        />
                        <PercentField
                            label="Annual increase"
                            value={rentAnnualIncrease}
                            sx={{ m: 1, minWidth: '150px' }}
                            onFocus={() => {
                                fieldFocusState.current = true;
                            }}
                            onBlur={() => {
                                fieldFocusState.current = false;
                            }}
                            onChange={setRentAnnualIncrease}
                        />
                    </Grid>
                </Grid>
            </AccordionSummary>
            <AccordionDetails sx={{ overflow: 'auto' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Year</TableCell>
                            <TableCell>Monthly Budget</TableCell>
                            <TableCell align="right">Monthly rent</TableCell>
                            <TableCell align="right">Monthly Investment</TableCell>
                            <TableCell align="right">
                                Investment balance
                                <HelpIcon
                                    title="Savings as a start balance"
                                    sx={{ verticalAlign: 'middle', ml: 1 }}
                                />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[...Array(years)].map((item, key) => {
                            const rent = calculateCompoundPercents({
                                value: rentPrice,
                                percent: rentAnnualIncrease,
                                years: key,
                            });
                            const adjustedBudget = calculateCompoundPercents({
                                value: budget,
                                percent: budgetIncreaseRate,
                                years: key,
                            });
                            return (
                                <TableRow key={key} >
                                    <TableCell>
                                        <Typography sx={{ mr: 5 }} color="grey">
                                            {new Date().getFullYear() + key}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <CurrencyValue value={adjustedBudget} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <CurrencyValue value={rent} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <CurrencyValue value={Math.max(adjustedBudget - rent, 0)} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <CurrencyValue value={calculateInvestmentBalance(key + 1)} />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </AccordionDetails>
        </Accordion>
    );
}