import { registerAs } from "@nestjs/config";

export default registerAs('app', () => ({
    cookieSecret: process.env.COOKIE_SECRET,
}))