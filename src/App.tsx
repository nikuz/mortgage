import React, { useState, useContext, useCallback, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    IconButton,
    useTheme,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh';
import {
    NumericField,
    CurrencyField,
    ThemeContext,
    CompoundSelector,
} from 'src/components';
import { Compound } from 'src/types';
import {
    RentFeature,
    MortgageFeature,
    InvestmentFeature,
} from 'src/features';
import packageSettings from '../package.json';

export default function App() {
    const theme = useTheme();
    const themeContext = useContext(ThemeContext);
    const [savings, setSavings] = useState(0);
    const [budget, setBudget] = useState(0);
    const [budgetIncreaseRate, setBudgetIncreaseRate] = useState(3);
    const [investmentReturnRate, setInvestmentReturnRate] = useState(0);
    const [compound, setCompound] = useState<Compound>('annually');
    const [years, setYears] = useState(15);

    const setSavingsHandler = useCallback((value: number) => {
        setSavings(value);
        window?.localStorage.setItem('savings', value.toString());
    }, []);

    const setBudgetHandler = useCallback((value: number) => {
        setBudget(value);
        window?.localStorage.setItem('budget', value.toString());
    }, []);

    const setBudgetIncreaseRateHandler = useCallback((value: number) => {
        setBudgetIncreaseRate(value);
        window?.localStorage.setItem('budgetIncreaseRate', value.toString());
    }, []);

    const setInvestmentReturnRateHandler = useCallback((value: number) => {
        setInvestmentReturnRate(value);
        window?.localStorage.setItem('investmentReturnRate', value.toString());
    }, []);

    const setYearsHandler = useCallback((value: number) => {
        setYears(value);
        window?.localStorage.setItem('years', value.toString());
    }, []);

    useEffect(() => {
        const localStorage = window?.localStorage;
        if (localStorage) {
            const savings = localStorage.getItem('savings');
            if (savings) {
                setSavings(Number(savings));
            }
            const budget = localStorage.getItem('budget');
            if (budget) {
                setBudget(Number(budget));
            }
            const budgetIncreaseRate = localStorage.getItem('budgetIncreaseRate');
            if (budgetIncreaseRate) {
                setBudgetIncreaseRate(Number(budgetIncreaseRate));
            }
            const investmentReturnRate = localStorage.getItem('investmentReturnRate');
            if (investmentReturnRate) {
                setInvestmentReturnRate(Number(investmentReturnRate));
            }
            const years = localStorage.getItem('years');
            if (years) {
                setYears(Number(years));
            }
        }
    }, []);

    return (
        <Container sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                    variant="h2"
                    sx={{
                        mb: 5,
                        [theme.breakpoints.down('md')]: {
                            fontSize: '2rem',
                            mb: 4,
                        },
                    }}
                >
                    Buy vs Rent calculator
                    <Typography variant="subtitle1" component="span" sx={{ ml: 1 }}>
                        v{packageSettings.version}
                    </Typography>
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        ml: 3,
                        pt: 3,
                        [theme.breakpoints.down('md')]: {
                            pt: 1,
                        },
                    }}
                >
                    <IconButton
                        color="inherit"
                        onClick={themeContext.toggleTheme}
                    >
                        {theme?.palette.mode === 'light' && (
                            <Brightness4Icon fontSize="small" />
                        )}
                        {theme?.palette.mode === 'dark' && (
                            <BrightnessHighIcon fontSize="small" />
                        )}
                    </IconButton>
                </Box>
            </Box>
            <Box sx={{ mb: 1 }}>
                <CurrencyField
                    label="Savings"
                    value={savings}
                    sx={{ mb: 2, mr: 2 }}
                    onChange={setSavingsHandler}
                />
                <CurrencyField
                    label="Monthly budget"
                    value={budget}
                    sx={{ mb: 2, mr: 2 }}
                    onChange={setBudgetHandler}
                />
                <NumericField
                    label="Budget increase rate"
                    value={budgetIncreaseRate}
                    adornment="%"
                    sx={{ mb: 2, mr: 2, minWidth: '150px' }}
                    onChange={setBudgetIncreaseRateHandler}
                />
                <NumericField
                    label="Investment return rate"
                    value={investmentReturnRate}
                    adornment="%"
                    sx={{ mb: 2, mr: 2, minWidth: '150px' }}
                    onChange={setInvestmentReturnRateHandler}
                />
                <CompoundSelector
                    value={compound}
                    sx={{ mb: 2, mr: 2 }}
                    onChange={setCompound}
                />
                <NumericField
                    label="Years"
                    value={years}
                    min={1}
                    max={30}
                    sx={{ mb: 2, width: '100px' }}
                    onChange={setYearsHandler}
                />
            </Box>

            <RentFeature
                savings={savings}
                budget={budget}
                budgetIncreaseRate={budgetIncreaseRate}
                investmentReturnRate={investmentReturnRate}
                compound={compound}
                years={years}
                sx={{ mb: 3 }}
            />

            <MortgageFeature
                savings={savings}
                budget={budget}
                budgetIncreaseRate={budgetIncreaseRate}
                investmentReturnRate={investmentReturnRate}
                compound={compound}
                years={years}
                sx={{ mb: 3 }}
            />

            <InvestmentFeature sx={{ mb: 3 }} />
        </Container>
    );
}