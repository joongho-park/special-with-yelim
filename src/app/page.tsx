"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Typewriter from "typewriter-effect";
import styles from "./styles/page.module.scss";

export default function Main() {
  const [loading, setLoading] = useState(true);
  const [loadingFadeOut, setLoadingFadeOut] = useState(false);
  const [openAccount, setOpenAccount] = useState<"groom" | "bride" | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  // 터치 스와이프 관련 state
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);
  const [touchStartY, setTouchStartY] = useState<number>(0);

  // 갤러리 이미지 배열 (실제 이미지 경로로 변경 필요)
  const galleryImages = [
    "/assets/images/gallery/1.jpg",
    "/assets/images/gallery/2.jpg",
    "/assets/images/gallery/3.jpg",
    "/assets/images/gallery/4.jpg",
    "/assets/images/gallery/5.jpg",
    "/assets/images/gallery/6.jpg",
  ];

  // 타이핑 효과가 완료되면 로딩 화면 제거
  const handleTypingComplete = () => {
    // 타이핑 완료 후 약간의 딜레이를 주고 페이드아웃 시작
    setTimeout(() => {
      setLoadingFadeOut(true);
      // fadeOut 애니메이션이 끝난 후 로딩 상태 해제
      setTimeout(() => {
        setLoading(false);
      }, 600); // fadeOut 애니메이션 시간
    }, 1000);
  };

  const accounts = [
    {
      bank: "우리은행",
      number: "1002-736-448724",
      holder: "박중호",
    },
  ];

  const handleToggle = (type: "groom" | "bride") => {
    setOpenAccount(openAccount === type ? null : type);
  };

  const handleCopy = async (accountNumber: string, type: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedAccount(type);
      setTimeout(() => setCopiedAccount(null), 2000);
    } catch {
      alert("복사에 실패했습니다.");
    }
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const handleImageClick = (index: number) => {
    return;
    setSelectedImage(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleModalPrev = () => {
    setSelectedImage((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleModalNext = () => {
    setSelectedImage((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  // 터치 스와이프 핸들러 (슬라이더용)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;

    setTouchEnd(currentX);

    // 가로 스와이프가 세로 스크롤보다 크면 기본 스크롤 방지
    const diffX = Math.abs(currentX - touchStart);
    const diffY = Math.abs(currentY - touchStartY);

    if (diffX > diffY && diffX > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50; // 최소 스와이프 거리 (px)

    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance > 0) {
      // 왼쪽으로 스와이프 (다음 이미지)
      handleNextSlide();
    } else {
      // 오른쪽으로 스와이프 (이전 이미지)
      handlePrevSlide();
    }

    // 초기화
    setTouchStart(0);
    setTouchEnd(0);
  };

  // 터치 스와이프 핸들러 (모달용)
  const handleModalTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleModalTouchMove = (e: React.TouchEvent) => {
    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;

    setTouchEnd(currentX);

    // 가로 스와이프가 세로 스크롤보다 크면 기본 스크롤 방지
    const diffX = Math.abs(currentX - touchStart);
    const diffY = Math.abs(currentY - touchStartY);

    if (diffX > diffY && diffX > 10) {
      e.preventDefault();
    }
  };

  const handleModalTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance > 0) {
      handleModalNext();
    } else {
      handleModalPrev();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // 모달이 열렸을 때 스크롤 방지 및 위치 유지
  useEffect(() => {
    if (isModalOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;

      // body를 fixed로 설정하여 스크롤 위치 유지
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        // 원래 상태로 복원
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";

        // 저장했던 스크롤 위치로 복원
        window.scrollTo(0, scrollY);
      };
    }
  }, [isModalOpen]);

  return (
    <>
      {/* 로딩 화면 */}
      {loading && (
        <div className={`${styles.loadingScreen} ${loadingFadeOut ? styles.fadeOut : ""}`}>
          <div className={styles.loadingContent}>
            <div className={styles.typewriterText}>
              <Typewriter
                onInit={(typewriter) => {
                  typewriter
                    .typeString('<span class="names">박중호</span>')
                    .pauseFor(200)
                    .typeString('<br/><span class="names">')
                    .typeString("&")
                    .typeString("</span><br/>")
                    .pauseFor(200)
                    .typeString('<span class="names">이예림</span>')
                    .pauseFor(500)
                    .callFunction(() => {
                      handleTypingComplete();
                    })
                    .start();
                }}
                options={{
                  delay: 80,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 메인 컨텐츠 */}
      <div className={`${styles.container} ${!loading ? styles.fadeIn : ""}`}>
        <main className={styles.main}>
          <div className={styles.invitation}>
            <div className={styles.title}>결혼합니다</div>
            <div className={styles.invitationContent}>
              <div className={styles.invitationMessage}>
                <div className={styles.textLine}>화려한 예식 대신 가족들과의 소중한 식사로</div>
                <div className={`${styles.textLine} ${styles.mb}`}>
                  부부로서의 첫걸음을 내딛기로 하였습니다.
                </div>
                <div className={styles.textLine}>격식은 생략하지만 마음만은 깊이 담아</div>
                <div className={styles.textLine}>감사의 인사를 올립니다.</div>
                <div className={styles.textLine}>보내주시는 따뜻한 격려 잊지 않겠습니다.</div>
              </div>
              <div className={styles.invitationMessage}></div>
            </div>
            <div className={styles.from}>
              <div className={styles.textLine}>
                <b>박양열</b>&middot;<b>강현숙</b> 의 장남 <b>박중호</b>
              </div>
              <div className={styles.textLine}>
                <b>이창준</b>&middot;<b>유혜영</b> 의 차녀 <b>이예림</b>
              </div>
            </div>
            <div className={styles.date}>
              <div className={styles.textLine}>2026년 9월 26일 토요일 오전 11시 30분</div>
            </div>
          </div>
          <div className={styles.footer}>
            <div className={styles.footerContent}>
              {/* 갤러리 슬라이더 섹션 */}
              <section className={styles.gallerySection}>
                <h2 className={styles.footerTitle}>우리의 순간들</h2>
                <div className={styles.sliderContainer}>
                  <button
                    className={`${styles.sliderButton} ${styles.sliderButtonPrev}`}
                    onClick={handlePrevSlide}
                    aria-label="이전 이미지"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15 18L9 12L15 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <div
                    className={styles.sliderWrapper}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <div
                      className={styles.sliderTrack}
                      style={{
                        transform: `translateX(-${currentSlide * 100}%)`,
                      }}
                    >
                      {galleryImages.map((image, index) => (
                        <div
                          key={index}
                          className={styles.sliderItem}
                          onClick={() => handleImageClick(index)}
                        >
                          <Image
                            src={image}
                            alt={`갤러리 이미지 ${index + 1}`}
                            width={600}
                            height={400}
                            className={styles.sliderImage}
                            priority={index === 0}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    className={`${styles.sliderButton} ${styles.sliderButtonNext}`}
                    onClick={handleNextSlide}
                    aria-label="다음 이미지"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 18L15 12L9 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                {/* 슬라이더 인디케이터 */}
                <div className={styles.sliderIndicators}>
                  {galleryImages.map((_, index) => (
                    <button
                      key={index}
                      className={`${styles.indicator} ${
                        index === currentSlide ? styles.indicatorActive : ""
                      }`}
                      onClick={() => setCurrentSlide(index)}
                      aria-label={`${index + 1}번 이미지로 이동`}
                    />
                  ))}
                </div>
              </section>

              {/* 마음 전하실 곳 섹션 */}
              <section className={styles.accountSection}>
                <h2 className={styles.footerTitle}>마음 전하실 곳</h2>
                <p className={styles.footerDescription}>
                  참석이 어려우신 분들을 위해
                  <br />
                  계좌번호를 기재하였습니다.
                  <br />
                  너그러운 마음으로 양해 부탁드립니다.
                </p>

                <div className={styles.accountContainer}>
                  <div className={styles.accountCard}>
                    <button
                      className={`${styles.accountButton} ${openAccount === "groom" ? styles.active : ""}`}
                      onClick={() => handleToggle("groom")}
                      aria-expanded={openAccount === "groom"}
                    >
                      <span className={styles.accountButtonText}>계좌번호 확인하기</span>
                      <svg
                        className={`${styles.accountButtonArrow} ${openAccount === "groom" ? styles.rotate : ""}`}
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 7.5L10 12.5L15 7.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <div
                      className={`${styles.accountDetails} ${openAccount === "groom" ? styles.show : ""}`}
                    >
                      <div className={styles.accountList}>
                        {accounts.map((account, index) => (
                          <div key={index} className={styles.accountItem}>
                            <div className={styles.accountInfoGrid}>
                              <div className={styles.accountInfoRow}>
                                <span className={styles.infoLabel}>은행</span>
                                <span className={styles.infoValue}>{account.bank}</span>
                              </div>
                              <div className={styles.accountInfoRow}>
                                <span className={styles.infoLabel}>계좌번호</span>
                                <span className={styles.infoValue}>{account.number}</span>
                              </div>
                              <div className={styles.accountInfoRow}>
                                <span className={styles.infoLabel}>예금주</span>
                                <span className={styles.infoValue}>{account.holder}</span>
                              </div>
                            </div>
                            <button
                              className={styles.copyButton}
                              onClick={() => handleCopy(account.number, `account-${index}`)}
                            >
                              {copiedAccount === `account-${index}` ? (
                                <>
                                  <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M20 6L9 17L4 12"
                                      stroke="currentColor"
                                      strokeWidth="2.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <span>복사완료!</span>
                                </>
                              ) : (
                                <>
                                  <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <rect
                                      x="9"
                                      y="9"
                                      width="13"
                                      height="13"
                                      rx="2"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <span>복사하기</span>
                                </>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>

        {/* 이미지 모달 */}
        {isModalOpen && (
          <div className={styles.modal} onClick={handleCloseModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.modalClose} onClick={handleCloseModal} aria-label="닫기">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                className={`${styles.modalButton} ${styles.modalButtonPrev}`}
                onClick={handleModalPrev}
                aria-label="이전 이미지"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div
                className={styles.modalImageWrapper}
                onTouchStart={handleModalTouchStart}
                onTouchMove={handleModalTouchMove}
                onTouchEnd={handleModalTouchEnd}
              >
                <Image
                  src={galleryImages[selectedImage]}
                  alt={`갤러리 이미지 ${selectedImage + 1}`}
                  width={1200}
                  height={800}
                  className={styles.modalImage}
                  priority
                />
              </div>

              <button
                className={`${styles.modalButton} ${styles.modalButtonNext}`}
                onClick={handleModalNext}
                aria-label="다음 이미지"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* 모달 인디케이터 */}
              <div className={styles.modalIndicators}>
                {galleryImages.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.indicator} ${
                      index === selectedImage ? styles.indicatorActive : ""
                    }`}
                    onClick={() => setSelectedImage(index)}
                    aria-label={`${index + 1}번 이미지로 이동`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
