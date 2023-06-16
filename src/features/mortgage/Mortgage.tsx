import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Grid,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from '@mui/material';
import { SxProps } from '@mui/system';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    CurrencyField,
    PercentField,
    CurrencyValue, HelpIcon,
} from 'src/components';
import {
    calculateCompoundPercents,
    calculateCompoundPercentsSum,
    calculateCompoundPercentsWithContributions,
    calculateMortgagePayment,
} from 'src/tools';

interface Props {
    savings: number,
    budget: number,
    budgetIncreaseRate: number,
    investmentReturnRate: number,
    years: number,
    sx?: SxProps,
}

export default function MortgageFeature(props: Props) {
    const {
        savings,
        budget,
        budgetIncreaseRate,
        investmentReturnRate,
        years,
        sx,
    } = props;
    const [housePrice, setHousePrice] = useState(950000);
    const [interestRate, setInterestRate] = useState(5);
    const [strata, setStrata] = useState(500);
    const [strataAnnualIncrease, setStrataAnnualIncrease] = useState(3);
    const [taxes, setTaxes] = useState(1500);
    const [taxesAnnualIncrease, setTaxesAnnualIncrease] = useState(4.4);
    const [housePriceAnnualIncrease, setHousePriceAnnualIncrease] = useState(2);
    const [houseMaintenance, setHouseMaintenance] = useState(1);
    const [expanded, setExpanded] = useState(false);
    const fieldFocusState = useRef<boolean>(false);
    const monthlyPayment = useMemo(() => calculateMortgagePayment({
        housePrice,
        downPayment: savings,
        interestRate,
        years,
    }), [housePrice, savings, interestRate, years]);
    const interest = useMemo(() => (
        monthlyPayment * 12 * years - (housePrice - savings)
    ), [housePrice, savings, years, monthlyPayment]);
    const totalStrata = useMemo(() => calculateCompoundPercentsSum({
        value: strata * 12,
        percent: strataAnnualIncrease,
        years: years,
    }), [strata, strataAnnualIncrease, years]);
    const totalTaxes = useMemo(() => calculateCompoundPercentsSum({
        value: taxes,
        percent: taxesAnnualIncrease,
        years: years,
    }), [taxes, taxesAnnualIncrease, years]);
    const totalHouseMaintenance = useMemo(() => {
        let result = 0;
        for (let i = 0; i < years; i++) {
            const price = calculateCompoundPercents({
                value: housePrice,
                percent: housePriceAnnualIncrease,
                years: i,
            });
            result += price * (houseMaintenance / 100);
        }
        return result;
    }, [houseMaintenance, housePriceAnnualIncrease, housePrice, years]);
    const finalHousePrice = useMemo(() => calculateCompoundPercents({
        value: housePrice,
        percent: housePriceAnnualIncrease,
        // reduce the amount of years by one, to not
        // count the first year when you bought a house,
        // the house price will increase next year
        years: years - 1,
    }), [housePrice, housePriceAnnualIncrease, years]);
    const overallExpenses = useMemo(() => (
        interest + totalStrata + totalTaxes + totalHouseMaintenance
    ), [interest, totalStrata, totalTaxes, totalHouseMaintenance]);

    const getMonthlyStrataCoast = useCallback((year: number) => calculateCompoundPercents({
        value: strata,
        percent: strataAnnualIncrease,
        years: year,
    }), [strata, strataAnnualIncrease]);

    const getMonthlyTaxes = useCallback((year: number) => {
        const yearlyTaxes = calculateCompoundPercents({
            value: taxes,
            percent: taxesAnnualIncrease,
            years: year,
        });
        return yearlyTaxes / 12;
    }, [taxes, taxesAnnualIncrease]);

    const getMonthlyMaintenance = useCallback((year: number) => {
        const yearlyHousePrice = calculateCompoundPercents({
            value: housePrice,
            percent: housePriceAnnualIncrease,
            years: year,
        });
        return yearlyHousePrice * (houseMaintenance / 100) / 12;
    }, [housePrice, houseMaintenance, housePriceAnnualIncrease]);

    const calculateMonthlyExpenses = useCallback((year: number) => {
        const strataCoast = getMonthlyStrataCoast(year);
        const monthlyTaxes = getMonthlyTaxes(year);
        const maintenance = getMonthlyMaintenance(year);
        return monthlyPayment + strataCoast + monthlyTaxes + maintenance;
    }, [monthlyPayment, getMonthlyStrataCoast, getMonthlyTaxes, getMonthlyMaintenance]);

    const calculateMonthlyInvestment = useCallback((year: number) => {
        const expenses = calculateMonthlyExpenses(year);
        const adjustedBudget = calculateCompoundPercents({
            value: budget,
            percent: budgetIncreaseRate,
            years: year,
        });

        return Math.max(adjustedBudget - expenses, 0);
    }, [budget, budgetIncreaseRate, calculateMonthlyExpenses]);

    const calculateInvestmentBalance = useCallback((years: number) => {
        let result = 0;
        for (let i = 0; i <= years; i++) {
            result = calculateCompoundPercentsWithContributions({
                value: result,
                percent: investmentReturnRate,
                years: 1,
                contribution: calculateMonthlyInvestment(i),
            });
        }
        return result;
    }, [investmentReturnRate, calculateMonthlyInvestment]);

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
                        <Typography variant="h6" sx={{ mr: 2 }}>Mortgage</Typography>
                        <Typography>
                            Monthly payment:&nbsp;
                            <CurrencyValue
                                value={monthlyPayment}
                                sx={{ fontWeight: 'bold' }}
                            />
                        </Typography>
                        <Typography>
                            Overall expenses:&nbsp;
                            <CurrencyValue
                                value={-overallExpenses}
                                sx={{ fontWeight: 'bold' }}
                            />
                        </Typography>
                        <Typography>
                            Balance in {years} years:&nbsp;
                            <CurrencyValue
                                value={calculateInvestmentBalance(years) + finalHousePrice}
                                sx={{ fontWeight: 'bold' }}
                            />
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <CurrencyField
                            label="House Price"
                            value={housePrice}
                            sx={{ m: 1, mr: 2 }}
                            onFocus={() => {
                                fieldFocusState.current = true;
                            }}
                            onBlur={() => {
                                fieldFocusState.current = false;
                            }}
                            onChange={setHousePrice}
                        />
                        <CurrencyField
                            label="Down payment"
                            value={savings}
                            disabled={true}
                            sx={{ m: 1, mr: 2 }}
                        />
                    </Grid>
                </Grid>
            </AccordionSummary>
            <AccordionDetails sx={{ overflow: 'auto' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell align="right">Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{ pl: 0 }}>
                                <PercentField
                                    label="Interest rate"
                                    value={interestRate}
                                    sx={{ m: 1, minWidth: '150px' }}
                                    onChange={setInterestRate}
                                />
                            </TableCell>
                            <TableCell align="right">
                                <CurrencyValue value={interest} />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ pl: 0 }}>
                                <CurrencyField
                                    label="Strata"
                                    value={strata}
                                    sx={{ m: 1, mr: 2, width: '150px' }}
                                    onChange={setStrata}
                                />
                                <PercentField
                                    label="Annual increase"
                                    value={strataAnnualIncrease}
                                    sx={{ m: 1, width: '150px' }}
                                    onChange={setStrataAnnualIncrease}
                                />
                            </TableCell>
                            <TableCell align="right">
                                <CurrencyValue value={totalStrata} />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ pl: 0 }}>
                                <CurrencyField
                                    label="Property Tax"
                                    value={taxes}
                                    sx={{ m: 1, mr: 2, width: '150px' }}
                                    onChange={setTaxes}
                                />
                                <PercentField
                                    label="Annual increase"
                                    value={taxesAnnualIncrease}
                                    sx={{ m: 1, width: '150px' }}
                                    onChange={setTaxesAnnualIncrease}
                                />
                            </TableCell>
                            <TableCell align="right">
                                <CurrencyValue value={totalTaxes} />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ pl: 0 }}>
                                <PercentField
                                    label="Maintnance"
                                    value={houseMaintenance}
                                    sx={{ m: 1, width: '150px' }}
                                    onChange={setHouseMaintenance}
                                />
                            </TableCell>
                            <TableCell align="right">
                                <CurrencyValue value={totalHouseMaintenance} />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ pl: 0 }}>
                                <PercentField
                                    label="House price annual increase"
                                    value={housePriceAnnualIncrease}
                                    sx={{ m: 1, mr: 2, width: '150px' }}
                                    onChange={setHousePriceAnnualIncrease}
                                />
                            </TableCell>
                            <TableCell align="right">
                                <CurrencyValue value={finalHousePrice} />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Year</TableCell>
                            <TableCell>Monthly Budget</TableCell>
                            <TableCell>Monthly Expenses</TableCell>
                            <TableCell align="right">Monthly Investment</TableCell>
                            <TableCell align="right">Investment balance</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[...Array(years)].map((item, key) => {
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
                                    <TableCell>
                                        <CurrencyValue
                                            value={calculateMonthlyExpenses(key)}
                                            sx={{ verticalAlign: 'middle' }}
                                        />
                                        <HelpIcon
                                            title={(
                                                <Box>
                                                    <Typography>
                                                        Mortgage:&nbsp;
                                                        <CurrencyValue value={monthlyPayment} />
                                                    </Typography>
                                                    <Typography>
                                                        Strata:&nbsp;
                                                        <CurrencyValue value={getMonthlyStrataCoast(key)} />
                                                    </Typography>
                                                    <Typography>
                                                        Taxes:&nbsp;
                                                        <CurrencyValue value={getMonthlyTaxes(key)} />
                                                    </Typography>
                                                    <Typography>
                                                        Maintenance:&nbsp;
                                                        <CurrencyValue value={getMonthlyMaintenance(key)} />
                                                    </Typography>
                                                </Box>
                                            )}
                                            sx={{ verticalAlign: 'middle', ml: 1 }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <CurrencyValue value={calculateMonthlyInvestment(key)} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <CurrencyValue value={calculateInvestmentBalance(key)} />
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