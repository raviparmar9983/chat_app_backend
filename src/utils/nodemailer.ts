import { EmailDTO } from "@dtos";
import * as nodemailer from 'nodemailer';
import * as config from 'config';

const nodeEmailerData: any = config.get("NODEMAILER");
const tranporter = nodemailer.createTransport({
    host: nodeEmailerData.HOST,
    port: nodeEmailerData.PORT,
    auth: nodeEmailerData.AUTH
})

export const sendEmail = async (option: EmailDTO) => {
    const contact = {
        to: option.to,
        from: nodeEmailerData.FROM_NAME
    }

    const email = {
        ...option.content,
        ...contact
    }

    try {
        await tranporter.sendMail(email)
        return true
    } catch (err) {
        console.log("error in email sending", err);
        return false
    }
}
