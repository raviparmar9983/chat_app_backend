import { messageKey, statusCodes } from '@constants';
import { UserTokenDTO } from '@dtos';
import * as config from 'config';
import { EncryptJWT, jwtDecrypt } from 'jose';

const code: string = config.get("JWT.SECRET");
const encHeadder = { alg: 'dir', enc: 'A256GCM' }
const createToken = async (userData: UserTokenDTO) => {
    const expiryTime: string = config.get("JWT.ACCESSTOKENTIME") ?? '10H';
    const secret = new TextEncoder().encode(code)

    const token = new EncryptJWT({ userData }).setIssuedAt().setProtectedHeader(encHeadder)

    const accessToken = await token.setExpirationTime(expiryTime).encrypt(secret)
    return { accessToken }
}

const jwtTokenVerifier = async (token: string) => {
    try {
        const secret = new TextEncoder().encode(code)
        const payload = await jwtDecrypt(token, secret, {
            contentEncryptionAlgorithms: [encHeadder.enc],
            keyManagementAlgorithms: [encHeadder.alg]
        })
        if (!payload) {
            return {
                status: statusCodes.error_status,
                message: messageKey.tokenError,
                success: false
            }
        }
        return {
            ...payload,
            success: true
        }
    }
    catch (error) {
        return {
            status: statusCodes.error_status,
            message: messageKey.tokenError,
            success: false
        }
    }
}

export { createToken, jwtTokenVerifier }