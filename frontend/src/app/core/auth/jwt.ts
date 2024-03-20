import { jwtDecode } from "jwt-decode";

export class JWT {
    static decodeToken(token: string): { exp: number } | null {
        try {
            return jwtDecode(token);
        } catch (error) {
            return null
        }
    }

    static getTokenExpiration(token: string) {
        const tokenValue = this.decodeToken(token)
        const isTokenExpired = Date.now() >= (tokenValue?.exp ?? 0) * 1000
        return isTokenExpired
    }
}