export interface Movement {
    id?: number | null;
    amount?: number;
    description?: string | null;
    type?: Type | null;
    recurrence: Recurrence;
    date?: string;
    category: int;

}

interface Type {
    name: TypeNameEnum;
}

export interface Recurrence {
    name?: string;
    startDate?: string;
    endDate?: string;
}

enum TypeNameEnum {
    INCOME = 'income',
    EXPENSE = 'expense'
}