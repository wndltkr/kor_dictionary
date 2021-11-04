const query = document.getElementById('search') // 검색 영역
const submitBtn = document.getElementById('submit') // 검색 버튼
// const BASE_URL = 'http://localhost:5000/api/words' // base url 설정(로컬)
const BASE_URL = 'https://dictionary-wndltkr.herokuapp.com/api/words' // base url 설정
const wordName = ['학교', '학원', '소설', '수학', '역사', '가다', '나', '고리'];

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
function getData(baseUrl, sel, query){
    enableSubmitBtn(true)

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
        if(query != undefined){
            result.innerHTML = "검색어에 영어가 포함되어 있습니다. 한글로 입력해주세요."
            return;
        }
    }
    
    // fetch: (비동기함수) 원격 API를 간편하게 호출할 수 있도록 브라우저에서 제공
    fetch(`${baseUrl}/${sel}/${query}`, { // fetch(접속할 서버 주소, 옵션(객체))
        headers:{
            "Content-Type": "application/json" // 보낼 데이터 타입
        }
    })
    .then(res => res.json()) // json 문자열로 변경
    .then(data => { // json 문자열로 변경된 데이터
        enableSubmitBtn(false)
        console.log(data) // 데이터 확인
        
        // 데이터 꺼내기
        const {words} = data;

        if(words.length === 0){
            result.innerHTML = "검색 결과가 없습니다 !"
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

// 검색어 자동 완성
window.onload = function() {
autocomplete.setAutocomplete(document.getElementById("search"), wordName)
}
let autocomplete = (function () {
// 지역 변수
let _inp = null;
let _arr = [];
let _currentFocus;
let _setAutocomplete = function(inp, arr) {
  // autocomplete할 배열
  _arr = arr;

  // 기존의 input 값과 같지 않다면, 리스너 해제
  if (_inp === inp) {
      return;
  }

  // 기존 리스너해제
  _removeListener();

  // 새로운 input 의 리스너 추가
  _inp = inp;
  _inp.addEventListener("input", inputEvent);
  _inp.addEventListener("keydown", keydownEvent);
}

let inputEvent = function (e) {
  var a, b, i, val = this.value;

  // 이전 생성된 div 제거
  closeAllLists();
  
  // 요소 확인
  if (!val) {
      return false;
  }

  // 현재의 포커스의 위치는 없음.
  _currentFocus = -1;
  
  // autocomplet에서 항목을 보여줄 div 생성
  a = document.createElement("DIV")

  // id속성 추가
  a.setAttribute("id", this.id + "autocomplete-list");
  
  // class속성 추가
  a.setAttribute("class", "autocomplete-items");

  // input 아래의 div 붙이기. (검색창 아래)
  this.parentNode.appendChild(a);

  // autocomplet할 요소 찾기
  for (i = 0; i < _arr.length; i++) {
      // 배열의 요소를 현재 input의 value의 값만큼 자른 후, 같으면 추가한다.
      if (_arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          b = document.createElement("DIV");
          // value의 값 만큼 굵게 표시
          b.innerHTML = "<strong>" + _arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += _arr[i].substr(val.length);
          b.innerHTML += "<input type='hidden' value='"+ _arr[i] + "'>";

          // 생성된 div에서 이벤트 발생시 hidden으로 생성된 input안의 value의 값을 autocomplete할 요소에 넣기
          b.addEventListener("click", function(e) {
              _inp.value = this.getElementsByTagName("input")[0].value;
              closeAllLists();
          });

          // autocomplete 리스트를 붙이기.
          a.appendChild(b);
      }
  }
}

// 자동 완성 검색어를 키보드를 이용해서 클릭할 이벤트
let keydownEvent = function(e) {
  // input이벤트로 생성된 div의 값 가져오기
  var x = document.getElementById(this.id + "autocomplete-list");
  // 선택할 요소 없으면 null,
  // <div id="autoInputautocomplete-list" class="autocomplete-items"><div class="autocomplete-active"><strong>A</strong>ardvark<input type="hidden" value="Aardvark"></div><div><strong>A</strong>lbatross<input type="hidden" value="Albatross"></div><div><strong>A</strong>lligator<input type="hidden" value="Alligator"></div><div><strong>A</strong>lpaca<input type="hidden" value="Alpaca"></div><div><strong>A</strong>nt<input type="hidden" value="Ant"></div><div><strong>A</strong>nteater<input type="hidden" value="Anteater"></div><div><strong>A</strong>ntelope<input type="hidden" value="Antelope"></div><div><strong>A</strong>pe<input type="hidden" value="Ape"></div><div><strong>A</strong>rmadillo<input type="hidden" value="Armadillo"></div></div>
  if (x) {
      // 태그 네임을 가지는 엘리먼트의 유요한 html 컬렉션을 반환.
      // div의 값을 htmlCollection의 값으로 받아옴.
      x = x.getElementsByTagName("div");
  }

  if (e.keyCode == 40) { // down
      // 현재위치 증가
      _currentFocus++;
      // 현재위치의 포커스 나타내기
      addActive(x);
  } else if (e.keyCode == 38) { // up
      // 현재위치 감소
      _currentFocus--;
      // 현재위치의 포커스 나타내기
      addActive(x);
  } else if (e.keyCode == 13) { // enter
      // e.preventDefault() 다른 이벤트를 중단시킨다.
      //e.preventDefault();
      // 현재위치가 아이템 선택창내에 있는 경우
      if (_currentFocus > -1) {
          // 현재 위치의 값 클릭
          if (x) x[_currentFocus].click();
      }
  }
}

// class에 active속성속성 추가
let addActive = function (x) {
  if (!x) return false;
  removeActive(x);
  if (_currentFocus >= x.length) _currentFocus = 0;
  if (_currentFocus < 0) _currentFocus = (x.length - 1);
  x[_currentFocus].classList.add("autocomplete-active");
}

// class에 active속성 제거
let removeActive = function (x) {
  for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
  }
}


let closeAllLists = function (elmnt) {
  var x = document.getElementsByClassName("autocomplete-items");
  for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != _inp) {
          x[i].parentNode.removeChild(x[i]);
      }
  }
}

// 리스너 해제
let _removeListener = function () {
  if (_inp !== null) {
      console.log(_inp)
      _inp.removeEventListener("input", inputEvent, false);
      _inp.removeEventListener("keydown", keydownEvent, false);
  }
}
return {
  // 객체를 리턴하기 위해서 바로 객체를 정의하고 리턴
  setAutocomplete: function (inp, arr) {
      _setAutocomplete(inp, arr);
  }, // 콤마 없어도 되지않나 ?
}
})();

// 검색 버튼 클릭시 이벤트 실행
submitBtn.addEventListener('click', function(){
console.log(query.value)
getData(BASE_URL, select.value, query.value)
})
// 엔터키로 검색가능하게 하기
query.addEventListener('keypress', function(e) {
if(e.keyCode === 13) {
e.preventDefault();
getData(BASE_URL, select.value, query.value)
}
})
// 처음 로딩시 이벤트 발생
window.addEventListener('DOMContentLoaded', function() {
// setTimeout(function() {
//     getData(BASE_URL, selectBox.value, query.value)
// }, 3000);

getData(BASE_URL, select.value, query.value);
});