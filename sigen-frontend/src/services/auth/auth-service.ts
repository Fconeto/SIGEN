import { UserRole } from "@/domain/entities/user";
import { GlobalService } from "@/services/global-service";
import { TokenService } from "@/services/auth/token-service";
import { AgentTeam } from "@/domain/entities/team";

class AuthService {
    globalService: GlobalService;
    tokenService: TokenService;

    constructor(globalService: GlobalService, tokenService: TokenService) {
        this.globalService = globalService;
        this.tokenService = tokenService;
    }

    login(username: string, password: string): Promise<void> {
        this.globalService.setUser({
            id: 'dummy-id',
            name: 'dummy-name',
            role: UserRole.CHIEF_AGENT,
            team: AgentTeam.dengue,
        });
        this.tokenService.setAccessToken('dummy');
        return Promise.resolve();
    }

    register(username: string, password: string): Promise<void> {
        this.tokenService.setAccessToken('dummy-access-token');
        return Promise.resolve();
    }
}