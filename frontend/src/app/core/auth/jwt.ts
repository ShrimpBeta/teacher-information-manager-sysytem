import { jwtDecode } from "jwt-decode";

export class JWT {
    static decodeToken(token: string): { exp: number } | null {
        try {
            return jwtDecode(token);
        } catch (error) {
            return null
        }
    }
}