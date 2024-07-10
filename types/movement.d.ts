interface Movement {
    id: number;
    amount: number;
    description: string;
    type: Type;
    recurrence; Recurrence;
    date: string;
    // category: Category;

}

interface Type {
    name: TypeNameEnum;
}

interface Recurrence {
    name: RecurrenceNameEnum;
    startDate: string;
    endDate: string;
}

enum RecurrenceNameEnum {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
    BIMONTHLY = 'bimonthly',
    QUARTERLY = 'quarterly',
    YEARLY = 'yearly'
}

enum TypeNameEnum {
    INCOME = 'income',
    EXPENSE = 'expense'
}