import "./OcrRequest.css";
import React, { useRef, useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { useProfile } from "../hooks/useProfile";
import { useDataHolder } from "../hooks/useDataHolder";
import { useOcrRetouch } from "../utils/OcrToStats";
import { createEmptyEcho } from "../data/Echos";

function OcrRequest({sizeValue, index = 1, isDebug = false }) {
  const OcrRef = useRef();
  const fileInputRef = useRef();

  const [file, setFile] = useState(null);
  const [isfocused, setIsFocused] = useState(null);
  /// Idle | Requested | Successed | Failed | Applied
  const [ocrStatus, setOcrStatus] = useState("Idle");

  const [debug, setDebug] = useState("stay tune");
  const [ocrEchoData, setOcrEchoData] = useState(createEmptyEcho(4));

  const { ocrApiUrl } = useApi();
  const { lang } = useProfile();
  const { echoImageBase64, setImageHolder } = useDataHolder();
  const { OcrToStats } = useOcrRetouch();
  const { PatchEcho } = useProfile();

  const uiText = (idx) => {
    const texts = {
      kr: [
        "* 인식결과는 정확하지 않을 수 있습니다. 반드시 재확인 해주세요",
        "* 인식기능에 관련해서 문제가 있거나, 문의사항은 inweag80@gmail.com으로 연락 바랍니다",
        '"더블클릭하여 이미지파일 선택" 혹은 "Ctrl + V로 사진 붙여넣기"',
        "인식 요청 대기중",
        "인식서버 요청 대기중...",
        "요청 성공! 수치를 적용할까요?",
        "요청 실패함",
        "수치 적용 성공",
        "인식 시작"
      ],
      en: ['"Double click to upload file" or "Ctrl + V to paste image"'],
      jp: ['"ダブルクリックで画像を選択" または "Ctrl + Vで画像を貼り付け"'],
      zh: ['"双击选择图片文件" 或 "Ctrl + V粘贴图片"'],
    };
    return texts[lang][idx] || "error";
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (OcrRef.current && !OcrRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    const handlePaste = (e) => {
      if (!isfocused) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const blob = items[i].getAsFile();
          const reader = new FileReader();

          reader.onload = (event) => {
            setImageHolder(index, event.target.result);
            setFile(blob);
          };

          reader.readAsDataURL(blob);
          break;
        }
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [isfocused]);

  function handleFileChange(item) {
    const file = item.target.files[0];
    if (!file) return;

    setIsFocused(false);

    const reader = new FileReader();
    reader.onload = (item) => {
      setImageHolder(index, item.target.result);
    };
    reader.readAsDataURL(file);
    setFile(file);
  }
  function RequestOCR() {
    if (!file) return;

    setOcrStatus("Requested")
    const formData = new FormData();
    formData.append("file", file);

    fetch(`${ocrApiUrl[lang]}`, {
      method: "POST",
      body: formData,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        const data = await res.json();

        if (data.image_base64) {
          const imageUrl = `data:image/jpeg;base64,${data.image_base64}`;
          setImageHolder(index, imageUrl);
        }
        console.log(data.texts);
        setDebug(JSON.stringify(OcrToStats(data.texts, lang), null, 2));
        setOcrEchoData(OcrToStats(data.texts, lang));
        setOcrStatus("Successed")
      })
      .catch((err) => {
        console.error("OCR 요청 실패:", err);
        setOcrStatus("Failed")
      });
  }

  return (
    <div style={{ width: "100%", height: "100%", alignContent: "center" }}>
      <span
        className="ocr-request-info-text"
        style={{ fontSize: `${19 * sizeValue}px` }}>
        {uiText(0)}
      </span>
      <span
        className="ocr-request-info-text"
        style={{ fontSize: `${19 * sizeValue}px` }}>
        {uiText(1)}
      </span>
      <div
        ref={OcrRef}
        className={`ocr-request-slot${isfocused ? " focused" : ""}`}
        onClick={() => {
          setIsFocused(true);
        }}
        onDoubleClick={() => {
          fileInputRef.current?.click();
        }}>
        {isfocused ? (
          <div style={{ width: "100%", height: "100%" }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              draggable="false"
              style={{
                display: "none",
                userSelect: "none",
                WebkitUserSelect: "none",
              }}
              onChange={handleFileChange}
            />
            <span
              className="ocr-request-text"
              style={{ fontSize: `${26 * sizeValue}px` }}>
              {uiText(2)}
            </span>
            <img className="ocr-image focused" src={echoImageBase64[index]} />
          </div>
        ) : (
          <div style={{ width: "100%", height: "100%" }}>
            <span className="ocr-request-text" style={{ fontSize: `${26 * sizeValue}px` }}>Click to start</span>
            <img className="ocr-image" src={echoImageBase64[index]} />
          </div>
        )}
      </div>
      <div className="ocr-request-button-slot">
        {(() => {
          switch (ocrStatus) {
            case "Idle":
              return (
                <span className={`${lang}Font ocr-status-text`}>
                  {uiText(3)}
                </span>
              );
            case "Requested":
              return (
                <span className={`${lang}Font ocr-status-text request`}>
                  {uiText(4)}
                </span>
              );
            case "Successed":
              return (
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}>
                  <span className={`${lang}Font ocr-status-text success`}>
                    {uiText(5)}
                  </span>
                  <button
                    className="ocr-result-button"
                    onClick={() => {
                      setOcrStatus("Idle");
                    }}>
                    <span
                      className={`${lang}Font`}
                      style={{ fontSize: `${26 * sizeValue}px` }}>
                      No
                    </span>
                  </button>
                  <button
                    className="ocr-result-button"
                    onClick={() => {
                      PatchEcho(index, ocrEchoData);
                      setOcrStatus("Applied");
                    }}>
                    <span
                      className={`${lang}Font`}
                      style={{ fontSize: `${26 * sizeValue}px` }}>
                      Yes
                    </span>
                  </button>
                </div>
              );
            case "Failed":
              return (
                <span className={`${lang}Font ocr-status-text fail`}>
                  {uiText(6)}
                </span>
              );
            case "Applied":
              return (
                <span className={`${lang}Font ocr-status-text success`}>
                  {uiText(7)}
                </span>
              );
            default:
              return <span>Status Error</span>;
          }
        })()}
        <button
          className="ocr-request-button"
          disabled={ocrStatus === "Requested" || ocrStatus === "Successed"}
          onClick={() => {
            if (ocrStatus !== "Requested" && ocrStatus !== "Successed")
              RequestOCR();
          }}>
          <span className={`${lang}Font`}>{uiText(8)}</span>
        </button>
      </div>
      {isDebug ? (
        <div style={{ color: "#fff", backgroundColor: "#000" }}>{debug}</div>
      ) : null}
    </div>
  );
}
export default OcrRequest;
