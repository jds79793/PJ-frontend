import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useProductDetail } from '../../context/ProductDetailContext';

import { Button, Rating } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";

import styles from '../../styles/shop/ProductDetail.module.css';

const ProductDetail = () => {
  const userId = 1; // 임시로 설정한 userId 변수 -> 추후 수정해야 함

  const { productNum } = useParams(); // productNum을 useParams로 추출

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [count, setCount] = useState(1);
  const [data, setData] = useState(null);
  const { setTotalPrice } = useProductDetail();
  const { setQuantity } = useProductDetail();

  const [isFavorite, setIsFavorite] = useState();

  // 날짜 yyyy-mm-dd로 변경
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  useEffect(() => {
    async function fetchUserWishlist() {
      try {
        const response = await fetch(`/wishlist/${userId}`);
        if (response.ok) {
          const wishlistItems = await response.json();
          // eslint-disable-next-line eqeqeq
          const isItemInWishlist = wishlistItems.some((item) => item.productId == productNum);
          setIsFavorite(isItemInWishlist);
        }
      } catch (error) {
        console.error("오류 발생", error);
      }
    }
    fetchUserWishlist();
  }, [userId, productNum]);

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFromWishlist();
    } else {
      addToWishlist();
    }
    setIsFavorite((prevState) => !prevState); // 찜 상태 변경
  };

  const addToWishlist = async () => {
    try {
      const response = await fetch(`/wishlist/add?userId=${userId}&productId=${productNum}`, {
        method: "POST",
      });

      if (response.ok) {
        console.log("상품이 위시리스트에 추가되었습니다.");
      } else {
        console.error("상품 추가 실패");
      }
    } catch (error) {
      console.error("오류 발생", error);
    }
  };

  const removeFromWishlist = async () => {
    try {
      const response = await fetch(`/wishlist/remove?userId=${userId}&productId=${productNum}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("상품이 위시리스트에서 삭제되었습니다.");
      } else {
        console.error("상품 삭제 실패");
      }
    } catch (error) {
      console.error("오류 발생", error);
    }
  };

  useEffect(() => {
    axios
      .get(`/shopping/products/${productNum}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
        setData(null); // 에러 발생 시 data를 null로 설정
      });
  }, [productNum]);

  const countUp = () => setCount((prevCount) => prevCount + 1);
  const countDown = () => setCount((prevCount) => prevCount - 1);
  // const value = (e) => setCount(Number(e.target.value));
  const addCart = (userId, productNum, count) => {
    axios
      .get("/cart/checkCart", {
        // 해당 유저의 장바구니에 이미 상품이 있는지 확인하기
        params: {
          userId: userId,
          productId: productNum,
        },
      })
      .then((response) => {
        console.log(response.data);
        if (response.data === false) {
          // 상품이 없으면
          axios
            .post("/cart", {
              // 장바구니에 추가
              userId: userId,
              productId: productNum,
              quantity: count,
            })
            .then(() => {
              alert("장바구니에 담았습니다");
            })
            .catch((error) => {
              console.error("Error adding to cart:", error);
            });
        } else {
          // 상품이 이미 장바구니에 있으면 alert
          alert("이미 장바구니에 담긴 상품입니다");
        }
      })
      .catch((error) => {
        console.error("Error checking cart:", error);
      });
  };

  if (data === null) {
    return <div>Loading...</div>; // 로딩 메시지 표시
  }

  //formattedReviews 생성을 data가 로드된 이후에 수행
  const formattedReviews = data.reviews.map((item) => ({
    ...item,
    createdAt: formatDate(item.createdAt),
    updatedAt: formatDate(item.updatedAt),
  }));

  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value);
    if (e.target.value === "" || newValue < 1) {
      setCount(1);
    } else if (newValue > data.stockQuantity) {
      setCount(data.stockQuantity);
    } else {
      setCount(newValue);
    }
  };

  const handleBuyNow = () => {
    const selectedItems = [
      {
        userId: userId,
        productId: productNum,
        quantity: count,
        price: data.price,
      },
    ];

    setQuantity(count);
    setTotalPrice(data.price * count);

    dispatch({
      type: "SET_ORDER",
      payload: {
        userId: userId,
        totalPrice: data.price * count,
        deliveryDate: "",
        address: "",
        phoneNumber: "",
        orderDate: "",
        orderStatus: "",
        quantity: count,
      },
    });

    navigate(`/shopping/order`, { state: { selectedItems } });
  };

  const handleDeleteProduct = (productId, thumbnailUrl, productImageUrls) => {
    // thumbnailUrl과 productImageUrls를 사용해서 S3 객체 키들을 생성
    const thumbnailObjectKey = thumbnailUrl.split("/").pop(); // 마지막 부분을 추출하여 S3 객체 키로 사용
    const imageObjectKeys = productImageUrls.map((url) => url.split("/").pop());
    // 모든 이미지 URL의 마지막 부분을 추출하여 S3 객체 키들로 사용

    axios
      .delete(`/shopping/${productId}`)
      .then(() => {
        // DELETE 요청 성공 처리
        console.log("상품 삭제 성공");

        // 여기서 S3 thumbnailUrl 삭제 요청 보내기
        axios
          .delete(`/api/${thumbnailObjectKey}`)
          .then(() => {
            console.log("S3 썸네일 삭제 성공");
          })
          .catch((error) => {
            console.log("S3 썸네일 객체 삭제 실패".error);
          });

        // productImageUrls 삭제 요청
        imageObjectKeys.forEach((imageObjectKey) => {
          axios
            .delete(`/api/${imageObjectKey}`)
            .then(() => {
              console.log("S3 상품 상세 이미지 삭제 성공");
            })
            .catch((error) => {
              console.log("S3 상품 상세 이미지 삭제 실패", error);
            });
        });

        // 리스트로 돌아가기
        navigate("/shopping");
      })
      .catch((error) => {
        // DELETE 요청 실패 처리
        console.log("상품 삭제 실패", error);
      });
  };

  const handleProductUpdate = () => {
    // "상품 수정" 버튼을 클릭할 때 ProductUpdate 페이지로 이동하면서 productId를 전달
    navigate(`/shopping/update/${productNum}`);
  };

  return (
    <div className={styles.contentWrap}>
      {/* 카테고리 시작 */}
      <div className={styles.cateName}>
        <a className={styles.categoryLink} href={`/shopping/category/${data.categoryId}`}>
          {data.categoryName}
        </a>
      </div>
      {/* 카테고리 끝 */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={handleProductUpdate}>
          상품 수정
        </Button>
        <br />
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDeleteProduct(data.productId, data.thumbnailUrl, data.productImageUrls)}
        >
          상품 삭제
        </Button>
      </div>
      {/* 썸네일, 제품명, 가격 시작 */}
      <div className={styles.productContainer}>
        <div className={styles.imgContainer}>
          <div>
            <div style={{ filter: data.stockQuantity === 0 ? "grayscale(100%)" : "none" }}>
              <img className={styles.repImg} src={data.thumbnailUrl} alt={data.productName} />
            </div>
            <div
              onClick={toggleFavorite}
              style={{
                textAlign: "right",
                cursor: "pointer",
                color: isFavorite ? "yellow" : "lightgray",
              }}
            >
              <BookmarkIcon style={{ width: "40px", height: "40px" }} />
            </div>
          </div>
        </div>
        <div>
          <h2 className={styles.prodName}>{data.productName}</h2>
          <div className={styles.priceName}>{data.price.toLocaleString()}원</div>

          {/* 수량 선택 & 총 가격 */}
          <div className={styles.quantity}>
            <button
              className={`${styles.quantityBtn} ${styles.sameSizeElements}`}
              onClick={countDown}
              disabled={count < 2}
            >
              -
            </button>
            <input
              className={`${styles.quantityNum} ${styles.sameSizeElements}`}
              // onChange={value}
              onChange={(e) => handleInputChange(e)}
              value={count}
              min="1" // 최소값 설정
              max={data.stockQuantity} // 최대값 설정 - 재고수량
            ></input>
            <button
              className={`${styles.quantityBtn} ${styles.sameSizeElements}`}
              onClick={countUp}
              disabled={count >= data.stockQuantity}
            >
              +
            </button>
            <span className={styles.totalPrice}>{(data.price * count).toLocaleString()}원</span>
          </div>
          {data.stockQuantity === 0 ? (
            <div className={styles.stockMessage}>품절</div>
          ) : (
            <div>남은 수량 : {data.stockQuantity.toLocaleString()} 개</div>
          )}
          <div className={styles.cartBuy}>
            {/* 장바구니 - userId가 없으면 로그인 후 이용 알림창 */}
            <button
              className={styles.cartBtn}
              onClick={() => (userId ? addCart(userId, productNum, count) : alert("로그인 후 이용해주세요"))}
              disabled={data.stockQuantity === 0} // 품절 상태일 때 버튼 비활성화
            >
              장바구니
            </button>
            {/* 바로구매 */}

            <button
              className={styles.buyBtn}
              size="large"
              variant="contained"
              onClick={handleBuyNow} // 바로구매 버튼 클릭 시 이벤트 핸들러 연결
              disabled={data.stockQuantity === 0} // 품절 상태일 때 버튼 비활성화
            >
              바로구매
            </button>
          </div>
          {/* <p>Stock Quantity: {data.stockQuantity}</p>  재고수량*/}
        </div>
      </div>
      {/* 썸네일, 제품명, 가격 끝 */}
      {/* 상세이미지 시작 */}
      <h3>상세정보</h3>
      <div className={styles.detailContainer}>
        {data.productImageUrls.map((imageUrl, index) => (
          <>
            <img className={styles.detailImg} key={index} src={imageUrl} alt={`Product ${index}`} />
            <br />
          </>
        ))}
      </div>

      {/* 상세이미지 끝 */}
      {/* 리뷰 시작 */}
      <h3>구매후기</h3>
      <div className={styles.reviewContainer}>
        <div>
          {formattedReviews.map((review) => (
            <div key={review.reviewId}>
              <span>
                <Rating name="read-only" value={review.rating} readOnly size="small" />{" "}
              </span>
              <div>
                <div>
                  <span className={styles.name}>{review.nickname}</span>
                </div>
                <div className={styles.date}>{review.createdAt}</div>
              </div>

              <p>{review.comment}</p>
              <hr />
            </div>
          ))}
        </div>
      </div>
      {/* 리뷰 끝 */}
    </div>
  );
};

export default ProductDetail;