import { errResponse, response } from "../../../config/response";
import regexEmail from "regex-email";
import baseResponse from "../../../config/baseResponseStatus";
import { createUser, editUser, postSignIn } from "./userService";
import { emailCheck, retrieveUser, retrieveUserList } from "./userProvider";

/**
 * API No. 0 
 * API Name : 테스트 API
 * [GET] /app/test
 */

export const getTest = async(req,res)=>{
    return res.send(response(baseResponse.SUCCESS));
}


/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 */
export const  postUsers = async (req,res)=>{
    const {email, password, nickname} = req.body;

    // 빈 이메일 체크
    if (!email)
        return res.send(response(baseResponse.SIGNIN_EMAIL_EMPTY));
    
    // 길이 체크
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNIN_EMAIL_LENGTH));

    // 형식 체크, 모듈 사용
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNIN_EMAIL_ERROR_TYPE));

    // 기타 등등 미션에 따라서 추가하기

    //비밀번호 체크 
    if (!password)
        return res.send(response(baseResponse.SIGNIN_PASSWORD_EMPTY));

    //비밀번호 길이 체크 
    if(password.length<6 || password.length>20)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));

    //닉네임 비어있는지 체크 
    if(!nickname)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_EMPTY));
    
    //닉네임 길이 20 넘는지 체크 
    if(nickname>20)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_LENGTH));

    const signUpResponse = await createUser(email, password, nickname);
    return res.send(signUpResponse);
}


/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 */
export const getUsers = async (req,res) =>{
    /**
     * Query String: email
     */

    const {query:{email}} = req; //path variable, 쿼리 스트링, 바디가 있는지? 없는지, 있다면 너무 긴 것은 아닌가? 이런 순수 문자 그대로의 형식만 체크
    // const email = req.query.email 여기서 query가 query string임

    if(!email){
        // 이메일로 특정하지 않았다면 유저 전체 조회 얘는 뭐 건드릴게 없겠네 
        const userListResult = await retrieveUserList();
        return res.send(response(baseResponse.SUCCESS, userListResult));
    }else{
        //이메일로 특정 지었다면 우째?
        const emailRows = await emailCheck(email);
        if(emailRows<=0) //해당하는 애가 없다면 
            return res.send(response(baseResponse.USER_USEREMAIL_NOT_EXIST));
        
        const userListbyEmail = await retrieveUserList(email);
        return res.send(response(baseResponse.SUCCESS, userListbyEmail));
    }
}

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/{userId}
 */

export const getUserById = async(req,res) =>{

    /**
     * Path Variable: userId
     */

    const {params:{userId}} = req;
    console.log(userId);

    if (!userId)
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    
    const userByUserId = await retrieveUser(userId); //id값을 담는다. 없으면 어찌되는거지?
    //조회했는데 없어! 그러면 뭐를 return하지 그냥 flase인가?
    if(!userByUserId)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));
    
    return res.send(response(baseResponse.SUCCESS,userByUserId));
}


// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */

export const login = async (req,res)=>{
    const {email, password} = req.body;

    // TODO: email, password 형식적 Validation

    const signInResponse = await postSignIn(email,password);

    return res.send(signInResponse);
}


/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */

export const patchUsers = async (req,res) =>{
    const userIdFromJWT = req.verifiedToken.userId;

    const {params:{userId}, body:{nickname}} = req;

    if (userIdFromJWT != userId)
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    else{
        if (!nickname)
            return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));
        
        const editUserInfo = await editUser(userId,nickname);
        return res.send(editUserInfo);
    }
}