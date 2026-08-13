import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Language = "en" | "ko" | "ja" | "cn" | "vi" | "ru" | "kz" | "es" | "fr" | "it";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  languageLabels: Record<Language, string>;
  t: (key: string) => string;
}

const languageLabels: Record<Language, string> = {
  en: "English",
  ko: "Korean",
  ja: "Japanese",
  cn: "Chinese",
  vi: "Vietnamese",
  ru: "Russian",
  kz: "Kazakh",
  es: "Spanish",
  fr: "French",
  it: "Italian",
};

const translations: Record<Language, Record<string, string>> = {
  en: {
    navHome: "Home",
    navBooking: "Booking",
    navMenu: "Menu",
    navAbout: "About",
    navLogin: "Login",
    navLogout: "Logout",
    navDashboard: "Dashboard",
    navLoggedOut: "Logged out",
    navLoggedOutDescription: "You've been successfully logged out.",
    footerAddress: "493 Tran Hung Dao Street, An Hai Ward, Da Nang City, Viet Nam",
    homeEyebrow: "Da Nang Riverside Dining",
    homeTitle: "Riverside Terrace Restaurant",
    homeSubtitle: "Italian-inspired comfort, warm service, and relaxed riverside tables for intimate dinners, groups, and celebrations.",
    homeBook: "Book a table",
    homeMenu: "View menu",
    homeWarmTitle: "A warm table by the river",
    homeWarmText: "Our dining room balances quiet corners, open terrace seats, and flexible spaces for every occasion.",
    homeSpecialTitle: "Special dishes",
    homeSpecialText: "Selected from the live menu data.",
    homeExplore: "Explore all dishes",
    homeLoadingMenu: "Menu highlights are loading.",
    homePlanTitle: "Plan your visit",
    homePlanText: "Choose your area, time, and table with live availability from the restaurant system.",
    homeGoBooking: "Go to booking",
    homeBrowseTitle: "Browse the menu",
    homeBrowseText: "Search dishes, categories, images, descriptions, and prices on the existing menu page.",
    homeOpenMenu: "Open menu",
    homeReviewsTitle: "Loved by our guests",
    homeReviewsText: "Highlights from guest feedback about dining with us by the Han River. Open Google Maps to read the original reviews.",
    homeReviewsButton: "Read reviews on Google",
    homeReview1Text: "A lovely riverside setting, attentive service, and a relaxed atmosphere for dinner.",
    homeReview1Author: "Guest feedback highlight",
    homeReview2Text: "The food was beautifully presented and the team made our evening feel special.",
    homeReview2Author: "Guest feedback highlight",
    homeReview3Text: "A peaceful place to enjoy good food with a wonderful view of the river.",
    homeReview3Author: "Guest feedback highlight",
    aboutEyebrow: "About us",
    aboutText: "Riverside Terrace brings relaxed hospitality, Italian-inspired dishes, and a calm Da Nang riverside setting together in one warm dining room.",
    aboutAddress: "Address",
    aboutPhone: "Phone",
    aboutEmail: "Email",
    aboutHours: "Opening hours",
    aboutDaily: "Daily: 12:00 - 23:00",
    aboutFind: "Find us",
    aboutMaps: "Open Google Maps",
    bookingEyebrow: "Table reservation",
    bookingTitle: "Book your table",
    bookingTables: "tables",
    bookingRefresh: "Refresh",
    bookingSelected: "SELECTED",
    bookingAreaPhotos: "View area photos",
    bookingDetails: "Booking details",
    bookingCustomerName: "Customer name",
    bookingEmail: "Email",
    bookingPhone: "Phone",
    bookingGuests: "Guests",
    bookingLargeParty: "Online reservations support up to 6 guests. For larger groups, please contact Riverside Terrace at (+84) 911500440 or email litalianoriverside@gmail.com.",
    bookingDate: "Date",
    bookingStart: "Start",
    bookingEnd: "End",
    bookingSelectedTables: "Selected tables",
    bookingChooseTables: "Choose one or more available tables from the canvas",
    bookingNotEnoughSeats: "Selected tables do not have enough seats for this party size.",
    bookingNotes: "Notes",
    bookingOptional: "Optional",
    bookingContinue: "Continue with email OTP",
    bookingNoTables: "No tables available for this area and time.",
    bookingVerifyEmail: "Verify your email",
    bookingOtpInstruction: "Enter the 6 digit OTP sent to",
    bookingOtpExpires: "It expires in 2 minutes.",
    bookingVerifyOtp: "Verify OTP",
    bookingResendOtp: "Resend OTP",
    bookingSuccessTitle: "Booking request sent",
    bookingCode: "Booking code",
    bookingStatus: "Status",
    bookingPendingApproval: "Pending approval",
    bookingCheckEmail: "Please check your email for booking information and the latest updates from the restaurant.",
    bookingRequired: "is required.",
    bookingEmailInvalid: "Email is invalid.",
    bookingPhoneInvalid: "Phone number is invalid.",
    bookingGuestInvalid: "Number of guests must be greater than 0.",
    bookingPastTime: "Booking time cannot be in the past.",
    bookingEndAfterStart: "End time must be after start time.",
    bookingUnavailableSelected: "One or more selected tables are no longer available.",
    bookingWrongAreaSelected: "One or more selected tables do not belong to this area.",
    bookingCapacityTooSmall: "Selected table capacity is smaller than party size.",
    bookingFormIncomplete: "Booking form is incomplete",
    bookingCannotLoadTables: "Cannot load table availability",
    bookingCannotRequestOtp: "Cannot request OTP",
    bookingOtpSent: "OTP sent",
    bookingOtpSentDescription: "Please check your email for the verification code.",
    bookingOtpFailed: "OTP verification failed",
    bookingTryAgain: "Please try again.",
    bookingTryAnotherTable: "Please try another table.",
    bookingPhotos: "photos",
    bookingArea: "Area",
    bookingTable: "Table",
    bookingDateTime: "Date and time",
    bookingGuestLabel: "guests",
    bookingSeats: "seats",
    bookingTableSingular: "table",
    bookingTablePlural: "tables",
    bookingSuggestBest: "Suggest best table",
    bookingFindSuggestion: "Find best table",
    bookingSeating: "Seating preference",
    bookingInside: "Inside",
    bookingOutside: "Outside",
    bookingInsideHint: "Inside searches Roma and Verona. Verona is prioritized for 3-6 guests.",
    bookingOutsideHint: "Outside searches Terrace only.",
    bookingSuggestionFound: "Best table selected",
    bookingSuggestionFailed: "Could not suggest a table",
    bookingSuggestionInvalid: "Enter 1-6 guests and a valid time range.",
    bookingSuggestionNone: "No suitable adjacent tables are available.",
    bookingVeronaLocked: "Verona is unavailable",
    bookingVeronaMinimum: "Verona is reserved for parties of 3 or more.",
    bookingConfirmationLabel: "I confirm that the information entered above is accurate.",
    bookingConfirmationRequired: "Please confirm that the information entered above is accurate.",
    statusAvailable: "Available",
    statusHold: "Hold",
    statusReserved: "Reserved",
    statusOccupied: "Occupied",
    statusMaintenance: "Maintenance",
    menuSearch: "Search menu...",
    menuSort: "Sort",
    menuDefault: "Default",
    menuPriceLow: "Price low to high",
    menuPriceHigh: "Price high to low",
    menuLoadError: "Error",
    menuLoadFailed: "Failed to load menu",
    menuNoItems: "No menu items found",
    menuShowing: "Showing",
    menuOf: "of",
    menuItems: "items",
    menuBack: "Back to Menu",
    categoryAll: "All",
    adminAccess: "Admin access",
    adminSignIn: "Sign in",
    adminUseAccount: "Use an administrator account.",
    adminUsername: "Username",
    adminPassword: "Password",
    adminLoginFailed: "Login failed",
    adminInvalidCredentials: "Invalid credentials",
    notFoundTitle: "Oops! Page not found",
    notFoundHome: "Return to Home",
  },
  vi: {
    homeReviewsTitle: "Được thực khách yêu mến", homeReviewsText: "Các điểm nổi bật từ phản hồi của thực khách về trải nghiệm bên sông Hàn. Mở Google Maps để đọc đánh giá nguyên bản.", homeReviewsButton: "Xem đánh giá trên Google", homeReview1Text: "Không gian ven sông rất đẹp, phục vụ chu đáo và bầu không khí thư giãn cho buổi tối.", homeReview1Author: "Điểm nổi bật từ phản hồi", homeReview2Text: "Món ăn được trình bày đẹp mắt và đội ngũ nhân viên đã làm cho buổi tối của chúng tôi thật đặc biệt.", homeReview2Author: "Điểm nổi bật từ phản hồi", homeReview3Text: "Một nơi yên bình để thưởng thức món ngon cùng khung cảnh tuyệt vời bên sông.", homeReview3Author: "Điểm nổi bật từ phản hồi",
    bookingConfirmationLabel: "Tôi đảm bảo các thông tin nhập phía trên là chính xác.", bookingConfirmationRequired: "Vui lòng tích xác nhận các thông tin nhập phía trên là chính xác.",
    bookingSuggestBest: "Gợi ý bàn tốt nhất", bookingFindSuggestion: "Tìm bàn phù hợp", bookingSeating: "Vị trí ngồi", bookingInside: "Trong nhà", bookingOutside: "Ngoài trời", bookingInsideHint: "Trong nhà chỉ tìm Roma và Verona; nhóm 3-6 khách ưu tiên Verona.", bookingOutsideHint: "Ngoài trời chỉ tìm khu Terrace.", bookingSuggestionFound: "Đã chọn bàn phù hợp nhất", bookingSuggestionFailed: "Không thể gợi ý bàn", bookingSuggestionInvalid: "Vui lòng nhập 1-6 khách và khoảng thời gian hợp lệ.", bookingSuggestionNone: "Không còn nhóm bàn liền kề phù hợp.", bookingVeronaLocked: "Không thể chọn Verona", bookingVeronaMinimum: "Verona chỉ dành cho nhóm từ 3 khách trở lên.",
    navHome: "Trang chủ", navBooking: "Đặt bàn", navMenu: "Thực đơn", navAbout: "Giới thiệu", navLogin: "Đăng nhập", navLogout: "Đăng xuất", navDashboard: "Quản trị", navLoggedOut: "Đã đăng xuất", navLoggedOutDescription: "Bạn đã đăng xuất thành công.",
    footerAddress: "493 Đường Trần Hưng Đạo, Phường An Hải, Thành phố Đà Nẵng, Việt Nam",
    homeEyebrow: "Ẩm thực ven sông Đà Nẵng", homeTitle: "Nhà hàng Riverside Terrace", homeSubtitle: "Phong vị Ý ấm áp, phục vụ tận tâm và không gian ven sông thư thái cho bữa tối, nhóm bạn và các dịp kỷ niệm.", homeBook: "Đặt bàn", homeMenu: "Xem thực đơn",
    homeWarmTitle: "Bàn ăn ấm cúng bên dòng sông", homeWarmText: "Không gian nhà hàng cân bằng giữa góc riêng tư, khu terrace mở và chỗ ngồi linh hoạt cho mọi dịp.", homeSpecialTitle: "Món nổi bật", homeSpecialText: "Được chọn từ dữ liệu thực đơn hiện tại.", homeExplore: "Xem tất cả món", homeLoadingMenu: "Đang tải món nổi bật.", homePlanTitle: "Lên kế hoạch ghé thăm", homePlanText: "Chọn khu vực, thời gian và bàn với dữ liệu còn chỗ trực tiếp từ hệ thống.", homeGoBooking: "Đến trang đặt bàn", homeBrowseTitle: "Xem thực đơn", homeBrowseText: "Tìm món, danh mục, hình ảnh, mô tả và giá trên trang thực đơn.", homeOpenMenu: "Mở thực đơn",
    aboutEyebrow: "Về chúng tôi", aboutText: "Riverside Terrace kết hợp lòng hiếu khách, món Ý truyền cảm hứng và khung cảnh ven sông Đà Nẵng trong một không gian ấm cúng.", aboutAddress: "Địa chỉ", aboutPhone: "Điện thoại", aboutEmail: "Email", aboutHours: "Giờ mở cửa", aboutDaily: "Hằng ngày: 12:00 - 23:00", aboutFind: "Tìm chúng tôi", aboutMaps: "Mở Google Maps",
    bookingEyebrow: "Đặt bàn", bookingTitle: "Đặt bàn của bạn", bookingTables: "bàn", bookingRefresh: "Làm mới", bookingSelected: "ĐÃ CHỌN", bookingAreaPhotos: "Xem ảnh khu vực", bookingDetails: "Thông tin đặt bàn", bookingCustomerName: "Tên khách", bookingEmail: "Email", bookingPhone: "Điện thoại", bookingGuests: "Số khách", bookingLargeParty: "Đặt bàn online hỗ trợ tối đa 6 khách. Với nhóm lớn hơn, vui lòng liên hệ Riverside Terrace qua (+84) 911500440 hoặc litalianoriverside@gmail.com.", bookingDate: "Ngày", bookingStart: "Bắt đầu", bookingEnd: "Kết thúc", bookingSelectedTables: "Bàn đã chọn", bookingChooseTables: "Chọn một hoặc nhiều bàn còn trống trên sơ đồ", bookingNotEnoughSeats: "Các bàn đã chọn chưa đủ chỗ cho số khách.", bookingNotes: "Ghi chú", bookingOptional: "Không bắt buộc", bookingContinue: "Tiếp tục với OTP email", bookingNoTables: "Không có bàn trống cho khu vực và thời gian này.", bookingVerifyEmail: "Xác minh email", bookingOtpInstruction: "Nhập mã OTP 6 chữ số đã gửi tới", bookingOtpExpires: "Mã hết hạn sau 2 phút.", bookingVerifyOtp: "Xác minh OTP", bookingResendOtp: "Gửi lại OTP", bookingSuccessTitle: "Đã gửi yêu cầu đặt bàn", bookingCode: "Mã đặt bàn", bookingStatus: "Trạng thái", bookingPendingApproval: "Đang chờ duyệt", bookingCheckEmail: "Vui lòng kiểm tra email để nhận thông tin đặt bàn và cập nhật mới nhất từ nhà hàng.",
    bookingRequired: "là bắt buộc.", bookingEmailInvalid: "Email không hợp lệ.", bookingPhoneInvalid: "Số điện thoại không hợp lệ.", bookingGuestInvalid: "Số khách phải lớn hơn 0.", bookingPastTime: "Thời gian đặt bàn không được ở quá khứ.", bookingEndAfterStart: "Giờ kết thúc phải sau giờ bắt đầu.", bookingUnavailableSelected: "Một hoặc nhiều bàn đã chọn không còn trống.", bookingWrongAreaSelected: "Một hoặc nhiều bàn đã chọn không thuộc khu vực này.", bookingCapacityTooSmall: "Sức chứa bàn đã chọn nhỏ hơn số khách.", bookingFormIncomplete: "Thông tin đặt bàn chưa đầy đủ", bookingCannotLoadTables: "Không thể tải tình trạng bàn", bookingCannotRequestOtp: "Không thể gửi OTP", bookingOtpSent: "Đã gửi OTP", bookingOtpSentDescription: "Vui lòng kiểm tra email để lấy mã xác minh.", bookingOtpFailed: "Xác minh OTP thất bại", bookingTryAgain: "Vui lòng thử lại.", bookingTryAnotherTable: "Vui lòng chọn bàn khác.", bookingPhotos: "ảnh", bookingArea: "Khu vực", bookingTable: "Bàn", bookingDateTime: "Ngày và giờ", bookingGuestLabel: "khách", bookingSeats: "chỗ", bookingTableSingular: "bàn", bookingTablePlural: "bàn", statusAvailable: "Còn trống", statusHold: "Đang giữ", statusReserved: "Đã đặt", statusOccupied: "Đang dùng", statusMaintenance: "Bảo trì",
    menuSearch: "Tìm món...", menuSort: "Sắp xếp", menuDefault: "Mặc định", menuPriceLow: "Giá thấp đến cao", menuPriceHigh: "Giá cao đến thấp", menuLoadError: "Lỗi", menuLoadFailed: "Không thể tải thực đơn", menuNoItems: "Không tìm thấy món", menuShowing: "Hiển thị", menuOf: "trên", menuItems: "món", menuBack: "Quay lại thực đơn", categoryAll: "Tất cả",
    adminAccess: "Truy cập quản trị", adminSignIn: "Đăng nhập", adminUseAccount: "Sử dụng tài khoản quản trị.", adminUsername: "Tên đăng nhập", adminPassword: "Mật khẩu", adminLoginFailed: "Đăng nhập thất bại", adminInvalidCredentials: "Thông tin đăng nhập không hợp lệ", notFoundTitle: "Không tìm thấy trang", notFoundHome: "Về trang chủ",
  },
  ko: {}, ja: {}, cn: {}, ru: {}, kz: {}, es: {}, fr: {}, it: {},
};

