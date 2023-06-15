import React, { useState } from 'react';
import {
    Container,
    Box,
    TextField,
    Typography,
} from '@mui/material';
import {
    RentValues,
    MortgageValues,
    InvestmentValues,
} from './types';
import RentComponent from './components/rent';
import MortgageComponent from './components/mortgage';
import InvestmentComponent from './components/investment';

export default function App() {
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
            <Typography variant="h2" sx={{ mb: 3 }}>
                Mortgage calculation helper
            </Typography>
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
                onValuesChange={setInvestmentValues}
            />
        </Container>
    );
}