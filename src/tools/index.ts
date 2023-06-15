export function calculateCompoundPercents(props: {
    value: number,
    percent: number,
    years: number,
}) {
    let result = props.value;

    for (let i = 1; i <= props.years; i++) {
        result += result * (props.percent / 100);
    }

    return Math.round(result);
}

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
    housePrice: number,
    downPayment: number,
    interestRate: number,
    years: number,
}) {
    const loan = props.housePrice - props.downPayment;
    const monthlyInterest = 0.05 / 12;
    const paymentsAmount = props.years * 12; // years multiple months per year
    const top = monthlyInterest * Math.pow(1 + monthlyInterest, paymentsAmount);
    const bottom = Math.pow(1 + monthlyInterest, paymentsAmount) - 1;

    return loan * (top / bottom);
}

export function calculateCompoundPercentsWithContributions(props: {
    value: number,
    percent: number,
    years: number,
    contribution: number,
}) {
    let result = props.value;
    const monthPerYear = 12;
    const monthlyPercent = props.percent / monthPerYear;

    for (let i = 0; i < props.years; i++) {
        for (let j = 0; j < monthPerYear; j++) {
            const monthlyInterest = result * (monthlyPercent / 100);
            result = result + monthlyInterest + props.contribution;
        }
    }

    return Math.round(result);
}