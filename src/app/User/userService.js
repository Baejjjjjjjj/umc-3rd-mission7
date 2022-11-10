require("dotenv").config();
import baseResponse from '../../../config/baseResponseStatus';
import pool from '../../../config/database'
import { errResponse } from '../../../config/response';
import { accountCheck, emailCheck, passwordCheck } from './userProvider'
import crypto from "crypto"
import { response } from 'express';
import { insertUserInfo } from './userDao';
import jwt from "jsonwebtoken"


export const createUser = async (email, password, nickname) =>{
    try{
        //이메일 중복 확인
        const emailRows = await emailCheck(email);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);
        const hashedPassword = await crypto.createHash("sha512").update(password).digest("hex");

        const insertUserInfoParams = [email, hashedPassword, nickname];

        const connection = await pool.getConnection(async conn => conn);

        const userIdResult = await insertUserInfo(connection,insertUserInfoParams);
        console.log(`추가된 회원 : ${userIdResult[0].insertId}`);
        connection.release();
        return response(baseResponse.SUCCESS);
    }catch (err){
        return errResponse(baseResponse.DB_ERROR);
    }
}

export const postSignIn = async (email, password) =>{
    try{
        //이메일여부 확인
        const emailRows = await emailCheck(email);
        if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);

        const seletEmail = emailRows[0].email;

        //비밀번호 확인
        const hashedPassword = await crypto.createHash("sha512")
        .update(password).digest("hex");

        const selectUserPasswordParams = [seletEmail, hashedPassword];
        const passswordRows = await passwordCheck(selectUserPasswordParams);

        if (passswordRows[0].password !== hashedPassword)
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);

        const userInfoRows = await accountCheck(email);

        if (userInfoRows[0].status === "INACTIVE")
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        else if (userInfoRows[0].status === "DELETED")
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        
        console.log(userInfoRows[0].id);

        let token = await jwt.sign({
                userId : userInfoRows[0].id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "365d",
                subject: "userInfo",
            }
        );
        return response(baseResponse.SUCCESS, {'userId' : userInfoRows[0].id, 'jwt' :  token});
    }catch(err){
        return errResponse(baseResponse.DB_ERROR);
    }
}

export const editUser =  async (id, nickname)=>{
    try {
        console.log(id)
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUserInfo(connection, id, nickname)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
