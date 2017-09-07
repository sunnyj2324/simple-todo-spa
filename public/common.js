function render({ target, templatePath, dataPath, queryFrom = document }) {
  // 템플릿 가져오기
  const templatePromise = axios.get(templatePath) //템플렛을 가져와서 Promise로 저장해둠 : 비동기작업이라 기다리고있음

  // 데이터 가져오기
  const dataPromise = axios.get(dataPath) //데이터를 가져와서 Promise로 저장해둠 : 비동기작업이라 기다리고있음

  // 둘다 완료되면...
  return Promise.all([templatePromise, dataPromise]) //새로운 프라미스를 만드는데 성공조건은 위의 두개가 모두 성공하면 성공하는거임
    .then(([templateRes, dataRes]) => { //성공하고나면 값을 배열로 묶어서 온다 성공한 다음에 .then으로 이어가지
      // 템플릿 렌더링하기
      const html = ejs.render(templateRes.data, {
        todos: dataRes.data
      })

      // 렌더링 결과를 문서에 주입하기
      const targetEl = queryFrom.querySelector(target) //#todos
      targetEl.innerHTML = html
      return targetEl
    })

  // 위에서 Promise를 반환하고 있기 때문에 render 함수의 반환값에 `.then`을 이어붙일 수 있습니다.
} //render를 호출하면 promise 성공된 then을 가져오는데 then도 결국 promise임
