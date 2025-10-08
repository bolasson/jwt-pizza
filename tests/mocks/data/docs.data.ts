import { Endpoints } from '../../../src/service/pizzaService';

export const mockServiceDocsData: Endpoints = {
    endpoints: [
        {
            requiresAuth: false,
            method: 'PUT',
            path: '/api/auth',
            description: 'Login a user',
            example: 'curl -X PUT localhost:3000/api/auth',
            response: { user: {}, token: 'abc123' }
        },
        {
            requiresAuth: true,
            method: 'GET',
            path: '/api/order/menu',
            description: 'Get the pizza menu',
            example: 'curl localhost:3000/api/order/menu',
            response: []
        },
        {
            requiresAuth: true,
            method: 'GET',
            path: '/api/franchise/:userId',
            description: 'Get user franchises',
            example: 'curl localhost:3000/api/franchise/1',
            response: []
        }
    ]
};