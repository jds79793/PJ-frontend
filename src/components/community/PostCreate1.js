// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router';
// // import { useForm, Controller } from 'react-hook-form'
// import FileUploadComponent from "../../components/shop/FileUploadComponent";
// import styles from '../../styles/community/PostCreate.module.css';

// import { url } from 'koa-router';

// const PostCreate = () => {
//     const [title, setTitle] = useState('');
//     const [content, setContent] = useState('');
//     const [category, setCategory] = useState('');
//     const [nickname, setNickname] = useState('');
//     const [file, setFile] = useState(null);
//     const userId = 1;
//     const [imageUrl1, setImageUrl1] = useState('');
//     const [imageUrl2, setImageUrl2] = useState('');
//     const [imageUrl3, setImageUrl3] = useState('');
    
//     const categories = [
//         { id: 1, name: '자유게시판' },
//         { id: 2, name: '오운완' },
//         { id: 3, name: '식단'},
//     ];

//     const navigate = useNavigate();

//     const handleTitleChange = (e) => {
//         setTitle(e.target.value);
//     };

//     const handleContentChange = (e) => {
//         setContent(e.target.value);
//     };

//     const handleCategoryChange = (e) => {
//         setCategory(e.target.value);
//     };

//     const handleNicknameChange = (e) => {
//         setNickname(e.target.value);
//     }

//     const handleFileChange = (e) => {
//         setFile(e.target.files[0]);
//     }


//     const handleUploadSuccess =(url) => {
//         setImageUrl1(url);
//         setImageUrl2(url);
//         setImageUrl3(url);
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault();
    

//         // 서버로 보낼 데이터 구성
//         const postData = new FormData();
//         postData.append ('userId', userId);
//         postData.append ('title', title);
//         postData.append ('content', content);
//         postData.append ('category', category);
//         postData.append ('nickname', nickname);
//         postData.append ('file', file);
//         postData.append ('imageUrl1', imageUrl1);
//         postData.append ('imageUrl2', imageUrl2);        
//         postData.append ('imageUrl3', imageUrl3);

//         if (!title && !content) {
//             alert("제목, 내용을 입력해주세요.");
//         } else if (!title) {
//             alert ("제목을 입력해주세요.");
//         } else if (!content) {
//             alert ("내용을 입력해주세요.");
//         } else {

//             try {
//                 // '/post/create' 경로에 post 요청 보내기
//                 await axios.post('/post/create', postData, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data' // 파일 업로드 시 Content-Type 설정
//                     }
//                 });

//                 alert('게시글이 등록되었습니다.');

//                 // 입력 필드 초기화
//                 setTitle('');
//                 setContent('');
//                 setFile(null);

//                 navigate('/post/list');
//             } catch (error) {
//                 console.error('게시글 등록 실패', error);
//                 alert('게시글 등록에 실패했습니다.');
//             }
//         }

//     }; 

//     return (
//         <div>
//             <h2 style={{textAlign:"center"}}>글 작성 페이지</h2>
//             <div className={styles['post-create-container']}> {/* 클래스 이름을 가져옴 */}
//                 <form onSubmit={handleSubmit} className={styles['post-form']}> {/* 클래스 이름을 가져옴 */}
//                     <div className={styles['form-row']}>
//                     <   label className={styles['form-label']}>
//                             작성자:
//                             <input
//                                 type="text"
//                                 value={nickname}
//                                 onChange={handleNicknameChange}
//                                 className={styles['input-field']}
//                             />
//                         </label>

//                         <label className={styles['form-label']}>
//                             카테고리:
//                             <select
//                                 value={category}
//                                 onChange={handleCategoryChange}
//                                 className={styles['input-field']}
//                             >
//                                 {categories.map((category) => (
//                                     <option key={category.id} value={category.id}>
//                                         {category.name}
//                                     </option>
//                                 ))}
//                             </select>
//                         </label>
                        
//                     </div> <br />

//                     <label>
//                         제목: 
//                         <input
//                             type="text"
//                             value={title}
//                             onChange={handleTitleChange}
//                             className={styles['input-field']} // 클래스 이름을 가져옴
//                             style={{width: '100%'}}
//                         />
//                     </label>
//                     <br />

//                     <label>
//                         내용: 
//                         <textarea
//                             value={content}
//                             onChange={handleContentChange}
//                             className={styles['input-field']} // 클래스 이름을 가져옴
//                             style={{width: '100%', height: '200px'}}
//                         />
//                     </label>
//                     <br />


//                     <FileUploadComponent onUploadSuccess={(url) => setImageUrl1(url)} />
//                     <FileUploadComponent onUploadSuccess={(url) => setImageUrl2(url)} />
//                     <FileUploadComponent onUploadSuccess={(url) => setImageUrl3(url)} />


                    
//                     <input
//                         type="submit"
//                         value="등록"
//                         className={styles['submit-button']} // 클래스 이름을 가져옴
//                     />
                    
//                     <input 
//                         type='hidden'
//                         value={userId} 
//                      />
                   
//                 </form>
//             </div>
//         </div>
        
//     );

// };

// export default PostCreate;