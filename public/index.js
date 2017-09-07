(function (window, document) { //스코프 설정을 위해 function을 한거임 웹팩을 쓰면 자동으로 작업해줘서 필요없음

  /**
   * 서버에서 할일 템플릿과 할일 데이터를 가져온 후, #todos 요소 안에 렌더링하는 함수
   */
  function loadTodos() { //화면을 다시 그려주는 함수
    console.log('start loadTodos')
    render({ //common.js에 render함수로 정의
      target: '#todos', //ejs렌더링 - 아래두개를 여기다 렌더링해라 , index.html에 id가 todos인 녀석
      templatePath: '/templates/todos.ejs', //템플렛은 이경로에서 가져와서 위에 target
      dataPath: '/api/todos' //데이터는 이경로에서 가져와서 위에 target
    }).then(todosEl => { //화면을 다 그린뒤에 타겟에서 찾은 돔 객체를
      todosEl.querySelectorAll('.todo-item').forEach(todoItem => { //todo-item이라는 것을 다 순회하면서 이벤트를 걸어줌
        const id = todoItem.dataset.id  //html의 특이한 기능, dataset , data-로 시작하는 <div class="todo-item" data-id="<%= todo.id %>"> ,todos.ejs에 있는거

        // 체크박스 클릭시
        // 낙관적 업데이트 optimistic update (ajax요청을보내자마자혹은동시에화면갱신을실시-ajax요청이 들어오면 끝 실패하면 취소 혹은 에러처리)
        const checkboxEl = todoItem.querySelector('.todo-checkbox')
        checkboxEl.addEventListener('click', e => {
          axios.patch(`/api/todos/${id}`, {
            complete: e.currentTarget.checked
          }).then(res => {
            loadTodos() //화면을 내부적으로 다시 보여줌
          })
        })

        // 삭제 아이콘 클릭시
        // 비관적 업데이트 pessimistic update : ajax요청 -2초- 응답 이 오면 화면갱신 (성공할지실패할지알수없으니까응답이오면업데이트)
        const removeLink = todoItem.querySelector('.todo-remove')
        removeLink.addEventListener('click', e => {
          axios.delete(`/api/todos/${id}`).then(res => {
            loadTodos() //화면을 내부적으로 다시 보여줌
          })
        })
      })
    })
  }

  document.querySelector('#todo-form').addEventListener('submit', e => { //전송버튼을 누르면 동작
    e.preventDefault()   //굉장히 많이 쓰이는 메서드 , 태그의 기본동작을 취소하는 메서드 , 요청을 취소해버림
    //e.stopPropagation() 이벤트가 더이상 버블링되지않게 멈춰줌 , 많이 쓰이니까 기억하기
    const form = e.currentTarget
    //e.target 이랑 e.currentTarget의 차이점
    axios.post('/api/todos', {
      title: form.elements.title.value  //전송직전에 사용자가 입력한 필드에 들어있는 값을 api에 보내줌
    }) //promise가 반환되니까 .then 으로 이어갈수있다
      .then(loadTodos)
      .then(() => {
        form.elements.title.value = null   //엔터를 눌렀으면 화면을 다시 그린뒤에 필드를 비워줘야하니까
      })
  })

  loadTodos() //한번은 그려줘야 사용자가 정보를 볼수있으니까

})(window, document)