translations.ko = {
  ...translations.en,
  navHome: "홈", navBooking: "예약", navMenu: "메뉴", navAbout: "소개", navLogin: "로그인", navLogout: "로그아웃", navDashboard: "대시보드", navLoggedOut: "로그아웃됨", navLoggedOutDescription: "성공적으로 로그아웃되었습니다.",
  homeEyebrow: "다낭 강변 다이닝", homeTitle: "리버사이드 테라스 레스토랑", homeSubtitle: "이탈리아 감성의 편안한 음식, 따뜻한 서비스, 강변 테이블을 즐겨보세요.", homeBook: "테이블 예약", homeMenu: "메뉴 보기", homeWarmTitle: "강가의 따뜻한 테이블", homeWarmText: "조용한 좌석, 오픈 테라스, 다양한 모임에 맞는 공간을 제공합니다.", homeSpecialTitle: "추천 요리", homeSpecialText: "현재 메뉴 데이터에서 선택했습니다.", homeExplore: "모든 요리 보기", homeLoadingMenu: "추천 메뉴를 불러오는 중입니다.", homePlanTitle: "방문 계획", homePlanText: "실시간 좌석 현황으로 구역, 시간, 테이블을 선택하세요.", homeGoBooking: "예약하기", homeBrowseTitle: "메뉴 둘러보기", homeBrowseText: "메뉴 페이지에서 요리, 카테고리, 이미지, 설명, 가격을 검색하세요.", homeOpenMenu: "메뉴 열기",
  aboutEyebrow: "소개", aboutText: "리버사이드 테라스는 따뜻한 환대, 이탈리아 감성의 요리, 다낭 강변의 차분한 분위기를 함께 제공합니다.", aboutAddress: "주소", aboutPhone: "전화", aboutEmail: "이메일", aboutHours: "영업시간", aboutDaily: "매일: 12:00 - 23:00", aboutFind: "찾아오시는 길", aboutMaps: "Google Maps 열기",
  bookingEyebrow: "테이블 예약", bookingTitle: "테이블 예약", bookingTables: "테이블", bookingRefresh: "새로고침", bookingSelected: "선택됨", bookingAreaPhotos: "구역 사진 보기", bookingDetails: "예약 정보", bookingCustomerName: "고객 이름", bookingEmail: "이메일", bookingPhone: "전화", bookingGuests: "인원", bookingLargeParty: "온라인 예약은 최대 6명까지 가능합니다. 더 큰 그룹은 (+84) 911500440 또는 litalianoriverside@gmail.com 로 연락해 주세요.", bookingDate: "날짜", bookingStart: "시작", bookingEnd: "종료", bookingSelectedTables: "선택한 테이블", bookingChooseTables: "도면에서 가능한 테이블을 하나 이상 선택하세요", bookingNotEnoughSeats: "선택한 테이블 좌석이 인원보다 부족합니다.", bookingNotes: "메모", bookingOptional: "선택 사항", bookingContinue: "이메일 OTP로 계속", bookingNoTables: "이 구역과 시간에는 가능한 테이블이 없습니다.", bookingVerifyEmail: "이메일 확인", bookingOtpInstruction: "전송된 6자리 OTP를 입력하세요:", bookingOtpExpires: "2분 후 만료됩니다.", bookingVerifyOtp: "OTP 확인", bookingResendOtp: "OTP 재전송", bookingSuccessTitle: "예약 요청 전송됨", bookingCode: "예약 코드", bookingStatus: "상태", bookingPendingApproval: "승인 대기", bookingCheckEmail: "예약 정보와 최신 업데이트를 이메일로 확인해 주세요.", bookingRequired: "필수입니다.", bookingEmailInvalid: "이메일이 올바르지 않습니다.", bookingPhoneInvalid: "전화번호가 올바르지 않습니다.", bookingGuestInvalid: "인원은 0보다 커야 합니다.", bookingPastTime: "예약 시간은 과거일 수 없습니다.", bookingEndAfterStart: "종료 시간은 시작 시간 이후여야 합니다.", bookingUnavailableSelected: "선택한 테이블 중 일부가 더 이상 이용 가능하지 않습니다.", bookingWrongAreaSelected: "선택한 테이블 중 일부가 이 구역에 속하지 않습니다.", bookingCapacityTooSmall: "선택한 테이블 좌석이 인원보다 적습니다.", bookingFormIncomplete: "예약 정보가 완전하지 않습니다", bookingCannotLoadTables: "테이블 현황을 불러올 수 없습니다", bookingCannotRequestOtp: "OTP를 요청할 수 없습니다", bookingOtpSent: "OTP 전송됨", bookingOtpSentDescription: "인증 코드를 이메일에서 확인해 주세요.", bookingOtpFailed: "OTP 확인 실패", bookingTryAgain: "다시 시도해 주세요.", bookingTryAnotherTable: "다른 테이블을 선택해 주세요.", bookingPhotos: "사진", bookingArea: "구역", bookingTable: "테이블", bookingDateTime: "날짜 및 시간", bookingGuestLabel: "명", bookingSeats: "좌석", bookingTableSingular: "테이블", bookingTablePlural: "테이블", statusAvailable: "가능", statusHold: "보류", statusReserved: "예약됨", statusOccupied: "사용 중", statusMaintenance: "점검",
  menuSearch: "메뉴 검색...", menuSort: "정렬", menuDefault: "기본", menuPriceLow: "낮은 가격순", menuPriceHigh: "높은 가격순", menuLoadError: "오류", menuLoadFailed: "메뉴를 불러오지 못했습니다", menuNoItems: "메뉴 항목이 없습니다", menuShowing: "표시", menuOf: "/", menuItems: "개", menuBack: "메뉴로 돌아가기", categoryAll: "전체", adminAccess: "관리자 접근", adminSignIn: "로그인", adminUseAccount: "관리자 계정을 사용하세요.", adminUsername: "사용자 이름", adminPassword: "비밀번호", adminLoginFailed: "로그인 실패", adminInvalidCredentials: "잘못된 로그인 정보", notFoundTitle: "페이지를 찾을 수 없습니다", notFoundHome: "홈으로 돌아가기",
};
translations.ja = {
  ...translations.ko,
  navHome: "ホーム", navBooking: "予約", navMenu: "メニュー", navAbout: "紹介", navLogin: "ログイン", navLogout: "ログアウト", navDashboard: "ダッシュボード", navLoggedOut: "ログアウトしました", navLoggedOutDescription: "正常にログアウトしました。",
  homeEyebrow: "ダナン川沿いのダイニング", homeTitle: "リバーサイドテラス レストラン", homeSubtitle: "イタリア風の心地よい料理、温かいサービス、川沿いの落ち着いた席をご用意しています。", homeBook: "テーブルを予約", homeMenu: "メニューを見る", homeWarmTitle: "川辺の温かいテーブル", homeWarmText: "静かな席、オープンテラス、さまざまなシーンに合う空間を備えています。", homeSpecialTitle: "おすすめ料理", homeSpecialText: "現在のメニューデータから選びました。", homeExplore: "すべての料理を見る", homeLoadingMenu: "おすすめメニューを読み込み中です。", homePlanTitle: "来店を計画", homePlanText: "空席状況に基づいてエリア、時間、テーブルを選べます。", homeGoBooking: "予約へ進む", homeBrowseTitle: "メニューを見る", homeBrowseText: "メニューページで料理、カテゴリ、画像、説明、価格を検索できます。", homeOpenMenu: "メニューを開く",
  aboutEyebrow: "私たちについて", aboutText: "リバーサイドテラスは、温かいおもてなし、イタリア風の料理、ダナン川沿いの穏やかな雰囲気を一つにしたレストランです。", aboutAddress: "住所", aboutPhone: "電話", aboutEmail: "メール", aboutHours: "営業時間", aboutDaily: "毎日: 12:00 - 23:00", aboutFind: "アクセス", aboutMaps: "Google Mapsを開く",
  bookingEyebrow: "テーブル予約", bookingTitle: "テーブルを予約", bookingTables: "テーブル", bookingRefresh: "更新", bookingSelected: "選択済み", bookingAreaPhotos: "エリア写真を見る", bookingDetails: "予約情報", bookingCustomerName: "お名前", bookingEmail: "メール", bookingPhone: "電話", bookingGuests: "人数", bookingLargeParty: "オンライン予約は最大6名まで対応しています。7名以上の場合は (+84) 911500440 または litalianoriverside@gmail.com までご連絡ください。", bookingDate: "日付", bookingStart: "開始", bookingEnd: "終了", bookingSelectedTables: "選択したテーブル", bookingChooseTables: "図面から空いているテーブルを1つ以上選択してください", bookingNotEnoughSeats: "選択したテーブルの席数が人数に足りません。", bookingNotes: "メモ", bookingOptional: "任意", bookingContinue: "メールOTPで続行", bookingNoTables: "このエリアと時間に空きテーブルはありません。", bookingVerifyEmail: "メールを確認", bookingOtpInstruction: "送信された6桁のOTPを入力してください:", bookingOtpExpires: "2分で期限切れになります。", bookingVerifyOtp: "OTP確認", bookingResendOtp: "OTP再送信", bookingSuccessTitle: "予約リクエストを送信しました", bookingCode: "予約コード", bookingStatus: "状態", bookingPendingApproval: "承認待ち", bookingCheckEmail: "予約情報と最新のお知らせをメールでご確認ください。", bookingRequired: "は必須です。", bookingEmailInvalid: "メールアドレスが正しくありません。", bookingPhoneInvalid: "電話番号が正しくありません。", bookingGuestInvalid: "人数は0より大きくしてください。", bookingPastTime: "過去の時間は予約できません。", bookingEndAfterStart: "終了時間は開始時間より後にしてください。", bookingUnavailableSelected: "選択したテーブルの一部は利用できません。", bookingWrongAreaSelected: "選択したテーブルの一部はこのエリアにありません。", bookingCapacityTooSmall: "選択したテーブルの席数が人数より少ないです。", bookingFormIncomplete: "予約情報が不足しています", bookingCannotLoadTables: "テーブル状況を読み込めません", bookingCannotRequestOtp: "OTPをリクエストできません", bookingOtpSent: "OTPを送信しました", bookingOtpSentDescription: "確認コードをメールでご確認ください。", bookingOtpFailed: "OTP確認に失敗しました", bookingTryAgain: "もう一度お試しください。", bookingTryAnotherTable: "別のテーブルをお選びください。", bookingPhotos: "写真", bookingArea: "エリア", bookingTable: "テーブル", bookingDateTime: "日付と時間", bookingGuestLabel: "名", bookingSeats: "席", bookingTableSingular: "テーブル", bookingTablePlural: "テーブル", statusAvailable: "空き", statusHold: "保留", statusReserved: "予約済み", statusOccupied: "使用中", statusMaintenance: "メンテナンス",
  menuSearch: "メニューを検索...", menuSort: "並び替え", menuDefault: "標準", menuPriceLow: "価格が低い順", menuPriceHigh: "価格が高い順", menuLoadError: "エラー", menuLoadFailed: "メニューを読み込めません", menuNoItems: "メニューが見つかりません", menuShowing: "表示", menuOf: "/", menuItems: "件", menuBack: "メニューへ戻る", categoryAll: "すべて", adminAccess: "管理者アクセス", adminSignIn: "ログイン", adminUseAccount: "管理者アカウントを使用してください。", adminUsername: "ユーザー名", adminPassword: "パスワード", adminLoginFailed: "ログイン失敗", adminInvalidCredentials: "認証情報が正しくありません", notFoundTitle: "ページが見つかりません", notFoundHome: "ホームへ戻る",
};
translations.cn = {
  ...translations.en,
  navHome: "首页", navBooking: "订位", navMenu: "菜单", navAbout: "关于", navLogin: "登录", navLogout: "退出", navDashboard: "后台", navLoggedOut: "已退出", navLoggedOutDescription: "您已成功退出登录。",
  homeEyebrow: "岘港河畔餐饮", homeTitle: "Riverside Terrace 餐厅", homeSubtitle: "意式灵感美食、贴心服务与轻松河畔座位，适合晚餐、聚会和庆祝。", homeBook: "预订餐桌", homeMenu: "查看菜单", homeWarmTitle: "河边的温暖餐桌", homeWarmText: "餐厅提供安静角落、开放露台和适合各种场合的灵活座位。", homeSpecialTitle: "招牌菜", homeSpecialText: "从当前菜单数据中精选。", homeExplore: "查看所有菜品", homeLoadingMenu: "正在加载推荐菜。", homePlanTitle: "计划到访", homePlanText: "根据实时可订状态选择区域、时间和餐桌。", homeGoBooking: "去订位", homeBrowseTitle: "浏览菜单", homeBrowseText: "在菜单页搜索菜品、分类、图片、描述和价格。", homeOpenMenu: "打开菜单",
  aboutEyebrow: "关于我们", aboutText: "Riverside Terrace 将热情服务、意式灵感菜品和岘港河畔宁静环境融为一体。", aboutAddress: "地址", aboutPhone: "电话", aboutEmail: "邮箱", aboutHours: "营业时间", aboutDaily: "每日: 12:00 - 23:00", aboutFind: "找到我们", aboutMaps: "打开 Google Maps",
  bookingEyebrow: "餐桌预订", bookingTitle: "预订餐桌", bookingTables: "餐桌", bookingRefresh: "刷新", bookingSelected: "已选", bookingAreaPhotos: "查看区域照片", bookingDetails: "预订信息", bookingCustomerName: "顾客姓名", bookingEmail: "邮箱", bookingPhone: "电话", bookingGuests: "人数", bookingLargeParty: "线上预订最多支持6人。超过6人的团体请联系 (+84) 911500440 或 litalianoriverside@gmail.com。", bookingDate: "日期", bookingStart: "开始", bookingEnd: "结束", bookingSelectedTables: "已选餐桌", bookingChooseTables: "请在平面图中选择一个或多个可用餐桌", bookingNotEnoughSeats: "已选餐桌座位数不足。", bookingNotes: "备注", bookingOptional: "可选", bookingContinue: "使用邮箱OTP继续", bookingNoTables: "此区域和时间没有可用餐桌。", bookingVerifyEmail: "验证邮箱", bookingOtpInstruction: "请输入发送至邮箱的6位OTP:", bookingOtpExpires: "2分钟后过期。", bookingVerifyOtp: "验证OTP", bookingResendOtp: "重新发送OTP", bookingSuccessTitle: "预订请求已发送", bookingCode: "预订码", bookingStatus: "状态", bookingPendingApproval: "等待确认", bookingCheckEmail: "请查看邮箱获取预订信息和餐厅最新更新。", bookingRequired: "为必填项。", bookingEmailInvalid: "邮箱无效。", bookingPhoneInvalid: "电话号码无效。", bookingGuestInvalid: "人数必须大于0。", bookingPastTime: "预订时间不能早于当前时间。", bookingEndAfterStart: "结束时间必须晚于开始时间。", bookingUnavailableSelected: "一个或多个已选餐桌不再可用。", bookingWrongAreaSelected: "一个或多个已选餐桌不属于此区域。", bookingCapacityTooSmall: "已选餐桌座位数少于人数。", bookingFormIncomplete: "预订表单未填写完整", bookingCannotLoadTables: "无法加载餐桌状态", bookingCannotRequestOtp: "无法请求OTP", bookingOtpSent: "OTP已发送", bookingOtpSentDescription: "请查看邮箱获取验证码。", bookingOtpFailed: "OTP验证失败", bookingTryAgain: "请重试。", bookingTryAnotherTable: "请选择其他餐桌。", bookingPhotos: "照片", bookingArea: "区域", bookingTable: "餐桌", bookingDateTime: "日期和时间", bookingGuestLabel: "人", bookingSeats: "座位", bookingTableSingular: "桌", bookingTablePlural: "桌", statusAvailable: "可用", statusHold: "保留中", statusReserved: "已预订", statusOccupied: "使用中", statusMaintenance: "维护中",
  menuSearch: "搜索菜单...", menuSort: "排序", menuDefault: "默认", menuPriceLow: "价格从低到高", menuPriceHigh: "价格从高到低", menuLoadError: "错误", menuLoadFailed: "菜单加载失败", menuNoItems: "未找到菜品", menuShowing: "显示", menuOf: "共", menuItems: "项", menuBack: "返回菜单", categoryAll: "全部", adminAccess: "管理员访问", adminSignIn: "登录", adminUseAccount: "使用管理员账号。", adminUsername: "用户名", adminPassword: "密码", adminLoginFailed: "登录失败", adminInvalidCredentials: "登录信息无效", notFoundTitle: "页面未找到", notFoundHome: "返回首页",
};
translations.ru = { ...translations.en, navHome: "Главная", navBooking: "Бронь", navMenu: "Меню", navAbout: "О нас", navLogin: "Войти", navLogout: "Выйти", navDashboard: "Панель", navLoggedOut: "Вы вышли", navLoggedOutDescription: "Вы успешно вышли из системы.", homeTitle: "Ресторан Riverside Terrace", homeSubtitle: "Итальянский комфорт, теплый сервис и спокойные столики у реки для ужинов, компаний и праздников.", homeBook: "Забронировать стол", homeMenu: "Смотреть меню", homeWarmTitle: "Теплый стол у реки", homeWarmText: "У нас есть тихие уголки, открытая терраса и гибкие зоны для разных случаев.", homeSpecialTitle: "Особые блюда", homeSpecialText: "Выбрано из актуального меню.", homeExplore: "Смотреть все блюда", homePlanTitle: "Запланируйте визит", homePlanText: "Выберите зону, время и стол по актуальной доступности.", homeGoBooking: "Перейти к бронированию", homeBrowseTitle: "Просмотреть меню", homeBrowseText: "Ищите блюда, категории, фото, описания и цены на странице меню.", homeOpenMenu: "Открыть меню", aboutEyebrow: "О нас", aboutText: "Riverside Terrace сочетает гостеприимство, блюда в итальянском стиле и спокойную атмосферу у реки в Дананге.", aboutAddress: "Адрес", aboutPhone: "Телефон", aboutEmail: "Email", aboutHours: "Часы работы", aboutDaily: "Ежедневно: 12:00 - 23:00", aboutFind: "Как нас найти", aboutMaps: "Открыть Google Maps", bookingTitle: "Забронировать стол", bookingDetails: "Данные бронирования", bookingCustomerName: "Имя гостя", bookingPhone: "Телефон", bookingGuests: "Гости", bookingLargeParty: "Онлайн-бронирование доступно до 6 гостей. Для больших групп свяжитесь с Riverside Terrace: (+84) 911500440 или litalianoriverside@gmail.com.", bookingChooseTables: "Выберите один или несколько свободных столов на схеме", bookingContinue: "Продолжить с email OTP", bookingPendingApproval: "Ожидает подтверждения", bookingRequired: "обязательно.", bookingEmailInvalid: "Email неверный.", bookingPhoneInvalid: "Телефон неверный.", bookingGuestInvalid: "Количество гостей должно быть больше 0.", bookingPastTime: "Время бронирования не может быть в прошлом.", bookingEndAfterStart: "Время окончания должно быть после начала.", bookingCannotLoadTables: "Не удалось загрузить столы", bookingFormIncomplete: "Форма бронирования заполнена не полностью", bookingOtpSent: "OTP отправлен", bookingOtpSentDescription: "Проверьте email для кода подтверждения.", bookingTryAgain: "Попробуйте еще раз.", bookingArea: "Зона", bookingTable: "Стол", bookingDateTime: "Дата и время", bookingGuestLabel: "гостей", bookingSeats: "мест", statusAvailable: "Свободно", statusHold: "Удерживается", statusReserved: "Забронировано", statusOccupied: "Занято", statusMaintenance: "Обслуживание", menuSearch: "Поиск по меню...", menuSort: "Сортировка", menuDefault: "По умолчанию", menuPriceLow: "Цена по возрастанию", menuPriceHigh: "Цена по убыванию", menuLoadError: "Ошибка", menuLoadFailed: "Не удалось загрузить меню", menuNoItems: "Блюда не найдены", menuShowing: "Показано", menuOf: "из", menuItems: "позиций", menuBack: "Назад к меню", categoryAll: "Все", notFoundTitle: "Страница не найдена", notFoundHome: "Вернуться на главную" };
translations.kz = { ...translations.ru, navHome: "Басты", navBooking: "Брондау", navMenu: "Мәзір", navAbout: "Біз туралы", navLogin: "Кіру", navLogout: "Шығу", navDashboard: "Басқару", homeTitle: "Riverside Terrace мейрамханасы", homeBook: "Үстел брондау", homeMenu: "Мәзірді көру", bookingTitle: "Үстел брондау", menuSearch: "Мәзірден іздеу...", menuNoItems: "Тағамдар табылмады", menuBack: "Мәзірге оралу", categoryAll: "Барлығы", notFoundTitle: "Бет табылмады", notFoundHome: "Басты бетке оралу" };
translations.es = { ...translations.en, navHome: "Inicio", navBooking: "Reservas", navMenu: "Menú", navAbout: "Acerca de", navLogin: "Entrar", navLogout: "Salir", navDashboard: "Panel", navLoggedOut: "Sesión cerrada", navLoggedOutDescription: "Has cerrado sesión correctamente.", homeEyebrow: "Comida junto al río en Da Nang", homeTitle: "Restaurante Riverside Terrace", homeSubtitle: "Comida de inspiración italiana, servicio cálido y mesas relajadas junto al río para cenas, grupos y celebraciones.", homeBook: "Reservar mesa", homeMenu: "Ver menú", homeWarmTitle: "Una mesa cálida junto al río", homeWarmText: "Nuestro comedor combina rincones tranquilos, terraza abierta y espacios flexibles para cada ocasión.", homeSpecialTitle: "Platos especiales", homeSpecialText: "Seleccionados desde los datos actuales del menú.", homeExplore: "Ver todos los platos", homePlanTitle: "Planifica tu visita", homePlanText: "Elige zona, hora y mesa con disponibilidad en tiempo real.", homeGoBooking: "Ir a reservas", homeBrowseTitle: "Explorar el menú", homeBrowseText: "Busca platos, categorías, imágenes, descripciones y precios.", homeOpenMenu: "Abrir menú", aboutEyebrow: "Sobre nosotros", aboutText: "Riverside Terrace combina hospitalidad relajada, platos de inspiración italiana y un entorno tranquilo junto al río en Da Nang.", aboutAddress: "Dirección", aboutPhone: "Teléfono", aboutEmail: "Email", aboutHours: "Horario", aboutDaily: "Todos los días: 12:00 - 23:00", aboutFind: "Encuéntranos", aboutMaps: "Abrir Google Maps", bookingTitle: "Reserva tu mesa", bookingDetails: "Datos de reserva", bookingCustomerName: "Nombre del cliente", bookingPhone: "Teléfono", bookingGuests: "Personas", bookingLargeParty: "Las reservas online admiten hasta 6 personas. Para grupos más grandes, contacta con Riverside Terrace en (+84) 911500440 o litalianoriverside@gmail.com.", bookingChooseTables: "Elige una o más mesas disponibles en el plano", bookingContinue: "Continuar con OTP por email", bookingPendingApproval: "Pendiente de aprobación", bookingRequired: "es obligatorio.", bookingEmailInvalid: "El email no es válido.", bookingPhoneInvalid: "El teléfono no es válido.", bookingGuestInvalid: "El número de personas debe ser mayor que 0.", bookingPastTime: "La hora de reserva no puede estar en el pasado.", bookingEndAfterStart: "La hora de fin debe ser posterior a la de inicio.", bookingCannotLoadTables: "No se puede cargar la disponibilidad", bookingFormIncomplete: "El formulario de reserva está incompleto", bookingOtpSent: "OTP enviado", bookingOtpSentDescription: "Revisa tu email para ver el código.", bookingTryAgain: "Inténtalo de nuevo.", bookingArea: "Zona", bookingTable: "Mesa", bookingDateTime: "Fecha y hora", bookingGuestLabel: "personas", bookingSeats: "asientos", statusAvailable: "Disponible", statusHold: "Retenida", statusReserved: "Reservada", statusOccupied: "Ocupada", statusMaintenance: "Mantenimiento", menuSearch: "Buscar en el menú...", menuSort: "Ordenar", menuDefault: "Predeterminado", menuPriceLow: "Precio menor a mayor", menuPriceHigh: "Precio mayor a menor", menuLoadError: "Error", menuLoadFailed: "No se pudo cargar el menú", menuNoItems: "No se encontraron platos", menuShowing: "Mostrando", menuOf: "de", menuItems: "platos", menuBack: "Volver al menú", categoryAll: "Todo", adminAccess: "Acceso admin", adminSignIn: "Iniciar sesión", adminUseAccount: "Usa una cuenta de administrador.", adminUsername: "Usuario", adminPassword: "Contraseña", adminLoginFailed: "Error de inicio de sesión", adminInvalidCredentials: "Credenciales inválidas", notFoundTitle: "Página no encontrada", notFoundHome: "Volver al inicio" };
translations.fr = { ...translations.es, navHome: "Accueil", navBooking: "Réserver", navMenu: "Menu", navAbout: "À propos", navLogin: "Connexion", navLogout: "Déconnexion", navDashboard: "Tableau", navLoggedOut: "Déconnecté", navLoggedOutDescription: "Vous avez bien été déconnecté.", homeTitle: "Restaurant Riverside Terrace", homeSubtitle: "Cuisine d'inspiration italienne, service chaleureux et tables paisibles au bord de la rivière.", homeBook: "Réserver une table", homeMenu: "Voir le menu", homeWarmTitle: "Une table chaleureuse au bord de la rivière", homeSpecialTitle: "Plats spéciaux", homeExplore: "Voir tous les plats", homePlanTitle: "Planifier votre visite", homeGoBooking: "Aller à la réservation", homeBrowseTitle: "Parcourir le menu", homeOpenMenu: "Ouvrir le menu", aboutEyebrow: "À propos", aboutAddress: "Adresse", aboutPhone: "Téléphone", aboutHours: "Horaires", aboutDaily: "Tous les jours: 12:00 - 23:00", aboutFind: "Nous trouver", aboutMaps: "Ouvrir Google Maps", bookingTitle: "Réservez votre table", bookingDetails: "Détails de réservation", bookingCustomerName: "Nom du client", bookingPhone: "Téléphone", bookingGuests: "Convives", bookingChooseTables: "Choisissez une ou plusieurs tables disponibles sur le plan", bookingContinue: "Continuer avec l'OTP email", bookingPendingApproval: "En attente d'approbation", bookingRequired: "est obligatoire.", bookingEmailInvalid: "L'email est invalide.", bookingPhoneInvalid: "Le numéro de téléphone est invalide.", bookingCannotLoadTables: "Impossible de charger les disponibilités", bookingOtpSent: "OTP envoyé", bookingTryAgain: "Veuillez réessayer.", bookingArea: "Zone", bookingTable: "Table", bookingDateTime: "Date et heure", bookingGuestLabel: "convives", bookingSeats: "places", statusAvailable: "Disponible", statusHold: "En attente", statusReserved: "Réservée", statusOccupied: "Occupée", statusMaintenance: "Maintenance", menuSearch: "Rechercher dans le menu...", menuSort: "Trier", menuDefault: "Par défaut", menuPriceLow: "Prix croissant", menuPriceHigh: "Prix décroissant", menuLoadError: "Erreur", menuLoadFailed: "Impossible de charger le menu", menuNoItems: "Aucun plat trouvé", menuShowing: "Affichage", menuOf: "sur", menuItems: "plats", menuBack: "Retour au menu", categoryAll: "Tout", adminSignIn: "Connexion", adminUsername: "Utilisateur", adminPassword: "Mot de passe", notFoundTitle: "Page introuvable", notFoundHome: "Retour à l'accueil" };
translations.it = { ...translations.es, navHome: "Home", navBooking: "Prenota", navMenu: "Menu", navAbout: "Chi siamo", navLogin: "Accedi", navLogout: "Esci", navDashboard: "Dashboard", navLoggedOut: "Disconnesso", navLoggedOutDescription: "Sei uscito correttamente.", homeTitle: "Ristorante Riverside Terrace", homeSubtitle: "Comfort di ispirazione italiana, servizio caldo e tavoli rilassati sul fiume.", homeBook: "Prenota un tavolo", homeMenu: "Vedi menu", homeWarmTitle: "Un tavolo accogliente sul fiume", homeSpecialTitle: "Piatti speciali", homeExplore: "Vedi tutti i piatti", homePlanTitle: "Pianifica la visita", homeGoBooking: "Vai alla prenotazione", homeBrowseTitle: "Sfoglia il menu", homeOpenMenu: "Apri menu", aboutEyebrow: "Chi siamo", aboutAddress: "Indirizzo", aboutPhone: "Telefono", aboutHours: "Orari", aboutDaily: "Ogni giorno: 12:00 - 23:00", aboutFind: "Dove siamo", aboutMaps: "Apri Google Maps", bookingTitle: "Prenota il tuo tavolo", bookingDetails: "Dettagli prenotazione", bookingCustomerName: "Nome cliente", bookingPhone: "Telefono", bookingGuests: "Ospiti", bookingChooseTables: "Scegli uno o più tavoli disponibili dalla mappa", bookingContinue: "Continua con OTP email", bookingPendingApproval: "In attesa di approvazione", bookingRequired: "è obbligatorio.", bookingEmailInvalid: "Email non valida.", bookingPhoneInvalid: "Numero di telefono non valido.", bookingCannotLoadTables: "Impossibile caricare la disponibilità", bookingOtpSent: "OTP inviato", bookingTryAgain: "Riprova.", bookingArea: "Area", bookingTable: "Tavolo", bookingDateTime: "Data e ora", bookingGuestLabel: "ospiti", bookingSeats: "posti", statusAvailable: "Disponibile", statusHold: "In attesa", statusReserved: "Prenotato", statusOccupied: "Occupato", statusMaintenance: "Manutenzione", menuSearch: "Cerca nel menu...", menuSort: "Ordina", menuDefault: "Predefinito", menuPriceLow: "Prezzo crescente", menuPriceHigh: "Prezzo decrescente", menuLoadError: "Errore", menuLoadFailed: "Impossibile caricare il menu", menuNoItems: "Nessun piatto trovato", menuShowing: "Mostra", menuOf: "di", menuItems: "piatti", menuBack: "Torna al menu", categoryAll: "Tutto", adminSignIn: "Accedi", adminUsername: "Utente", adminPassword: "Password", notFoundTitle: "Pagina non trovata", notFoundHome: "Torna alla home" };

