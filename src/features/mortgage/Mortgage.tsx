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
    NumericField,
    CurrencyValue,
    HelpIcon,
} from 'src/components';
import {
    calculateCompoundPercents,
    calculateCompoundPercentsSum,
    calculateCompoundPercentsWithContributions,
    calculateMortgagePayment,
    calculateMortgageRemainedPrincipal,
} from 'src/tools';
import { Compound, MortgagePayment } from 'src/types';

interface Props {
    savings: number,
    budget: number,
    budgetIncreaseRate: number,
    investmentReturnRate: number,
    compound: Compound,
    years: number,
    sx?: SxProps,
}

export default function MortgageFeature(props: Props) {
    const {
        savings,
        budget,
        budgetIncreaseRate,
        investmentReturnRate,
        compound,
        years,
        sx,
    } = props;
    const [housePrice, setHousePrice] = useState(0);
    const [downPayment, setDownPayment] = useState(0);
    const [interestRate, setInterestRate] = useState(5);
    const [interestRateLength, setInterestRateLength] = useState(5);
    const [interestRateIncrease, setInterestRateIncrease] = useState(1);
    const [strata, setStrata] = useState(0);
    const [strataAnnualIncrease, setStrataAnnualIncrease] = useState(3);
    const [taxes, setTaxes] = useState(0);
    const [taxesAnnualIncrease, setTaxesAnnualIncrease] = useState(4.4);
    const [housePriceAnnualIncrease, setHousePriceAnnualIncrease] = useState(5);
    const [houseMaintenance, setHouseMaintenance] = useState(1);
    const monthlyPayments = useMemo(() => {
        const payments: MortgagePayment[] = [];
        let currentPeriod = 0;
        let remainedPrincipal = housePrice - downPayment;
        let currentRate = interestRate;
        let currentMonthlyPayment = calculateMortgagePayment({
            principal: remainedPrincipal,
            interestRate: currentRate,
            years,
        });

        for (let i = 0; i < years; i++) {
            let period = Math.ceil((i + 1) / interestRateLength);
            period = period > 0 ? period - 1 : period;

            if (period > 0 && period !== currentPeriod) {
                remainedPrincipal = calculateMortgageRemainedPrincipal({
                    principal: remainedPrincipal,
                    monthlyPayment: currentMonthlyPayment,
                    interestRate: currentRate,
                    years: interestRateLength,
                });
                currentRate += interestRateIncrease;
                // avoid division by zero
                if (currentRate === 0) {
                    currentRate = 0.00001;
                }
                currentMonthlyPayment = calculateMortgagePayment({
                    principal: remainedPrincipal,
                    interestRate: currentRate,
                    years: years - i,
                });
                currentPeriod = period;
            }

            payments[i] = {
                year: new Date().getFullYear() + i,
                interestRate: currentRate,
                monthlyPayment: Math.max(currentMonthlyPayment, 0),
                principal: remainedPrincipal,
            };
        }

        return payments;
    }, [housePrice, downPayment, interestRate, interestRateLength, interestRateIncrease, years]);
    const uniqueMonthlyPayments = useMemo<MortgagePayment[]>(() => {
        const payments = new Map();
        for (const item of monthlyPayments) {
            if (item && !payments.has(item.monthlyPayment)) {
                payments.set(item.monthlyPayment, item);
            }
        }
        return Array.from(payments.values());
    }, [monthlyPayments]);
    const interest = useMemo(() => {
        if (downPayment >= housePrice) {
            return 0;
        }
        const totalPayments = monthlyPayments.reduce((acc, item) => (
            acc + (item?.monthlyPayment ?? 0) * 12
        ), 0);
        return Math.max(totalPayments - (housePrice - downPayment), 0);
    }, [housePrice, downPayment, monthlyPayments]);
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
            const futureHousePrice = calculateCompoundPercents({
                value: housePrice,
                percent: housePriceAnnualIncrease,
                years: i,
            });
            result += futureHousePrice * (houseMaintenance / 100);
        }
        return result;
    }, [houseMaintenance, housePriceAnnualIncrease, housePrice, years]);
    const finalHousePrice = useMemo(() => calculateCompoundPercents({
        value: housePrice,
        percent: housePriceAnnualIncrease,
        years: years,
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
        return (monthlyPayments[year]?.monthlyPayment ?? 0) + strataCoast + monthlyTaxes + maintenance;
    }, [monthlyPayments, getMonthlyStrataCoast, getMonthlyTaxes, getMonthlyMaintenance]);

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
        for (let i = 0; i < years; i++) {
            result = calculateCompoundPercentsWithContributions({
                value: result,
                percent: investmentReturnRate,
                years: 1,
                contribution: calculateMonthlyInvestment(i),
                compound,
            });
        }
        return result;
    }, [savings, downPayment, investmentReturnRate, calculateMonthlyInvestment, compound]);

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

    const setInterestRateLengthHandler = useCallback((value: number) => {
        setInterestRateLength(value);
        window?.localStorage.setItem('interestRateLength', value.toString());
    }, []);

    const setInterestRateIncreaseHandler = useCallback((value: number) => {
        setInterestRateIncrease(value);
        window?.localStorage.setItem('interestRateIncrease', value.toString());
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
            const interestRateLength = localStorage.getItem('interestRateLength');
            if (interestRateLength) {
                setInterestRateLength(Number(interestRateLength));
            }
            const interestRateIncrease = localStorage.getItem('interestRateIncrease');
            if (interestRateIncrease) {
                setInterestRateIncrease(Number(interestRateIncrease));
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
                        <Box>
                            Monthly payment:&nbsp;
                            <CurrencyValue
                                value={monthlyPayments[0]?.monthlyPayment}
                            />
                            <HelpIcon
                                title={
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Year</TableCell>
                                                <TableCell>Interest rate</TableCell>
                                                <TableCell>Remained Principal</TableCell>
                                                <TableCell>Monthly payment</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {uniqueMonthlyPayments.map((item, key) => (
                                                <TableRow key={key}>
                                                    <TableCell>
                                                        {item.year}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.interestRate}%
                                                    </TableCell>
                                                    <TableCell>
                                                        <CurrencyValue value={item.principal} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <CurrencyValue value={item.monthlyPayment} />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                }
                                sx={{ verticalAlign: 'sub' }}
                            />
                        </Box>
                        <Typography>
                            Overall expenses:&nbsp;
                            <CurrencyValue value={-overallExpenses} />
                        </Typography>
                        <Box>
                            Balance in {years} years:&nbsp;
                            <CurrencyValue
                                value={calculateInvestmentBalance(years) + finalHousePrice}
                                sx={{ fontWeight: 'bold' }}
                            />
                            <HelpIcon
                                title={
                                    <Box>
                                        <Typography>
                                            Investment:&nbsp;
                                            <CurrencyValue value={calculateInvestmentBalance(years)} />
                                        </Typography>
                                        <Typography>
                                            House price:&nbsp;
                                            <CurrencyValue value={finalHousePrice} />
                                        </Typography>
                                    </Box>
                                }
                                sx={{ verticalAlign: 'sub' }}
                            />
                        </Box>
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
                                <NumericField
                                    label="Interest rate"
                                    value={interestRate}
                                    adornment="%"
                                    sx={{ m: 1, minWidth: '150px' }}
                                    onChange={setInterestRateHandler}
                                />
                                <NumericField
                                    label="Period length (years)"
                                    value={interestRateLength}
                                    min={1}
                                    max={years}
                                    sx={{ m: 1, minWidth: '150px' }}
                                    onChange={setInterestRateLengthHandler}
                                />
                                <NumericField
                                    label="Increase per period"
                                    value={interestRateIncrease}
                                    min={-10}
                                    adornment="%"
                                    sx={{ m: 1, minWidth: '150px' }}
                                    onChange={setInterestRateIncreaseHandler}
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
                                <NumericField
                                    label="Annual increase"
                                    value={strataAnnualIncrease}
                                    adornment="%"
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
                                <NumericField
                                    label="Annual increase"
                                    value={taxesAnnualIncrease}
                                    adornment="%"
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
                                <NumericField
                                    label="Maintenance"
                                    value={houseMaintenance}
                                    adornment="%"
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
                                <NumericField
                                    label="House price annual increase"
                                    value={housePriceAnnualIncrease}
                                    adornment="%"
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
                                        <Typography>
                                            Savings minus down payment as a starting balance:&nbsp;
                                            <CurrencyValue
                                                value={Math.max(savings - downPayment, 0)}
                                            />
                                        </Typography>
                                    }
                                />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[...Array(Math.max(years, 0))].map((item, key) => {
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
                                                    <Typography>
                                                        Mortgage:&nbsp;
                                                        <CurrencyValue value={monthlyPayments[key]?.monthlyPayment} />
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
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <CurrencyValue value={calculateMonthlyInvestment(key)} />
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