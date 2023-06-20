import React, { useState, useCallback, useEffect } from 'react';
import {
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Grid,
} from '@mui/material';
import { SxProps } from '@mui/system';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    CurrencyField,
    NumericField,
    CurrencyValue,
    HelpIcon,
} from 'src/components';
import {
    calculateCompoundPercents,
    calculateCompoundPercentsSum,
    calculateCompoundPercentsWithContributions,
} from 'src/tools';
import { Compound } from 'src/types';

interface Props {
    savings: number,
    budget: number,
    budgetIncreaseRate: number,
    investmentReturnRate: number,
    compound: Compound,
    years: number,
    sx?: SxProps,
}

export default function RentFeature(props: Props) {
    const {
        savings,
        budget,
        budgetIncreaseRate,
        investmentReturnRate,
        compound,
        years,
        sx,
    } = props;
    const [rentPrice, setRentPrice] = useState(0);
    const [rentAnnualIncrease, setRentAnnualIncrease] = useState(0);

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
                compound,
            });
        }
        return result;
    }, [savings, budget, budgetIncreaseRate, rentPrice, rentAnnualIncrease, investmentReturnRate, compound]);

    const setRentPriceHandler = useCallback((value: number) => {
        setRentPrice(value);
        window?.localStorage.setItem('rent', value.toString());
    }, []);

    const setRentAnnualIncreaseHandler = useCallback((value: number) => {
        setRentAnnualIncrease(value);
        window?.localStorage.setItem('rentAnnualIncrease', value.toString());
    }, []);

    useEffect(() => {
        const localStorage = window?.localStorage;
        if (localStorage) {
            const rentPrice = localStorage.getItem('rent');
            if (rentPrice) {
                setRentPrice(Number(rentPrice));
            }
            const rentAnnualIncrease = localStorage.getItem('rentAnnualIncrease');
            if (rentAnnualIncrease) {
                setRentAnnualIncrease(Number(rentAnnualIncrease));
            }
        }
    }, []);

    return (
        <Accordion sx={sx}>
            <AccordionSummary>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" sx={{ mr: 2 }}>Rent</Typography>
                        <Typography>
                            Overall expenses:&nbsp;
                            <CurrencyValue
                                value={-calculateCompoundPercentsSum({
                                    value: rentPrice * 12,
                                    percent: rentAnnualIncrease,
                                    years,
                                })}
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
                    <Grid item xs={12} sm={7}>
                        <CurrencyField
                            label="Price"
                            value={rentPrice}
                            sx={{ m: 1, mr: 2 }}
                            onChange={setRentPriceHandler}
                        />
                        <NumericField
                            label="Annual increase"
                            value={rentAnnualIncrease}
                            adornment="%"
                            sx={{ m: 1, minWidth: '150px' }}
                            onChange={setRentAnnualIncreaseHandler}
                        />
                    </Grid>
                </Grid>
            </AccordionSummary>
            <AccordionDetails>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Year</TableCell>
                            <TableCell>Monthly Budget</TableCell>
                            <TableCell align="right">Monthly rent</TableCell>
                            <TableCell align="right">Monthly Investment</TableCell>
                            <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                                Investment balance
                                <HelpIcon
                                    title={
                                        <Typography>
                                            Savings as a starting balance&nbsp;
                                            <CurrencyValue value={savings} />
                                        </Typography>
                                    }
                                />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[...Array(Math.max(years, 0))].map((item, key) => {
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