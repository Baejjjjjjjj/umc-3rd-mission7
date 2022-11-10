import pool from "../../../config/database"
import { selectUser, selectUserAccount, selectUserEmail, selectUserId, selectUserPassword } from "./userDao";


export const retrieveUserList = async(email) =>{
    if(!email){
        const connection = await pool.getConnection(async conn => conn);
        const userListResult = await selectUser(connection);
        connection.release();

        return userListResult;
    }
    else{
        const connection = await pool.getConnection(async conn => conn);
        const userListResult = await selectUserEmail(connection, email);
        connection.release();

        return userListResult;
    }
}

export const retrieveUser = async(userId) =>{
    const connection = await pool.getConnection(async conn => conn);
    const userResult = await selectUserId(connection,userId);

    connection.release();

    return userResult[0];
}

export const emailCheck = async (email) =>{
    const connection = await pool.getConnection(async conn => conn);
    const emailCheckResult = selectUserEmail(connection,email);

    connection.release();

    return emailCheckResult;
}

export const passwordCheck = async(selectUserPasswordParams) =>{
    const connection = await pool.getConnection(async conn => conn);
    const passwordCheckResult = await selectUserPassword(
        connection,selectUserPasswordParams
    );

    connection.release();
    return passwordCheckResult[0];
}

export const accountCheck = async (email) =>{
    const connection = await pool.getConnection(async conn => conn);
    const userAccountResult = await selectUserAccount(connection, email);
    connection.release();

    return userAccountResult;
}