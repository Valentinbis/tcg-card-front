export interface Movement {
    id?: number;
    amount?: number
    description?: string;
    type?: Type;
    recurrence: Recurrence;
    date?: Date;
    category: int;

}

interface Type {
    name: TypeNameEnum;
}

export interface Recurrence {
    name?: string;
    startDate?: Date;
    endDate?: Date;
}

enum TypeNameEnum {
    INCOME = 'income',
    EXPENSE = 'expense'
}