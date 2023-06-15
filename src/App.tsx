import React, { useState } from 'react';
import {
    Container,
    Box,
    TextField,
} from '@mui/material';
import { RentValues } from './types';
import RentComponent from './components/rent';

export default function App() {
    const [years, setYears] = useState(15);
    const [rentValues, setRentValues] = useState<RentValues>({
        price: 2685,
        annualIncrease: 2,
    });

    return (
        <Container sx={{ p: 2 }}>
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
                onValuesChange={setRentValues}
            />
        </Container>
    );
}