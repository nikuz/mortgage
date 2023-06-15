import React, { useState, useRef, useCallback } from 'react';
import {
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    TextField,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CurrencyField from '../currency-field';
import CurrencyValue from '../currency-value';
import { RentValues } from '../../types';
import {
    calculateComplexPercents,
    calculateComplexPercentsSum,
} from '../../tools';

interface Props {
    years: number,
    values: RentValues,
    onValuesChange: (value: RentValues) => void,
}

export default function RentComponent(props: Props) {
    const {
        years,
        values,
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
        <Accordion expanded={expanded}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                onClick={accordionClickHandler}
            >
                <Box sx={{ display: 'flex', flexGrow:1, justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ mr: 2 }}>Rent</Typography>
                        <CurrencyField
                            label="Price"
                            value={values.price}
                            sx={{ mr: 2 }}
                            onFocus={() => {
                                fieldFocusState.current = true;
                            }}
                            onBlur={() => {
                                fieldFocusState.current = false;
                            }}
                            onChange={(newPrice: number) => {
                                onValuesChange({
                                    ...values,
                                    price: newPrice,
                                });
                            }}
                        />
                        <TextField
                            label="Anual increase"
                            value={values.annualIncrease}
                            type="number"
                            variant="outlined"
                            size="small"
                            InputProps={{ inputProps: { min: 0 } }}
                            sx={{ minWidth: '100px' }}
                            onChange={(event) => {
                                onValuesChange({
                                    ...values,
                                    annualIncrease: Number(event.target.value),
                                });
                            }}
                        />
                    </Box>
                    <Box sx={{ mr: 2 }}>
                        <Typography>
                            Total:
                            <CurrencyValue
                                value={calculateComplexPercentsSum({
                                    value: values.price * 12,
                                    percent: values.annualIncrease,
                                    years,
                                })}
                            />
                        </Typography>
                    </Box>
                </Box>
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
                                        value={calculateComplexPercents({
                                            value: values.price,
                                            percent: values.annualIncrease,
                                            years: key,
                                        })}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <CurrencyValue
                                        value={calculateComplexPercents({
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