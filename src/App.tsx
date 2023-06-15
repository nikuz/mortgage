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
import RentComponent from './components/rent';
import MortgageComponent from './components/mortgage';
import InvestmentComponent from './components/investment';
import {
    RentValues,
    MortgageValues,
    InvestmentValues,
} from './types';

export default function App() {
    const theme = useTheme();
    const themeContext = useContext(ThemeContext);
    const [years, setYears] = useState(15);
    const [rentValues, setRentValues] = useState<RentValues>({
        price: 2685,
        annualIncrease: 2,
    });
    const [mortgageValues, setMortgageValues] = useState<MortgageValues>({
        housePrice: 950000,
        downPayment: 250000,
        interestRate: 5,
    });
    const [investmentValues, setInvestmentValues] = useState<InvestmentValues>({
        startingAmount: 0,
        returnRate: 8,
    });

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
                    Mortgage calculation helper
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
            <Box sx={{ mb: 2 }}>
                <TextField
                    label="Years"
                    value={years}
                    type="number"
                    variant="outlined"
                    size="small"
                    InputProps={{ inputProps: { min: 0, max: 30 } }}
                    sx={{ minWidth: '100px' }}
                    onChange={(event) => {
                        setYears(Number(event.target.value));
                    }}
                />
            </Box>

            <RentComponent
                years={years}
                values={rentValues}
                sx={{ mb: 3 }}
                onValuesChange={setRentValues}
            />

            <MortgageComponent
                years={years}
                values={mortgageValues}
                sx={{ mb: 3 }}
                onValuesChange={setMortgageValues}
            />

            <InvestmentComponent
                years={years}
                values={investmentValues}
                rentValues={rentValues}
                mortgageValues={mortgageValues}
                sx={{ mb: 2 }}
                onValuesChange={setInvestmentValues}
            />
        </Container>
    );
}