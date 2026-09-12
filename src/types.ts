export interface Person {
  name: string;
  engName: string;
  relation: string; // e.g., '장남', '차녀'
  father: string;
  fatherDeceased?: boolean;
  mother: string;
  motherDeceased?: boolean;
  phone: string;
  account: {
    bank: string;
    number: string;
    holder: string;
  };
}

export interface ParentAccount {
  title: string; // e.g. '아버지 강현우', '어머니 김영미'
  bank: string;
  number: string;
  holder: string;
}

export interface StoryItem {
  id: string;
  date: string;
  title: string;
  description: string;
  image: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  tag?: string; // e.g. '갤러리 1', '갤러리 2'
  widthRatio?: 'wide' | 'tall' | 'square';
}

export interface WeddingData {
  groom: Person;
  bride: Person;
  groomParentsAccounts: ParentAccount[];
  brideParentsAccounts: ParentAccount[];
  wedding: {
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    formattedDate: string; // e.g. '2026년 10월 24일 토요일 오후 1시 30분'
    venueName: string; // e.g. '그랜드 하얏트 서울'
    hallName: string; // e.g. '1층 그랜드볼룸'
    address: string; // e.g. '서울특별시 용산구 소월로 322'
    detailedLocation: string; // e.g. '한강진역 2번 출구 셔틀버스 상시 운행'
    tel: string;
    mealInfo: string;
    parkingInfo: string;
    subwayInfo: string;
    busInfo: string;
  };
  greeting: {
    title: string;
    quote?: string;
    author?: string;
    paragraphs: string[];
  };
  cover: {
    badge: string; // e.g. 'WEDDING INVITATION'
    headline: string; // e.g. '함께 걷는 계절'
    subline: string; // e.g. '저희 두 사람의 새로운 시작을 함께해 주세요'
    mainImage: string; // <갤러리 0>
  };
  carouselPhotos: GalleryItem[]; // <갤러리 1> ~ <갤러리 5> (가로 스크롤 캐러셀)
  stories: StoryItem[];
  gallery: GalleryItem[];
  settings: {
    showPetals: boolean;
    petalStyle: 'sakura' | 'white-rose' | 'golden';
    petalSpeed: number;
    bgmAutoPlay: boolean;
  };
}

export interface RsvpEntry {
  id: string;
  name: string;
  side: 'groom' | 'bride';
  attendance: 'attend' | 'absent';
  guestCount: number;
  meal: 'yes' | 'no' | 'undecided';
  bus: 'yes' | 'no';
  phone: string;
  message?: string;
  createdAt: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  likes: number;
  emoji?: string;
  createdAt: string;
}
