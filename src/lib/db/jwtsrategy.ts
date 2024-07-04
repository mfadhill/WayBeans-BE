// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
    email: string;
    id: string;
    role: Role
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'coffe', // Gantilah dengan secret key yang lebih aman
        });
    }

    async validate(payload: JwtPayload) {
        return { id: payload.id, email: payload.email, role: payload.role };
    }
}
