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
import CurrencyField from '../currency-field';
import PercentField from '../percent-field';
import CurrencyValue from '../currency-value';
import { RentValues } from '../../types';
import {
    calculateCompoundPercents,
    calculateCompoundPercentsSum,
} from '../../tools';

interface Props {
    years: number,
    values: RentValues,
    sx?: SxProps,
    onValuesChange: (value: RentValues) => void,
}

export default function RentComponent(props: Props) {
    const {
        years,
        values,
        sx,
        onValuesChange,
    } = props;
    const [expanded, setExpanded] = useState(false);
    const fieldFocusState = useRef<boolean>(false);

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
                            Total:&nbsp;
                            <CurrencyValue
                                value={-calculateCompoundPercentsSum({
                                    value: values.price * 12,
                                    percent: values.annualIncrease,
                                    years,
                                })}
                            />
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <CurrencyField
                            label="Price"
                            value={values.price}
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
                                    price: value,
                                });
                            }}
                        />
                        <PercentField
                            label="Annual increase"
                            value={values.annualIncrease}
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
                                    annualIncrease: value,
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
                            <TableCell>Year</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Price per year</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[...Array(years)].map((item, key) => (
                            <TableRow key={key} >
                                <TableCell>
                                    <Typography sx={{ mr: 5 }} color="grey">
                                        {new Date().getFullYear() + key}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <CurrencyValue
                                        value={calculateCompoundPercents({
                                            value: values.price,
                                            percent: values.annualIncrease,
                                            years: key,
                                        })}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <CurrencyValue
                                        value={calculateCompoundPercents({
                                            value: values.price * 12,
                                            percent: values.annualIncrease,
                                            years: key,
                                        })}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </AccordionDetails>
        </Accordion>
    );
}