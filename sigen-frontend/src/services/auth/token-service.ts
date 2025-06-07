export class TokenService {
    private static instance: TokenService;
    private accessToken: string | null = null;

    public static getInstance(): TokenService {
        if (!TokenService.instance) {
            TokenService.instance = new TokenService();
        }
        return TokenService.instance;
    }

    public isAuthenticated(): boolean {
        return !!this.accessToken;
    }

    public getAccessToken(): string | null {
        return this.accessToken;
    }

    public setAccessToken(token: string): void {
        this.accessToken = token;
    }

    public removeAccessToken(): void {
        this.accessToken = null;
    }
}
