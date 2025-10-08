export enum Role {
    Admin,
    Diner,
}

export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    roles: { role: Role }[];
};

export const validUsers: Record<string, User> = {
    'd@jwt.com': {
        id: '3',
        name: 'Kai Chen',
        email: 'd@jwt.com',
        password: 'a',
        roles: [{ role: Role.Diner }],
    },
};