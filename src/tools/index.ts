import { Compound } from '../types';

// Formula
// A = P(1 + \frac{r}{n})^{nt}
// A	=	final amount
// P	=	initial principal balance
// r	=	interest rate
// n	=	number of times interest applied per time period
// t	=	number of time periods elapsed
export function calculateCompoundPercents(props: {
    value: number,
    percent: number,
    years: number,
}) {
    const {
        value,
        years,
    } = props;
    const percent = props.percent / 100;

    return value * Math.pow(1 + percent, years);
}

// Sum function calculates compound percentage for each year and sums the results
// The first year (0) value is flat, it doesn't have percentage increase
export function calculateCompoundPercentsSum(props: {
    value: number,
    percent: number,
    years: number,
}) {
    let result = 0;

    for (let i = 0; i < props.years; i++) {
        result += calculateCompoundPercents({
            value: props.value,
            percent: props.percent,
            years: i,
        });
    }

    return result;
}

// formula: https://www.bankrate.com/mortgages/mortgage-calculator/#how-mortgage-calculator-help
export function calculateMortgagePayment(props: {
    principal: number,
    interestRate: number,
    years: number,
}) {
    const monthlyInterest = props.interestRate / 100 / 12;
    const paymentsAmount = props.years * 12; // years multiple months per year
    const top = monthlyInterest * Math.pow(1 + monthlyInterest, paymentsAmount);
    const bottom = Math.pow(1 + monthlyInterest, paymentsAmount) - 1;

    return props.principal * (top / bottom);
}

// formula: https://www.investopedia.com/terms/a/amortization.asp
// Principal Payment = TMP − (OLB * (Interest Rate / 12 Months))
// TMP = Total monthly payment
// OLB = Outstanding loan balance
export function calculateMortgageRemainedPrincipal(props: {
    principal: number,
    monthlyPayment: number,
    interestRate: number,
    years: number,
}) {
    let remainedPrincipal = props.principal;
    let principal: number;

    for (let i = 0, l = props.years * 12; i < l; i++) {
        const interest = remainedPrincipal * (props.interestRate / 100 / 12);
        principal = props.monthlyPayment - interest;
        remainedPrincipal -= principal;
        // console.log('remainedPrincipal:', remainedPrincipal);
    }

    return remainedPrincipal;
}

// calculations match an official website of the United States government
// https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator
export function calculateCompoundPercentsWithContributions(props: {
    value: number,
    percent: number,
    years: number,
    contribution: number,
    compound?: Compound,
}) {
    let result = props.value;
    const monthPerYear = 12;
    const monthlyPercent = props.percent / monthPerYear;
    const yearlyContributions = props.contribution * monthPerYear;

    for (let i = 0; i < props.years; i++) {
        if (props.compound === 'monthly') {
            for (let j = 0; j < monthPerYear; j++) {
                const monthlyInterest = result * (monthlyPercent / 100);
                result = result + monthlyInterest + props.contribution;
            }
        } else {
            const yearlyInterest = result * (props.percent / 100);
            result += yearlyContributions + yearlyInterest;
        }
    }

    return result;
}