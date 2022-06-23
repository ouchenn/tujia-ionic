export interface User {
    email: string;
    name?: string;
    password: string;
}

export interface AuthResponse {
    id: string,
    name: string,
    email: string,
    role: string,
    jwtToken: string,
}

export interface CurrentUser{
    id: string,
    name: string,
    email: string
}