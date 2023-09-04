// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { changeField, initializeForm, register } from "../../modules/auth";
// import AuthForm from "../../components/auth/AuthForm";
// import { check } from "../../modules/user";
// import { useNavigate } from "react-router-dom";
// import AuthForm02 from "../../components/auth/AuthForm02";

// const RegisterForm = () => {
//     const dispatch = useDispatch();
//     const {form, auth, authError, user} = useSelector(({auth, user}) => ({
//         form: auth.register,
//         auth: auth.auth,
//         authError: auth.authError,
//         user: user.user
//     }));
    
//     // 인풋 변경 이벤트 핸들러
//     const onChange = e => {
//         const{value, name} = e.target;
//         dispatch(
//             changeField({
//                 form:'register',
//                 key: name,
//                 value
//             })
//         );
//     };

//     // 폼 등록 이벤트 핸들러
//     const onSubmit = e => {
//         e.preventDefault();
//         const{username, password, passwordConfirm} = form;
//         if(password !== passwordConfirm){
//             // TODO: 오류처리
//             return;
//         }
//         dispatch(register({ username,password }));
//     };

//     // 컴포넌트가 처음 렌더링될 때 form을 초기화함   ->   안하면 다른 페이지로 이동 후 돌아왔을 때 값이 유지된 채 보임
//     useEffect(() => {
//         dispatch(initializeForm('register'));
//     }, [dispatch]);

//     // 회원가입 성공/실패 처리
//     useEffect(() => {
//         if(authError) {
//             console.log('오류발생');
//             console.log(authError);
//             return;
//         }
//         if(auth){
//             console.log('회원가입 성공');
//             console.log(auth);
//             dispatch(check());
//         }
//     }, [auth, authError, dispatch]);

//     const navigate = useNavigate();

//     // user값이 잘 설정되었는지 확인
//     useEffect(() => {
//         if(user){
//             navigate('/');      // 홈 화면으로 이동
//         }
//     }, [navigate, user]);

//     return (
//         <AuthForm02
//             type='register'
//             form={form}
//             onChange={onChange}
//             onSubmit={onSubmit}
//         />
//     );
// };

// export default RegisterForm;