"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import loadingImg from "~/assets/images/loading.png";
import styles from "./styles/page.module.scss";

// 카카오맵 타입 선언
type KakaoLatLng = {
  getLat: () => number;
  getLng: () => number;
};

type KakaoMap = {
  setCenter: (latlng: KakaoLatLng) => void;
};

type KakaoMarker = {
  setPosition: (latlng: KakaoLatLng) => void;
};

type KakaoInfoWindow = {
  open: (map: KakaoMap, marker: KakaoMarker) => void;
};

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        LatLng: new (lat: number, lng: number) => KakaoLatLng;
        Map: new (
          container: HTMLElement,
          options: { center: KakaoLatLng; level: number },
        ) => KakaoMap;
        Marker: new (options: { position: KakaoLatLng; map: KakaoMap }) => KakaoMarker;
        InfoWindow: new (options: { content: string }) => KakaoInfoWindow;
      };
    };
  }
}

export default function Main() {
  const [loading, setLoading] = useState(true);
  const [openAccount, setOpenAccount] = useState<"groom" | "bride" | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1.5초 후 로딩 완료
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const accounts = [
    {
      bank: "농협",
      number: "455-12-266333",
      holder: "강현숙",
    },
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

  // 카카오맵 로드 및 렌더링
  useEffect(() => {
    if (loading) return;

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=c29b445938b8cb6fa9b0e1d01d12da98&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (!mapRef.current) return;

        const position = new window.kakao.maps.LatLng(36.7783897, 126.4565724);
        const options = {
          center: position,
          level: 3,
        };

        const map = new window.kakao.maps.Map(mapRef.current, options);

        new window.kakao.maps.Marker({
          position: position,
          map: map,
        });

        map.setCenter(position);
      });
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [loading]);

  return (
    <>
      {/* 로딩 화면 */}
      {loading && (
        <div className={styles.loadingScreen}>
          <div className={styles.loadingContent}>
            <Image
              src={loadingImg}
              alt="Loading"
              width={96}
              height={96}
              className={styles.loadingImage}
              priority
            />
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
                <div>화려한 예식 대신 가족들과의 소중한 식사로</div>
                <div>부부로서의 첫걸음을 내딛기로 하였습니다.</div>
              </div>
              <div className={styles.invitationMessage}>
                <div>직접 모시지 못한 송구한 마음을 담아</div>
                <div>따로 정성껏 식사 자리를 준비했사오니,</div>
                <div>귀한 걸음 하시어 저희의 시작을 격려해 주시면</div>
                <div>더할 나위 없는 기쁨이겠습니다.</div>
              </div>
            </div>
            <div className={styles.from}>
              <div>
                <b>박양열</b>&middot;<b>강현숙</b> 의 장남 <b>박중호</b>
              </div>
              <div>
                <b>이창준</b>&middot;<b>유혜영</b> 의 차녀 <b>이예림</b>
              </div>
            </div>
            <div className={styles.date}>
              <div>2026년 5월 2일 토요일 오전 11시 30분</div>
              <div>장소: 쿠우쿠우</div>
            </div>
          </div>
          <div className={styles.footer}>
            <div className={styles.footerContent}>
              {/* 오시는 길 섹션 */}
              <section className={styles.locationSection}>
                <h2 className={styles.footerTitle}>오시는 길</h2>
                <div className={styles.locationInfo}>
                  <p className={styles.locationAddress}>
                    <strong>충남 서산시 안견로 242 2층 디퍼아울렛타운 2층</strong>
                    쿠우쿠우
                  </p>
                </div>

                {/* 카카오 맵 */}
                <div className={styles.mapContainer}>
                  <div ref={mapRef} />
                </div>
              </section>

              {/* 구분선 */}
              <div className={styles.divider} />

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
      </div>
    </>
  );
}