Object.assign(translations.ko, {
  bookingSuggestBest: "최적 테이블 추천", bookingFindSuggestion: "최적 테이블 찾기", bookingSeating: "좌석 위치", bookingInside: "실내", bookingOutside: "야외",
  bookingInsideHint: "실내는 Roma와 Verona에서 검색하며, 3~6명은 Verona를 우선합니다.", bookingOutsideHint: "야외는 Terrace에서만 검색합니다.",
  bookingSuggestionFound: "최적 테이블이 선택되었습니다", bookingSuggestionFailed: "테이블을 추천할 수 없습니다", bookingSuggestionInvalid: "1~6명과 올바른 시간 범위를 입력해 주세요.", bookingSuggestionNone: "이용 가능한 인접 테이블이 없습니다.",
  bookingVeronaLocked: "Verona를 선택할 수 없습니다", bookingVeronaMinimum: "Verona는 3명 이상만 이용할 수 있습니다.",
  bookingConfirmationLabel: "위에 입력한 정보가 정확함을 확인합니다.", bookingConfirmationRequired: "위에 입력한 정보가 정확한지 확인해 주세요.",
});
Object.assign(translations.ja, {
  bookingSuggestBest: "最適なテーブルを提案", bookingFindSuggestion: "最適なテーブルを探す", bookingSeating: "座席エリア", bookingInside: "屋内", bookingOutside: "屋外",
  bookingInsideHint: "屋内はRomaとVeronaから検索し、3～6名はVeronaを優先します。", bookingOutsideHint: "屋外はTerraceのみ検索します。",
  bookingSuggestionFound: "最適なテーブルを選択しました", bookingSuggestionFailed: "テーブルを提案できません", bookingSuggestionInvalid: "1～6名と正しい時間帯を入力してください。", bookingSuggestionNone: "利用可能な隣接テーブルがありません。",
  bookingVeronaLocked: "Veronaは選択できません", bookingVeronaMinimum: "Veronaは3名以上のお客様専用です。",
  bookingConfirmationLabel: "上記の入力情報が正確であることを確認します。", bookingConfirmationRequired: "上記の情報が正確であることを確認してください。",
});
Object.assign(translations.cn, {
  bookingSuggestBest: "推荐最佳餐桌", bookingFindSuggestion: "查找最佳餐桌", bookingSeating: "座位区域", bookingInside: "室内", bookingOutside: "室外",
  bookingInsideHint: "室内仅搜索Roma和Verona，3至6人优先Verona。", bookingOutsideHint: "室外仅搜索Terrace。",
  bookingSuggestionFound: "已选择最佳餐桌", bookingSuggestionFailed: "无法推荐餐桌", bookingSuggestionInvalid: "请输入1至6人及有效的时间范围。", bookingSuggestionNone: "没有合适的相邻空桌。",
  bookingVeronaLocked: "无法选择Verona", bookingVeronaMinimum: "Verona仅供3人及以上使用。",
  bookingConfirmationLabel: "我确认以上填写的信息准确无误。", bookingConfirmationRequired: "请确认以上填写的信息准确无误。",
});
Object.assign(translations.ru, {
  bookingSuggestBest: "Предложить лучший стол", bookingFindSuggestion: "Найти лучший стол", bookingSeating: "Зона размещения", bookingInside: "В помещении", bookingOutside: "На улице",
  bookingInsideHint: "В помещении поиск идет по Roma и Verona; для 3–6 гостей приоритет у Verona.", bookingOutsideHint: "На улице поиск идет только по Terrace.",
  bookingSuggestionFound: "Лучший стол выбран", bookingSuggestionFailed: "Не удалось подобрать стол", bookingSuggestionInvalid: "Укажите от 1 до 6 гостей и корректное время.", bookingSuggestionNone: "Подходящих соседних столов нет.",
  bookingVeronaLocked: "Verona недоступна", bookingVeronaMinimum: "Verona предназначена для групп от 3 гостей.",
  bookingConfirmationLabel: "Я подтверждаю, что введенная выше информация верна.", bookingConfirmationRequired: "Подтвердите правильность введенной выше информации.",
});
Object.assign(translations.kz, {
  bookingSuggestBest: "Ең жақсы үстелді ұсыну", bookingFindSuggestion: "Үстелді табу", bookingSeating: "Отыру аймағы", bookingInside: "Іште", bookingOutside: "Сыртта",
  bookingInsideHint: "Ішкі аймақ Roma және Verona бойынша ізделеді; 3–6 қонаққа Verona басым.", bookingOutsideHint: "Сыртқы аймақ тек Terrace бойынша ізделеді.",
  bookingSuggestionFound: "Ең жақсы үстел таңдалды", bookingSuggestionFailed: "Үстел ұсыну мүмкін болмады", bookingSuggestionInvalid: "1–6 қонақ пен дұрыс уақытты енгізіңіз.", bookingSuggestionNone: "Сәйкес қатар тұрған бос үстелдер жоқ.",
  bookingVeronaLocked: "Verona қолжетімсіз", bookingVeronaMinimum: "Verona кемінде 3 қонаққа арналған.",
  bookingConfirmationLabel: "Жоғарыда енгізілген ақпараттың дұрыстығын растаймын.", bookingConfirmationRequired: "Жоғарыдағы ақпараттың дұрыстығын растаңыз.",
});
Object.assign(translations.es, {
  bookingSuggestBest: "Sugerir la mejor mesa", bookingFindSuggestion: "Buscar la mejor mesa", bookingSeating: "Zona de asiento", bookingInside: "Interior", bookingOutside: "Exterior",
  bookingInsideHint: "En interior se busca en Roma y Verona; Verona tiene prioridad para 3–6 personas.", bookingOutsideHint: "En exterior solo se busca en Terrace.",
  bookingSuggestionFound: "Mejor mesa seleccionada", bookingSuggestionFailed: "No se pudo sugerir una mesa", bookingSuggestionInvalid: "Introduce entre 1 y 6 personas y un horario válido.", bookingSuggestionNone: "No hay mesas contiguas adecuadas disponibles.",
  bookingVeronaLocked: "Verona no está disponible", bookingVeronaMinimum: "Verona está reservada para grupos de 3 o más personas.",
  bookingConfirmationLabel: "Confirmo que la información introducida arriba es correcta.", bookingConfirmationRequired: "Confirma que la información introducida arriba es correcta.",
});
Object.assign(translations.fr, {
  bookingSuggestBest: "Suggérer la meilleure table", bookingFindSuggestion: "Trouver la meilleure table", bookingSeating: "Zone de placement", bookingInside: "Intérieur", bookingOutside: "Extérieur",
  bookingInsideHint: "À l'intérieur, la recherche couvre Roma et Verona ; Verona est prioritaire pour 3 à 6 personnes.", bookingOutsideHint: "À l'extérieur, seule la Terrace est recherchée.",
  bookingSuggestionFound: "Meilleure table sélectionnée", bookingSuggestionFailed: "Impossible de suggérer une table", bookingSuggestionInvalid: "Indiquez de 1 à 6 personnes et une plage horaire valide.", bookingSuggestionNone: "Aucune table adjacente adaptée n'est disponible.",
  bookingVeronaLocked: "Verona n'est pas disponible", bookingVeronaMinimum: "Verona est réservée aux groupes de 3 personnes ou plus.",
  bookingConfirmationLabel: "Je confirme que les informations saisies ci-dessus sont exactes.", bookingConfirmationRequired: "Veuillez confirmer que les informations saisies ci-dessus sont exactes.",
});
Object.assign(translations.it, {
  bookingSuggestBest: "Suggerisci il tavolo migliore", bookingFindSuggestion: "Trova il tavolo migliore", bookingSeating: "Zona dei posti", bookingInside: "Interno", bookingOutside: "Esterno",
  bookingInsideHint: "All'interno la ricerca copre Roma e Verona; Verona ha la priorità per 3–6 ospiti.", bookingOutsideHint: "All'esterno la ricerca copre solo Terrace.",
  bookingSuggestionFound: "Tavolo migliore selezionato", bookingSuggestionFailed: "Impossibile suggerire un tavolo", bookingSuggestionInvalid: "Inserisci da 1 a 6 ospiti e un intervallo orario valido.", bookingSuggestionNone: "Non sono disponibili tavoli adiacenti adatti.",
  bookingVeronaLocked: "Verona non è disponibile", bookingVeronaMinimum: "Verona è riservata a gruppi di almeno 3 ospiti.",
  bookingConfirmationLabel: "Confermo che le informazioni inserite sopra sono corrette.", bookingConfirmationRequired: "Conferma che le informazioni inserite sopra sono corrette.",
});

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => (localStorage.getItem("rtr_language") as Language) || "en");

  const setLanguage = (lang: Language) => {
    localStorage.setItem("rtr_language", lang);
    setLanguageState(lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string) => translations[language]?.[key] || translations.en[key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languageLabels, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
