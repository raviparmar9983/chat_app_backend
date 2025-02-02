import { messageKey } from '@constants';
import { UserTokenDTO } from '@dtos';
import { User } from '@models'
import { CustomeError } from '@utils';
import { createToken } from '@utils';

const registerUser = async (req, res, next) => {
    try {
        const user = await User.create(req.body)
        if (!user) throw new CustomeError(messageKey.recordNotCreated)
        const userToken: UserTokenDTO = {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture
        }
        const token = await createToken(userToken)
        res.status(201).json({
            status: true,
            message: messageKey.recordCreatedSuccessfully,
            data: userToken,
            token,
        })
    } catch (error) {
        next(error)
    }
}

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) throw new CustomeError(messageKey.userNotFound)
        if (user && (await (user as any).matchPassword(password))) {
            const userToken: UserTokenDTO = {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture
            }
            const token = await createToken(userToken)
            res.status(201).json({
                status: true,
                message: messageKey.recordCreatedSuccessfully,
                data: userToken,
                token,
            })
        }
    } catch (error) {
        next(error)
    }
}

export { registerUser, loginUser }