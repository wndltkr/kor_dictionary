const query = document.getElementById('search') // 검색 영역
const submitBtn = document.getElementById('submit') // 검색 버튼
const BASE_URL = 'https://directory-search-zczb123.herokuapp.com/api/words'

// 사용자 입력 유효성 검증(특수문자)
function checkIfStringHasSpecialCharacter(str) {
    const re = /[`!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/;
    return re.test(str);
}

// 사용자 입력 유효성 검증(숫자)
function checkIfStringHasNumbers(str) {
    return /\d/.test(str);
}

// 사용자 입력 유효성 검증(영어)
function checkIfStringHasLetters(str) {
    return /[a-z]/i.test(str); // /[a-z]/i: 알파벳 대소문자 모두 포함
}

function enableSubmitBtn(state){
    submitBtn.disabled=state
}

// 서버 데이터 가져오기(그대로 실행하면 CORS 오류 발생 -> cors 옵션 수정 필요)
function getData(baseUrl, query){
    enableSubmitBtn(true)
    console.log('서버 접속중...')

    // 사용자 입력 유효성 검증(특수문자)
    if(checkIfStringHasSpecialCharacter(query)) {
        enableSubmitBtn(false)
        result.innerHTML = "검색어에 특수문자가 포함되어 있습니다. 한글로 입력해주세요."
        return;
    }

    // 사용자 입력 유효성 검증(숫자)
    if(checkIfStringHasNumbers(query)) {
        enableSubmitBtn(false)
        result.innerHTML = "검색어에 숫자가 포함되어 있습니다. 한글로 입력해주세요."
        return;
    }

    // 사용자 입력 유효성 검증(영어)
    if(checkIfStringHasLetters(query)) {
        enableSubmitBtn(false)
        result.innerHTML = "검색어에 영어가 포함되어 있습니다. 한글로 입력해주세요."
        return;
    }

    // fetch: (비동기함수) 원격 API를 간편하게 호출할 수 있도록 브라우저에서 제공
    fetch(`${baseUrl}/${query}`, { // fetch(접속할 서버 주소, 옵션(객체))
        headers:{
            "Content-Type": "application/json" // 보낼 데이터 타입
        }
    })
    .then(res => res.json()) // json 문자열로 변경
    .then(data => { // json 문자열로 변경된 데이터
        enableSubmitBtn(false)
        console.log(data) // 데이터 확인
        
        // 버튼 활성화

        // 데이터 꺼내기
        const {words} = data;

        // 유효성 검사
        if(words.length === 0){
            result.innerHTML = "No Words Found !"
            return;
        }

        // 데이터를 출력할 템플릿 생성
        const template = words.map(word => {
            return (
                `
                    <div class="item move-up">
                        <div class="word">${word.keyword}<sup>${word.seq}</sup><p class="hanja">${word.hanja}</p> <a href="${word.link}">더 보기  &raquo;</a></div>
                        <p class="description"><span>${word.word_class}</span> ${word.meaning}</div>
                        
                    </div>  
                `
            )
        })

        result.innerHTML = template.join("") // template에 있는 내용을 DOM('container') 안에 삽입
    })
}

submitBtn.addEventListener('click', function(){ // 검색 버튼 클릭 시 콜백함수 실행
    console.log(query.value) // 검색 영역에 작성한 값(검색어) 콘솔에 출력
    // 버튼 비활성화
    this.disabled = true
     // this = submitBtn
})

// 추가 이벤트: 키보드 이벤트
query.addEventListener('keypress', function(e){
    if(e.keyCode === 13){
        getData(BASE_URL, query.value)
    }
})

// 초기 화면
window.addEventListener('DOMContentLoaded', function(){ // 페이지 내에 컨텐츠가 모두 로드되었을 때 콜백함수 실행
    //getData(BASE_URL)
    setTimeout(getData(BASE_URL, query.value), 5000) //setTimeout(함수, 밀리초)
})