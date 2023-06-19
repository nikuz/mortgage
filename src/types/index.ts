export type Compound = 'annually' | 'monthly';

export interface MortgagePayment {
    year: number,
    interestRate: number,
    principal: number,
    monthlyPayment: number,
}