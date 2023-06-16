import React, { useState, useRef, useMemo, useCallback } from 'react';
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
import CurrencyField from '../../components/currency-field';
import PercentField from '../../components/percent-field';
import CurrencyValue from '../../components/currency-value';
import {
    calculateCompoundPercents,
    calculateCompoundPercentsWithContributions,
    calculateMortgagePayment,
} from '../../tools';
import {
    RentValues,
    MortgageValues,
    InvestmentValues,
} from '../../types';

interface Props {
    years: number,
    values: InvestmentValues,
    rentValues: RentValues,
    mortgageValues: MortgageValues,
    sx?: SxProps,
    onValuesChange: (value: InvestmentValues) => void,
}

export default function InvestmentComponent(props: Props) {
    const {
        years,
        values,
        rentValues,
        mortgageValues,
        sx,
        onValuesChange,
    } = props;
    const [expanded, setExpanded] = useState(false);
    const [additionalContribution, setAdditionalContribution] = useState(0);
    const fieldFocusState = useRef<boolean>(false);
    const mortgageMonthlyPayment = useMemo(() => calculateMortgagePayment({
        ...mortgageValues,
        years,
    }), [mortgageValues, years]);

    const calculateInvestmentBalance = useCallback((years: number) => {
        let result = values.startingAmount;
        for (let i = 0; i < years; i++) {
            const rent = calculateCompoundPercents({
                value: rentValues.price,
                percent: rentValues.annualIncrease,
                years: i,
            });
            const remainingForInvestment = mortgageMonthlyPayment - rent;
            result = calculateCompoundPercentsWithContributions({
                value: result,
                percent: values.returnRate,
                years: 1,
                contribution: Math.max(remainingForInvestment, 0) + additionalContribution,
            });
        }
        return result;
    }, [rentValues, values, mortgageMonthlyPayment, additionalContribution]);

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
                        <Typography variant="h6" sx={{ mr: 2 }}>Investment</Typography>
                        <Typography>
                            Total:&nbsp;
                            <CurrencyValue value={calculateInvestmentBalance(years)} />
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <CurrencyField
                            label="Starting balance"
                            value={values.startingAmount}
                            sx={{ m: 1, mr: 2 }}
                            onFocus={() => {
                                fieldFocusState.current = true;
                            }}
                            onBlur={() => {
                                fieldFocusState.current = false;
                            }}
                            onChange={(value: number) => {
                                onValuesChange({
                                    ...values,
                                    startingAmount: value,
                                });
                            }}
                        />
                        <PercentField
                            label="Return rate"
                            value={values.returnRate}
                            sx={{ m: 1, mr: 2, minWidth: '150px' }}
                            onFocus={() => {
                                fieldFocusState.current = true;
                            }}
                            onBlur={() => {
                                fieldFocusState.current = false;
                            }}
                            onChange={(value) => {
                                onValuesChange({
                                    ...values,
                                    returnRate: value,
                                });
                            }}
                        />
                        <CurrencyField
                            label="Additional contribution"
                            value={additionalContribution}
                            sx={{ m: 1, mr: 2 }}
                            onFocus={() => {
                                fieldFocusState.current = true;
                            }}
                            onBlur={() => {
                                fieldFocusState.current = false;
                            }}
                            onChange={setAdditionalContribution}
                        />
                    </Grid>
                </Grid>
            </AccordionSummary>
            <AccordionDetails>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Year</TableCell>
                            <TableCell align="right">Contribution</TableCell>
                            <TableCell align="right">Balance</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[...Array(years)].map((item, key) => {
                            const rent = calculateCompoundPercents({
                                value: rentValues.price,
                                percent: rentValues.annualIncrease,
                                years: key,
                            });
                            const remainingForInvestment = Math.max(mortgageMonthlyPayment - rent, 0);

                            return (
                                <TableRow key={key} >
                                    <TableCell>
                                        <Typography sx={{ mr: 5 }} color="grey">
                                            {new Date().getFullYear() + key}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <CurrencyValue value={remainingForInvestment} />
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