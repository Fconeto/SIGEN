import { User } from "@/domain/entities/user";
import { TokenService } from "./auth/token-service";

export class GlobalService {
    private static instance: GlobalService;
    private tokenService: TokenService;
    private constructor(tokenService: TokenService) {
        this.tokenService = tokenService;
    }

    private user: User | null = null;

    public static getInstance(): GlobalService {
        if (!GlobalService.instance) {
            GlobalService.instance = new GlobalService(TokenService.getInstance());
        }
        return GlobalService.instance;
    }

    public isAuthenticated(): boolean {
        return this.tokenService.isAuthenticated() && this.user !== null;
    }

    public logout(): void {
        this.tokenService.removeAccessToken();
        this.user = null;
    }

    public setUser(user: User): void {
        this.user = user;
    }

    public getUser(): User | null {
        return this.user;
    }
}
