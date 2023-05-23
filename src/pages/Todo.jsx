import { Divider } from 'antd';
import TodoList from '../components/TodoList';
import Filters from '../components/Filters';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchTodos } from '../components/TodoList/todosSlice';



function ToDo() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTodos());
  }, [])

  return (
    <div
      style={{
        width: 500,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        padding: 20,
        boxShadow: '0 0 10px 4px #bfbfbf',
        borderRadius: 5,
        height: '90vh',
      }}
    >
      <Filters />
      <Divider />
      <TodoList />
    </div>
  );
}

export default ToDo;
