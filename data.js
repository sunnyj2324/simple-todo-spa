let todoSeq = 1 //식별자로 쓰이는 변수를 따로둠
const todos = [ //data.todos
  {
    id: todoSeq++,
    title: "sample todo",
    complete: false
  },
  {
    id: todoSeq++,
    title: "completed todo",
    complete: true
  }
]

function addTodo({title}) {
  const newTodo = {
    id: todoSeq++,
    title,
    complete: false
  }
  todos.push(newTodo)
  return newTodo
}

function updateTodo(id, source) {
  const todo = todos.find(item => item.id === id)
  if (todo) {
    Object.assign(todo, source)
    return todo
  } else {
    throw new Error('해당 id를 갖는 요소가 없습니다.')
  }
}

function deleteTodo(id) {
  const index = todos.findIndex(item => item.id === id)
  if (index !== -1) {
    todos.splice(index, 1)
  }
}

module.exports = {
  todos,
  addTodo,
  updateTodo,
  deleteTodo
}  //node.js모듈이 자료를 공유할수없지만 exports를 하면 다른모듈에서 불러와서 사용할수 있다.(공개)
