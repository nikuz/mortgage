export function calculateComplexPercents(props: {
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

export function calculateComplexPercentsSum(props: {
    value: number,
    percent: number,
    years: number,
}) {
    let result = 0;

    for (let i = 0; i < props.years; i++) {
        result += calculateComplexPercents({
            value: props.value,
            percent: props.percent,
            years: i,
        });
    }

    return result;
}