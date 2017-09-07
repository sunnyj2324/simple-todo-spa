const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const data = require('./data') //data를 node.js모듈로 따로 빼놨음.직접 만든 모듈은 경로지정을 해야함 data를 불러와서 사용(exports)

const app = express()
const jsonMiddleware = bodyParser.json()

app.use(morgan('tiny'))
app.use(express.static('public')) //startic을 경로없이 사용하고있다

app.get('/api/todos', (req, res) => {
  res.send(data.todos) //배열 (jason형태의 응답이 간다)
})

app.post('/api/todos', jsonMiddleware, (req, res) => { //새로운 배열을 생성해서 status
  const {title} = req.body
  if (title) {
    const todo = data.addTodo({title})
    res.send(todo)
  } else {
    res.status(400)
    res.end()
  }
})

app.patch('/api/todos/:id', jsonMiddleware, (req, res) => {
  let id;
  try {
    id = parseInt(req.params.id)
  } catch (e) {
    res.status(400)
    res.end()
    return // 바로 라우트 핸들러를 종료합니다.
  }
  const todo = data.updateTodo(id, req.body)
  res.send(todo)
})

app.delete('/api/todos/:id', jsonMiddleware, (req, res) => {
  let id;
  try {
    id = parseInt(req.params.id)
  } catch (e) {
    res.status(400)
    res.end()
    return // 바로 라우트 핸들러를 종료합니다.
  }
  data.deleteTodo(id)
  res.end()
})

app.listen(3000, () => {
  console.log('listening...')
})
//localhost:3000을 누르는 순간에 public에서 index.html을 찾아서 바로 보여줌
//render 하지않고 send 혹은 end로 응답하고있음(jason 형태의 응답) redirect하지않음
