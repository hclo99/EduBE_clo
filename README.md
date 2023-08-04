# ✏️ EduPlayM (영어 미디어 콘텐츠 학습 서비스) 

###  ● Period : 23.07.25(화) ~ 23.08.04(금) [2주]
###  ● What we do : 
      [기능] HLS(HTTP Live Streaming), ABR(Adaptive Bitrate Streaming), 유저 레벨별 맞춤 퀴즈 제공
      [기능 外] multi-threading, multi-processing, Lazy loading, 서버배포(Nginx, 고정IP) 
###  ● Homepage  : [EduPlayM](https://eduplay.jisuheo.shop)
###  ● Pro. log  : [notion](https://www.notion.so/EduPlayM-bf7c454e4230439c96490f30fc39dd74)
###  ● Reference : cake 어플

<br>

## 👨‍👩‍👧‍👦Team Members

| Position      | Name          | Github                                            |
|:--------------|:--------------|:--------------------------------------------------|
| Frontend       | 전정훈        | []()         |
| Backend       | 정혜승        | [hclo99](https://github.com/hclo99)     |
| Backend       | 허지수        | []()     |

<br>

## 🏛️ Project AtoZ
### 주제 : 영어 미디어 콘텐츠 학습 서비스
### 의도 : 질 좋고 많은 수의 영상을 하나의 페이지에 버퍼링이나 끊김 없이 재생시킬 수 있으며, 유저 레벨별 맞춤 퀴즈를 제공하여 영어 학습에 도움이 되는 서비스 
### 난제 : ABR 처리를 어떻게 싸고, 빠르게 할 것인가?
          → multi-threading, multi-processing, CDN, 로직변경 등을 통해 해결
### 이슈 및 해결방안:
<details>
  <summary> 이슈 및 해결방안 펼쳐보기 </summary>
내용기입
<div markdown="1">
<br>

# 📝Commit Convention 
<details>
  
<summary> Code Convention 펼쳐보기 </summary>

<div markdown="1">  

  <br>

  제목은 최대 50글자까지 아래에 작성: ex) feat: Add Key mapping

--- COMMIT END --- 

<타입> 리스트  
feat        : 기능 (새로운 기능)  
fix         : 버그 (버그 수정)  
refactor    : 리팩토링  
design      : CSS 등 사용자 UI 디자인 변경  
comment     : 필요한 주석 추가 및 변경  
style       : 스타일 (코드 형식, 세미콜론 추가: 비즈니스 로직에 변경 없음)  
docs        : 문서 수정 (문서 추가, 수정, 삭제, README)  
test        : 테스트 (테스트 코드 추가, 수정, 삭제: 비즈니스 로직에 변경 없음)  
chore       : 기타 변경사항 (빌드 스크립트 수정, assets, 패키지 매니저 등)  
init        : 초기 생성  
rename      : 파일 혹은 폴더명을 수정하거나 옮기는 작업만 한 경우  
remove      : 파일을 삭제하는 작업만 수행한 경우 

</div>
</details>