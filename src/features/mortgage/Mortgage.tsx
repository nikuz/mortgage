import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from '@mui/material';
import { SxProps } from '@mui/system';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    CurrencyField,
    PercentField,
    CurrencyValue,
    HelpIcon,
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
    const [housePrice, setHousePrice] = useState(0);
    const [downPayment, setDownPayment] = useState(0);
    const [interestRate, setInterestRate] = useState(5);
    const [strata, setStrata] = useState(0);
    const [strataAnnualIncrease, setStrataAnnualIncrease] = useState(3);
    const [taxes, setTaxes] = useState(0);
    const [taxesAnnualIncrease, setTaxesAnnualIncrease] = useState(4.4);
    const [housePriceAnnualIncrease, setHousePriceAnnualIncrease] = useState(5);
    const [houseMaintenance, setHouseMaintenance] = useState(1);
    const monthlyPayment = useMemo(() => calculateMortgagePayment({
        housePrice,
        downPayment,
        interestRate,
        years,
    }), [housePrice, downPayment, interestRate, years]);
    const interest = useMemo(() => {
        if (monthlyPayment === 0 || downPayment >= housePrice) {
            return 0;
        }
        return monthlyPayment * 12 * years - (housePrice - downPayment);
    }, [housePrice, downPayment, years, monthlyPayment]);
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
        let result = Math.max(savings - downPayment, 0); // starting balance
        for (let i = 0; i <= years; i++) {
            result = calculateCompoundPercentsWithContributions({
                value: result,
                percent: investmentReturnRate,
                years: 1,
                contribution: calculateMonthlyInvestment(i),
            });
        }
        return result;
    }, [savings, downPayment, investmentReturnRate, calculateMonthlyInvestment]);

    const setHousePriceHandler = useCallback((value: number) => {
        setHousePrice(value);
        window?.localStorage.setItem('housePrice', value.toString());
    }, []);

    const setDownPaymentHandler = useCallback((value: number) => {
        setDownPayment(value);
        window?.localStorage.setItem('downPayment', value.toString());
    }, []);

    const setInterestRateHandler = useCallback((value: number) => {
        setInterestRate(value);
        window?.localStorage.setItem('interestRate', value.toString());
    }, []);

    const setStrataHandler = useCallback((value: number) => {
        setStrata(value);
        window?.localStorage.setItem('strata', value.toString());
    }, []);

    const setStrataAnnualIncreaseHandler = useCallback((value: number) => {
        setStrataAnnualIncrease(value);
        window?.localStorage.setItem('strataAnnualIncrease', value.toString());
    }, []);

    const setTaxesHandler = useCallback((value: number) => {
        setTaxes(value);
        window?.localStorage.setItem('taxes', value.toString());
    }, []);

    const setTaxesAnnualIncreaseHandler = useCallback((value: number) => {
        setTaxesAnnualIncrease(value);
        window?.localStorage.setItem('taxesAnnualIncrease', value.toString());
    }, []);

    const setHouseMaintenanceHandler = useCallback((value: number) => {
        setHouseMaintenance(value);
        window?.localStorage.setItem('houseMaintenance', value.toString());
    }, []);

    const setHousePriceAnnualIncreaseHandler = useCallback((value: number) => {
        setHousePriceAnnualIncrease(value);
        window?.localStorage.setItem('housePriceAnnualIncrease', value.toString());
    }, []);

    useEffect(() => {
        const localStorage = window?.localStorage;
        if (localStorage) {
            const housePrice = localStorage.getItem('housePrice');
            if (housePrice) {
                setHousePrice(Number(housePrice));
            }
            const downPayment = localStorage.getItem('downPayment');
            if (downPayment) {
                setDownPayment(Number(downPayment));
            }
            const interestRate = localStorage.getItem('interestRate');
            if (interestRate) {
                setInterestRate(Number(interestRate));
            }
            const strata = localStorage.getItem('strata');
            if (strata) {
                setStrata(Number(strata));
            }
            const strataAnnualIncrease = localStorage.getItem('strataAnnualIncrease');
            if (strataAnnualIncrease) {
                setStrataAnnualIncrease(Number(strataAnnualIncrease));
            }
            const taxes = localStorage.getItem('taxes');
            if (taxes) {
                setTaxes(Number(taxes));
            }
            const taxesAnnualIncrease = localStorage.getItem('taxesAnnualIncrease');
            if (taxesAnnualIncrease) {
                setTaxesAnnualIncrease(Number(taxesAnnualIncrease));
            }
            const housePriceAnnualIncrease = localStorage.getItem('housePriceAnnualIncrease');
            if (housePriceAnnualIncrease) {
                setHousePriceAnnualIncrease(Number(housePriceAnnualIncrease));
            }
            const houseMaintenance = localStorage.getItem('houseMaintenance');
            if (houseMaintenance) {
                setHouseMaintenance(Number(houseMaintenance));
            }
        }
    }, []);

    return (
        <Accordion sx={sx}>
            <AccordionSummary>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" sx={{ mr: 2 }}>Mortgage</Typography>
                        <Typography>
                            Monthly payment:&nbsp;
                            <CurrencyValue
                                value={monthlyPayment}
                            />
                        </Typography>
                        <Typography>
                            Overall expenses:&nbsp;
                            <CurrencyValue
                                value={-overallExpenses}
                            />
                        </Typography>
                        <Typography>
                            Balance in {years} years:&nbsp;
                            <CurrencyValue
                                value={calculateInvestmentBalance(years) + finalHousePrice}
                                sx={{ fontWeight: 'bold' }}
                            />
                            <HelpIcon
                                title={
                                    <Box>
                                        <Box>
                                            Investment:&nbsp;
                                            <CurrencyValue value={calculateInvestmentBalance(years)} />
                                        </Box>
                                        <Box>
                                            House price:&nbsp;
                                            <CurrencyValue value={finalHousePrice} />
                                        </Box>
                                    </Box>
                                }
                                sx={{ verticalAlign: 'sub' }}
                            />
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={7}>
                        <CurrencyField
                            label="House Price"
                            value={housePrice}
                            sx={{ m: 1, mr: 2 }}
                            onChange={setHousePriceHandler}
                        />
                        <CurrencyField
                            label="Down payment"
                            value={downPayment}
                            sx={{ m: 1, mr: 2 }}
                            onChange={setDownPaymentHandler}
                        />
                    </Grid>
                </Grid>
            </AccordionSummary>
            <AccordionDetails>
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
                                    onChange={setInterestRateHandler}
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
                                    onChange={setStrataHandler}
                                />
                                <PercentField
                                    label="Annual increase"
                                    value={strataAnnualIncrease}
                                    sx={{ m: 1, width: '150px' }}
                                    onChange={setStrataAnnualIncreaseHandler}
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
                                    onChange={setTaxesHandler}
                                />
                                <PercentField
                                    label="Annual increase"
                                    value={taxesAnnualIncrease}
                                    sx={{ m: 1, width: '150px' }}
                                    onChange={setTaxesAnnualIncreaseHandler}
                                />
                            </TableCell>
                            <TableCell align="right">
                                <CurrencyValue value={totalTaxes} />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ pl: 0 }}>
                                <PercentField
                                    label="Maintenance"
                                    value={houseMaintenance}
                                    sx={{ m: 1, width: '150px' }}
                                    onChange={setHouseMaintenanceHandler}
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
                                    onChange={setHousePriceAnnualIncreaseHandler}
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
                            <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                                Investment balance
                                <HelpIcon
                                    title={
                                        <Box>
                                            Savings minus down payment as a starting balance:&nbsp;
                                            <CurrencyValue
                                                value={Math.max(savings - downPayment, 0)}
                                            />
                                        </Box>
                                    }
                                />
                            </TableCell>
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
                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                        <CurrencyValue
                                            value={calculateMonthlyExpenses(key)}
                                            sx={{ verticalAlign: 'middle' }}
                                        />
                                        <HelpIcon
                                            title={(
                                                <Box>
                                                    <Typography fontSize="inherit">
                                                        Mortgage:&nbsp;
                                                        <CurrencyValue value={monthlyPayment} />
                                                    </Typography>
                                                    <Typography fontSize="inherit">
                                                        Strata:&nbsp;
                                                        <CurrencyValue value={getMonthlyStrataCoast(key)} />
                                                    </Typography>
                                                    <Typography fontSize="inherit">
                                                        Taxes:&nbsp;
                                                        <CurrencyValue value={getMonthlyTaxes(key)} />
                                                    </Typography>
                                                    <Typography fontSize="inherit">
                                                        Maintenance:&nbsp;
                                                        <CurrencyValue value={getMonthlyMaintenance(key)} />
                                                    </Typography>
                                                </Box>
                                            )}
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