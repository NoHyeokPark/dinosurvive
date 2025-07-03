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
- **스프라이트 애니메이션** 제작 및 최적화
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

