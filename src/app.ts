import * as config from 'config';
import * as express from 'express';
import * as cors from 'cors'
import { authRouter, chatRouter, userRouter } from '@routes';
import { authMiddleware, errorHandler } from '@middlewares';


const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send({
        status: true,
        message: "Server Started Suceessfully"
    })
})

app.use('/api/auth', authRouter)
app.use('/api/user', authMiddleware, userRouter)
app.use('/api/chat', authMiddleware, chatRouter)
app.use(errorHandler)

export default app