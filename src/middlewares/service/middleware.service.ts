
export interface ServiceMiddleware {
    validateToken(token: string): Promise<boolean>
}
