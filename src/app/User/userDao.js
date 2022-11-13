
export const selectUser = async (connection) =>{
    const selectUserListQuery = `SELECT email, nickname FROM UserInfo;`
    const [userRows] = await connection.query(selectUserListQuery);
    return userRows;
}


export const selectUserEmail = async (connection, email)=>{
    const selectUserEmailQuery = `SELECT email, nickname FROM UserInfo WHERE email = ?;`;

    const [emailRows] = await connection.query(selectUserEmailQuery,email);
    return emailRows;
}

export const insertUserInfo =  async (connection, insertUserInfoParams) =>{
    const insertUserInfoQuery = `INSERT INTO UserInfo(email, password, nickname) VALUES (?,?,?);`;
    const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}

export const selectUserId = async(connection, userId)=>{
    const selectUserIdQuery = `SELECT id, email, nickname FROM UserInfo WHERE id = ?;`;
    const [userRow] = await connection.query(selectUserIdQuery, userId);
    return userRow;
}

export const selectUserPassword = async (connection, selectUserPasswordParams)=>{
    const selectUserPasswordQuery = `SELECT email, nickname, password FROM UserInfo WHERE email = ? AND password = ?;`;
    const selectUserPasswordRow = await connection.query(
    selectUserPasswordQuery,
    selectUserPasswordParams
);

return selectUserPasswordRow;
}

export const selectUserAccount = async(connection, email) =>{
    const selectUserAccountQuery = `SELECT status, id FROM UserInfo WHERE email = ?;`;
    const selectUserAccountRow = await connection.query(
        selectUserAccountQuery,
        email   
    );
    return selectUserAccountRow[0];
}

/*export const selectUserNickname = async(connection, nickname)=>{
    const selectUserNicknameQuery = 'SELECE nickname FROM UserInfo WHERE nickname = ?;';
    const selectUserNicknameRow = await connection.query(
        selectUserNicknameQuery,
        nickname

    );
    return selectUserNicknameRow;
}*/

export const updateUserInfo = async() =>{
    const updateUserQuery = `UPDATE UserInfo SET nickname = ? WHERE id = ?;`;
    const updateUserRow = await connection.query(updateUserQuery, [nickname, id]);
    return updateUserRow[0];
}