<br>

# 📝 Intro

* **프로젝트명** : EduPlayM
* **기간** : 23.07.25(화) ~ 23.08.04(금) [2주]
* **주제** : 영어 미디어 콘텐츠 학습 서비스
* **기능들** :<br> 
[메인페이지] 유저 레벨별, 주제별 다양한 영어 학습 영상 제공 <br>
[상세페이지] 영상에서 확인할 수 있는 문장이 퀴즈로 제공. 퀴즈 정답률에 따라 유저의 레벨 변경<br>
* **기능外** :<br> 
 HLS(HTTP Live Streaming), ABR(Adaptive Bitrate Streaming), multi-threading, multi-processing, Lazy loading, 서버배포(Nginx, 고정IP)
<br>

# 👨‍👩‍👧‍👦Team Members

| Position      | Name          | Github                                            |
|:--------------|:--------------|:--------------------------------------------------|
| Frontend       | 전정훈        | [tube-jeonghoon](https://github.com/tube-jeonghoon)         |
| Backend       | 정혜승        | [hclo99](https://github.com/hclo99)     |
| Backend       | 허지수        | []()     |


<br>


# ⚒ Tech Stack

<br>

|분류|기술|분류|기술|
| :-: | :-: | :-: | :-: |
|Runtime|Node.js|Language|TypeScript, Python|
|Framework|Nest.js|DB|PostgreSQL, RDS, S3|
|Media|video.js, ffmpeg|DevOps|AWS EC2, CloudFront|
|multi-threading|ThreadPoolExecutor|multi-processing|ProcessPoolExecutor|


<br>

# 💣 Troubleshooting

<details>
<summary> #1 로직 구성 </summary>
<img src="https://github.com/project-codeblue/CodeBlue/assets/76824986/f5096a2d-a707-4ff7-98af-cf92b950ed35">
<img src="https://github.com/project-codeblue/CodeBlue/assets/76824986/b2a72318-71b8-490d-b2cf-8bad6b5522f2">

</details>

<details>
<summary> #2 ABR 자동화 </summary>
<img src="https://github.com/project-codeblue/CodeBlue/assets/76824986/fa0ae885-3661-40c8-ae2f-19b9eca08ab5">
<img src="https://github.com/project-codeblue/CodeBlue/assets/76824986/9791362e-7aef-4795-b1a7-dd9e008b7af7">

</details>

<details>
<summary> #3 ABR 속도개선 </summary>
<img src="https://github.com/project-codeblue/CodeBlue/assets/76824986/7b0a06ed-8943-430e-b929-9061c156794a">
<img src="https://github.com/project-codeblue/CodeBlue/assets/76824986/89952e5d-c4cc-41c2-822b-c3a7fd026260">

</details>

<br>

# 🚩 API 명세서

![API 명세서]

<br>

#  📒 ERD

![2023-06-26 14;29;26]


<br>

# 📝Commit Convention

<details>
<summary> Commit Convention 펼쳐보기 </summary>
<div markdown="1">  
  <br>
● 제목은 최대 30글자이하로 작성: ex) feat: Add Key mapping
  <br>
● 본문은 아래에 작성  
<br><br>

--- <타입> 리스트 --- 
```
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
```
--- <꼬리말> 필수아닌 옵션 ---   
```
Fixes        : 이슈 수정중 (아직 해결되지 않은 경우)  
Resolves     : 이슈 해결했을 때 사용  
Ref          : 참고할 이슈가 있을 때 사용  
Related to   : 해당 커밋에 관련된 이슈번호 (아직 해결되지 않은 경우)  
ex) Fixes: #47 Related to: #32, #21
```

</div>
</details>

# 🗒️Code Convention

<details>
<summary> Code Convention 펼쳐보기 </summary>
<div markdown="1">  
  <br>

--- Prettier & Eslint 자동 적용 ---   
```
singleQuote: true → 작은 따옴표(') 사용
trailingComma: "all" → 객체 또는 배열의 마지막 요소 뒤에 항상 쉼표(,) 추가
tabWidth: 2 → 들여쓰기 탭의 너비 2
semi: true → 문장의 끝에 항상 세미콜론(;) 추가
arrowParens: "always" → 화살표 함수 매개변수에 항상 괄호(ex, (param)=>expression) 추가 
endOfLine: "auto" → 자동으로 행 종결 문자를 선택하도록 설정(줄 바꿈 문자(\n)→줄 바꿈 문자(\r\n))
```


 
</div>
</details>
<br><br><br>
