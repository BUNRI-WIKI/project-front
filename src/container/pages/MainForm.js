import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import { HiXCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { Trash } from "./trash";
import axios from "axios";
import "../../Button.css";
import "../../style.css";

function MainForm() {
  const [isActive, setActive] = useState(false);
  const [query, setQuery] = useState("");
  const [image, setImage] = useState(null);
  const [lastFile, setLastFile] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const { register, handleSubmit } = useForm();

  const inputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    e.preventDefault();
    const files = e.target.files || e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setLastFile(file);
      console.log("Local file uploaded:", imageUrl);
      e.target.value = null;
      setActive(true);
    }
  };
  const handleImageClick = () => {
    inputRef.current.click();
    setActive(!isActive);
  };
  const handleImageRemove = () => {
    alert("파일 업로드가 취소되었습니다.");
    setImage(null);
    setActive(false);
    setLastFile(null);
    inputRef.current.value = null;
    cameraInputRef.current.value = null;
  };
  const handleUploadComplete = async () => {
    if (lastFile) {
      console.log("GET 요청 파일명 :", lastFile.name);
      axios({
        method: "get",
        url: "http://3.39.190.90/api/separation",
      })
        .then((result) => {
          const data = result.data;
          console.log("데이터:", data);
          navigate("/loading");
        })
        .catch((error) => {
          console.error("에러 :", error);
        });
    }
  };
  const onSubmit = (data) => {
    const searchTerm = data.searchTerm.trim();
    if (searchTerm !== "") {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };
  const navigateToSearch = (selectedQuery) => {
    navigate(`/search?query=${encodeURIComponent(selectedQuery)}`);
  };
  const ScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div className="NotDrag" style={{ paddingTop: "50px" }}>
      <h2>찾고자 하는 쓰레기를 검색해보세요!</h2>
      <div className="trash-search-container">
        <form
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          className="search-form"
        >
          <div className="search-input-container">
            <input
              {...register("searchTerm")}
              type="text"
              placeholder="이름 또는 태그로 검색하기"
              className="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {isFocused && query && query.length > 0 && (
              <HiXCircle
                className="clear-search-button"
                onClick={() => setQuery("")}
                style={{ color: "gray" }}
              />
            )}
            <div>
              {query && query.length > 0 && (
                <div className="list">
                  {Trash.filter((target) => target.name.includes(query)).map(
                    (target) => (
                      <ul
                        key={target.id}
                        className="list-item"
                        onClick={() => navigateToSearch(target.name)}
                      >
                        {target.name}
                      </ul>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </form>
        <button type="submit" className="search-button" aria-label="검색">
          <FaSearch className="search-icon" />
        </button>
      </div>
      <h2>찾고자 하는 쓰레기를 업로드해보세요!</h2>
      <div>
        <input
          type="file"
          ref={inputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <input
          type="file"
          id="camera"
          name="camera"
          capture="camera"
          accept="image/*"
          ref={cameraInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        {image ? (
          <div>
            <button onClick={() => inputRef.current.click()}>사진 촬영</button>
            <button onClick={handleUploadComplete}>업로드 완료</button>
            <img src={image} className="uploaded-image" alt="Uploaded" />
            <button onClick={handleImageRemove}>사진 지우기</button>
          </div>
        ) : (
          <button
            className={`upload-button ${isActive ? "active" : ""}`}
            onClick={handleImageClick}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileChange}
          >
            클릭이나 드래그로 사진 업로드
          </button>
        )}
        <button onClick={ScrollToTop} className="MoveTopBtn" />
      </div>
    </div>
  );
}
export default MainForm;
