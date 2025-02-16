import { statusCodes } from '@constants';
import { getAllUserService } from '@services';

const getAllUser = async (req, res, next) => {
    try {
        const keyword = req.query.search
        const users = await getAllUserService(keyword)
        res.status(statusCodes.success_status).json(users)
    }
    catch (err) {
        next(err)
    }
}


export { getAllUser }