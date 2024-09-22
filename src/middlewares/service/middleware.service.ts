
export interface ServiceMiddleware {
    validateToken(token: string): Promise<boolean>
    getUserType(token: string): Promise<string>;
}
