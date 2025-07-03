# 🦕 DinoSurvive

<div align="center">
  
![DinoSurvive Logo](https://via.placeholder.com/400x120/4CAF50/FFFFFF?text=🦕+DinoSurvive)

**귀여운 공룡이 빙하기를 뚫고 살아남는 뱀서라이크 생존 게임**

[![JavaScript](https://img.shields.io/badge/JavaScript-ES2020-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[🎮 플레이하기](https://nohyeokpark.github.io/dinosurvive) | [📋 이슈 리포트](https://github.com/NoHyeokPark/dinosurvive/issues) | [💡 기능 제안](https://github.com/NoHyeokPark/dinosurvive/discussions)

</div>

---

## 📖 프로젝트 소개

**DinoSurvive**는 Vanilla JavaScript와 HTML5 Canvas로 제작된 2D 뱀서라이크(Vampire Survivors-like) 생존 게임입니다. 

다가오는 빙하기 속에서 귀여운 공룡을 조작하여 몰려오는 적들을 물리치고 최대한 오래 생존하는 것이 목표입니다. 레벨업마다 랜덤으로 제시되는 다양한 무기 중에서 선택하여 나만의 독특한 빌드를 만들어보세요!

### 🎯 주요 학습 목표
- **localStorage를 활용한 점수 기록 시스템** 구현
- **스프라이트 애니메이션**
- **게임 루프와 상태 관리** 패턴 학습

## ✨ 주요 기능

### 🎲 랜덤 무기 시스템
- 레벨업마다 3가지 무기/패시브 중 선택
- 같은 무기 중복 선택으로 업그레이드 가능
- 다양한 조합으로 나만의 빌드 완성

### 💾 로컬 점수 저장
- `localStorage`를 활용한 최고 점수 기록
- 달성 날짜와 시간 자동 저장
- 게임 재시작 시 이전 기록 자동 로드

### 🦖 스프라이트 애니메이션
- 8프레임 공룡 걷기 애니메이션
- 부드러운 움직임과 방향 전환
- 최적화된 캔버스 렌더링

### 📈 점진적 난이도 증가
- 시간이 지날수록 적의 속도와 체력 증가
- 더 많은 적 동시 스폰
- 무한 웨이브 시스템

## 🚀 빠른 시작

### 필수 요구사항
- 모던 웹 브라우저 (Chrome, Firefox, Safari, Edge)
- 로컬 HTTP 서버 (CORS 정책으로 인해 file:// 프로토콜 불가)

### 설치 및 실행
1. 저장소 클론
git clone https://github.com/NoHyeokPark/dinosurvive.git
cd dinosurvive

2. 로컬 서버 실행 (방법 1: Python)
python -m http.server 8000

2. 로컬 서버 실행 (방법 2: Node.js)
npx http-server -p 8000

2. 로컬 서버 실행 (방법 3: VSCode Live Server 확장)
VSCode에서 index.html 우클릭 → "Open with Live Server"
브라우저에서 `http://localhost:8000` 접속하여 게임을 플레이하세요!

## 🎮 게임 방법

### 기본 조작
- **이동**: 방향키 (↑↓←→) 또는 WASD
- **일시정지**: 스페이스바 또는 마우스 클릭
- **무기 선택**: 레벨업 시 마우스 클릭

### 게임 플레이
1. 공룡을 조작하여 적들을 피하거나 무찌르세요
2. 경험치를 획득하여 레벨업하세요
3. 레벨업 시 제시되는 3가지 옵션 중 하나를 선택하세요
4. 무기를 조합하여 강력한 빌드를 만드세요
5. 최대한 오래 생존하여 최고 점수를 달성하세요!

### 점수 시스템
- **생존 시간**: 1초당 10점
- **적 처치**: 적 종류별 차등 점수
- **레벨 보너스**: 레벨업당 추가 점수

## 📁 프로젝트 구조

dinosurvive/
├── index.html # 메인 HTML 파일
├── css/
│ └── style.css # 게임 스타일시트
├── js/
│ ├── main.js # 게임 메인 로직
│ ├── player.js # 플레이어 클래스
│ ├── enemy.js # 적 클래스
│ ├── weapon.js # 무기 시스템
│ ├── storage.js # localStorage 관리
│ └── utils.js # 유틸리티 함수
├── assets/
│ ├── sprites/
│ │ ├── dino.png # 공룡 스프라이트 시트
│ │ └── enemies.png # 적 스프라이트
│ ├── audio/
│ │ ├── bgm.mp3 # 배경음악
│ │ └── sfx/ # 효과음 파일들
│ └── images/
│ └── logo.png # 게임 로고
└── README.md


## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES2020+)
- **Graphics**: HTML5 Canvas API
- **Storage**: Web Storage API (localStorage)
- **Audio**: Web Audio API
- **Animation**: RequestAnimationFrame

## 📊 localStorage 구조

// 저장되는 데이터 구조
{
"bestScore": 15420, // 최고 점수
"bestScoreDate": "2025-07-03T19:51:00.000Z", // 달성 일시
"totalPlayTime": 3600, // 총 플레이 시간 (초)
"gamesPlayed": 25 // 총 게임 횟수
}


## 🎨 스프라이트 정보

### 공룡 스프라이트 시트
- **크기**: 512x64px (8프레임 × 64x64px)
- **애니메이션**: 걷기, 대기, 공격
- **프레임 속도**: 8fps

### 적 스프라이트
- **얼음 조각**: 32x32px
- **눈덩이**: 48x48px
- **빙하 몬스터**: 64x64px

## 🎵 오디오 에셋

- **배경음악**: 8-bit 스타일 루프 BGM
- **효과음**: 
  - 무기 발사음
  - 적 처치음
  - 레벨업 사운드
  - 게임오버 사운드

## 🏆 업적 시스템 (예정)

- 🥉 **첫 걸음**: 첫 게임 완료
- 🥈 **생존자**: 5분 이상 생존
- 🥇 **얼음 파괴자**: 100마리 처치
- 💎 **빌드 마스터**: 모든 무기 조합 시도

## 🐛 알려진 이슈

- [ ] 모바일 터치 컨트롤 미지원
- [ ] 일부 브라우저에서 오디오 자동재생 제한
- [ ] 고해상도 디스플레이에서 스프라이트 블러 현상

## 🔮 향후 계획

### v1.1.0
- [ ] 모바일 터치 지원
- [ ] 새로운 무기 3종 추가
- [ ] 보스 몬스터 시스템

### v1.2.0
- [ ] 멀티플레이어 모드
- [ ] 온라인 리더보드
- [ ] 커스텀 스킨 시스템

### v2.0.0
- [ ] 3D 그래픽 전환
- [ ] 스토리 모드 추가
- [ ] 모바일 앱 출시

## 🤝 기여하기

프로젝트에 기여해주셔서 감사합니다! 다음 단계를 따라주세요:

1. **Fork** 이 저장소를 포크하세요
2. **Branch** 새로운 기능 브랜치를 만드세요 (`git checkout -b feature/amazing-feature`)
3. **Commit** 변경사항을 커밋하세요 (`git commit -m 'Add amazing feature'`)
4. **Push** 브랜치에 푸시하세요 (`git push origin feature/amazing-feature`)
5. **Pull Request** 를 열어주세요

### 기여 가이드라인
- 코드 스타일: Prettier 설정 준수
- 커밋 메시지: [Conventional Commits](https://conventionalcommits.org/) 형식
- 테스트: 새로운 기능에 대한 테스트 코드 작성

## 📄 라이선스

이 프로젝트는 [MIT License](LICENSE) 하에 배포됩니다.

## 👨‍💻 개발자

**NoHyeokPark** - [GitHub](https://github.com/NoHyeokPark)

## 🙏 감사의 말

- 스프라이트 아트: [OpenGameArt.org](https://opengameart.org/)
- 사운드 이펙트: [Freesound.org](https://freesound.org/)
- 영감을 준 게임: [Vampire Survivors](https://store.steampowered.com/app/1794680/Vampire_Survivors/)

---

<div align="center">

**🦕 Have fun and keep the dino alive! 🧊**

Made with ❤️ and JavaScript

</div>

