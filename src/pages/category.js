// 2. 카테고리
import React, { use, useEffect, useRef, useState } from "react";
import categoryStyle from "@/styles/category.module.scss";
import Card from "@/components/Card";
import GenresTapBar from "@/components/GenresTapBar";
import { fn } from "@/utils/apiFunc";
import movePageStore from "../store/movePage_store";
import { useRouter } from "next/router";

function Category() {
  const [all, setAll] = useState(1);
  const [clickedGenre, setClickedGenre] = useState();
  const [functionData, setFunctionData] = useState([]);

  // [↓] 여기변경 =============
  const { categoryStoreData, setCategoryStoreData } = movePageStore(); //movePageData=[장르인덱스, all인덱스]
  // [↑] 여기변경 =============

  const genreMapping = [
    "GGGA",
    "AAAA",
    "CCCD",
    "BBB",
    "CCCA",
    "CCCC",
    "EEEB",
    "EEEA",
  ];

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const loadMoreRef = useRef(null);

  const router = useRouter();


  const tab = (i) => {
    if(i == all){
      setFunctionData([]);
      loadMoreData(1);
    }
    setAll(i);
    setFunctionData([]);
    setPage(1);
    setHasMore(true);
  };

  const handleGenreClick = (genreIndex) => {
    if(genreIndex == clickedGenre){
      setFunctionData([]);
      loadMoreData(1);
    }
    setClickedGenre(genreIndex);
    setCategoryStoreData(genreIndex, 1); //여기변경 =============
    setAll(1); // 전체 탭으로 설정
    setFunctionData([]); // 데이터 초기화
    setPage(1); // 페이지 초기화
    setHasMore(true); // 더 가져올 데이터가 있다고 설정
  };

  const loadMoreData = async (pageNumber) => {
    try{
      setIsLoading(true); // 데이터 로드 시작
      
      const shcateValue = genreMapping[clickedGenre];
      
      let data = [];
      switch (all) {
        case 1:
          data = await fn.genre(shcateValue, pageNumber);
          break;
        case 2:
          data = await fn.thisWeek(shcateValue, pageNumber);
          break;
        case 3:
          data = await fn.ing(shcateValue, pageNumber);
          break;
        case 4:
          data = await fn.upcoming(shcateValue, pageNumber);
          break;
        default:
          setIsLoading(false); // 로딩 상태 종료
          break;
      }
  
      data = Array.isArray(data) ? data : data ? [data] : [];
  
      if (data.length === 0) {
        setHasMore(false);
      } else if (pageNumber === 1){
        setFunctionData(data);
      } else {
        setFunctionData((prevData) => [...prevData, ...data]);
      }
      
      if (data.length < 20) {
        setHasMore(false);
      }
  
      setIsLoading(false);

    } catch (err){
      router.replace('/500');
    }
  };


  useEffect(() => {
    if(clickedGenre==0 || clickedGenre){
      setCategoryStoreData(clickedGenre, all); //store저장
      loadMoreData(page);
    }
  }, [page, clickedGenre, all]);


  // 메인에서 카테고리 진입 시 장르, all 변경
  useEffect(() => {
    setClickedGenre(categoryStoreData[0]);
    setAll(categoryStoreData[1]);
  
    return () => {
      setCategoryStoreData(0, 1); // 기본값으로 초기화
    };
  }, []);


  //무한
  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];

    if (entry.isIntersecting && hasMore && !isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  });

  useEffect(() => {
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, isLoading]);

  return (
    <div className={`categoryCommon ${categoryStyle.category}`}>
      <div className={categoryStyle.genresTapBarWrap}>
        <GenresTapBar
          clickedGenre={clickedGenre}
          setClickedGenre={handleGenreClick}
        />
      </div>

      <ul>
        <li
          className={all === 1 ? categoryStyle.selected : ""}
          onClick={() => tab(1)}
        >
          <button>전체</button>
          <div></div>
        </li>
        <li
          className={all === 2 ? categoryStyle.selected : ""}
          onClick={() => tab(2)}
        >
          <button>이번주</button>
          <div></div>
        </li>
        <li
          className={all === 3 ? categoryStyle.selected : ""}
          onClick={() => tab(3)}
        >
          <button>공연중</button>
          <div></div>
        </li>
        <li
          className={all === 4 ? categoryStyle.selected : ""}
          onClick={() => tab(4)}
        >
          <button>공연 예정</button>
          <div></div>
        </li>
      </ul>

      <section>
        {all === 1 && functionData.length !== 0 && (
          <div className={categoryStyle.grid}>
            {functionData.map((item, i) => (
              <Card key={i} item={item} />
            ))}
          </div>
        )}
        {all === 2 && functionData.length !== 0 && (
          <div className={categoryStyle.grid}>
            {functionData.map((item, i) => (
              <Card key={i} item={item} />
            ))}
          </div>
        )}
        {all === 3 && functionData.length !== 0 && (
          <div className={categoryStyle.grid}>
            {functionData.map((item, i) => (
              <Card key={i} item={item} />
            ))}
          </div>
        )}
        {all === 4 && functionData.length !== 0 && (
          <div className={categoryStyle.grid}>
            {functionData.map((item, i) => (
              <Card key={i} item={item} />
            ))}
          </div>
        )}

        <p className={categoryStyle.nogongyeon}>
          {isLoading
            ? "로딩중..."
            : functionData.length == 0
            ? "공연이 없습니다."
            : ""}
        </p>
        { !isLoading && hasMore && functionData.length >= 20 && <div ref={loadMoreRef} style={{ height: "20px" }} />}
      </section>
    </div>
  );
}

export default Category;
