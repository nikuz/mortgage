import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
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
import CurrencyField from '../currency-field';
import PercentField from '../percent-field';
import CurrencyValue from '../currency-value';
import { MortgageValues } from '../../types';
import {
    calculateComplexPercents,
    calculateComplexPercentsSum,
    calculateMortgagePayment,
} from '../../tools';

interface Props {
    years: number,
    values: MortgageValues,
    sx?: SxProps,
    onValuesChange: (value: MortgageValues) => void,
}

export default function MortgageComponent(props: Props) {
    const {
        years,
        values,
        sx,
        onValuesChange,
    } = props;
    const [strata, setStrata] = useState(500);
    const [strataAnnualIncrease, setStrataAnnualIncrease] = useState(3);
    const [taxes, setTaxes] = useState(1500);
    const [taxesAnnualIncrease, setTaxesAnnualIncrease] = useState(4.4);
    const [housePriceAnnualIncrease, setHousePriceAnnualIncrease] = useState(2);
    const [houseMaintenance, setHouseMaintenance] = useState(1);
    const [expanded, setExpanded] = useState(false);
    const fieldFocusState = useRef<boolean>(false);
    const monthlyPayment = useMemo(() => calculateMortgagePayment({
        ...values,
        years,
    }), [values, years]);
    const interest = useMemo(() => (
        monthlyPayment * 12 * years - (values.housePrice - values.downPayment)
    ), [values, years, monthlyPayment]);
    const totalStrata = useMemo(() => calculateComplexPercentsSum({
        value: strata * 12,
        percent: strataAnnualIncrease,
        years: years,
    }), [strata, strataAnnualIncrease, years]);
    const totalTaxes = useMemo(() => calculateComplexPercentsSum({
        value: taxes,
        percent: taxesAnnualIncrease,
        years: years,
    }), [taxes, taxesAnnualIncrease, years]);
    const totalHouseMaintenance = useMemo(() => {
        let result = 0;
        for (let i = 0; i < years; i++) {
            const housePrice = calculateComplexPercents({
                value: values.housePrice,
                percent: housePriceAnnualIncrease,
                years: i,
            });
            result += housePrice * (houseMaintenance / 100);
        }
        return result;
    }, [houseMaintenance, housePriceAnnualIncrease, values, years]);
    const finalHousePrice = useMemo(() => calculateComplexPercents({
        value: values.housePrice,
        percent: housePriceAnnualIncrease,
        years: years,
    }), [values, housePriceAnnualIncrease, years]);
    const overallExpenses = useMemo(() => (
        interest + totalStrata + totalTaxes + totalHouseMaintenance
    ), [interest, totalStrata, totalTaxes, totalHouseMaintenance]);

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
                            <CurrencyValue value={monthlyPayment} />
                        </Typography>
                        <Typography>
                            Total interest:&nbsp;
                            <CurrencyValue value={interest} />
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <CurrencyField
                            label="House Price"
                            value={values.housePrice}
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
                                    housePrice: value,
                                });
                            }}
                        />
                        <CurrencyField
                            label="Down payment"
                            value={values.downPayment}
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
                                    downPayment: value,
                                });
                            }}
                        />
                        <PercentField
                            label="Interest rate"
                            value={values.interestRate}
                            sx={{ m: 1, minWidth: '150px' }}
                            onFocus={() => {
                                fieldFocusState.current = true;
                            }}
                            onBlur={() => {
                                fieldFocusState.current = false;
                            }}
                            onChange={(value) => {
                                onValuesChange({
                                    ...values,
                                    interestRate: value,
                                });
                            }}
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
                        <TableRow>
                            <TableCell>
                                <Typography variant="h6">
                                    Overall expenses:
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <CurrencyValue
                                    value={overallExpenses}
                                    sx={{ fontWeight: 'bold' }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <Typography variant="h6">
                                    Income:
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <CurrencyValue
                                    value={finalHousePrice - overallExpenses}
                                    sx={{ fontWeight: 'bold' }}
                                />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </AccordionDetails>
        </Accordion>
    );
}