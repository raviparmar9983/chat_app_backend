import { messageKey } from '@constants'
import { User } from '@models'

const getAllUserService = async (name: string | undefined) => {
    try {
        const search = name ? {
            $or: [
                {
                    name: { $regex: name, $options: 'i' },
                    email: { $regex: name, $options: 'i' },
                }
            ]
        } : {}
        const users = await User.find(search)
        return {
            status: true,
            data: users,
            message: messageKey.requestCompletedSuccessfully
        }
    }
    catch (err) {
        throw err
    }
}

export { getAllUserService }