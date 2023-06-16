import React, { useState, useContext } from 'react';
import {
    Container,
    Box,
    TextField,
    Typography,
    IconButton,
    useTheme,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh';
import { ThemeContext } from './components/theme';
import RentComponent from './features/rent';
import MortgageComponent from './features/mortgage';
// import InvestmentComponent from './features/investment';
import CurrencyField from './components/currency-field';
import PercentField from './components/percent-field';

export default function App() {
    const theme = useTheme();
    const themeContext = useContext(ThemeContext);
    const [savings, setSavings] = useState(250000);
    const [budget, setBudget] = useState(10000);
    const [budgetIncreaseRate, setBudgetIncreaseRate] = useState(3);
    const [investmentReturnRate, setInvestmentReturnRate] = useState(8);
    const [years, setYears] = useState(15);

    return (
        <Container sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                    variant="h2"
                    gutterBottom
                    sx={{
                        [theme.breakpoints.down('md')]: {
                            fontSize: '2rem',
                            mb: 3,
                        },
                    }}
                >
                    Buy vs Rent calculator
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
                    onChange={setSavings}
                />
                <CurrencyField
                    label="Monthly budget"
                    value={budget}
                    sx={{ mb: 2, mr: 2 }}
                    onChange={setBudget}
                />
                <PercentField
                    label="Budget increase rate"
                    value={budgetIncreaseRate}
                    sx={{ mb: 2, mr: 2, minWidth: '150px' }}
                    onChange={setBudgetIncreaseRate}
                />
                <PercentField
                    label="Investment return rate"
                    value={investmentReturnRate}
                    sx={{ mb: 2, mr: 2, minWidth: '150px' }}
                    onChange={setInvestmentReturnRate}
                />
                <TextField
                    label="Years"
                    value={years}
                    type="number"
                    variant="outlined"
                    size="small"
                    InputProps={{ inputProps: { min: 1, max: 30 } }}
                    sx={{ mb: 2, minWidth: '150px' }}
                    onChange={(event) => {
                        setYears(Number(event.target.value));
                    }}
                />
            </Box>

            <RentComponent
                savings={savings}
                budget={budget}
                budgetIncreaseRate={budgetIncreaseRate}
                investmentReturnRate={investmentReturnRate}
                years={years}
                sx={{ mb: 3 }}
            />

            <MortgageComponent
                savings={savings}
                budget={budget}
                budgetIncreaseRate={budgetIncreaseRate}
                investmentReturnRate={investmentReturnRate}
                years={years}
                sx={{ mb: 3 }}
            />

            {/*<InvestmentComponent*/}
            {/*    years={years}*/}
            {/*    values={investmentValues}*/}
            {/*    rentValues={rentValues}*/}
            {/*    mortgageValues={mortgageValues}*/}
            {/*    sx={{ mb: 2 }}*/}
            {/*    onValuesChange={setInvestmentValues}*/}
            {/*/>*/}
        </Container>
    );
}