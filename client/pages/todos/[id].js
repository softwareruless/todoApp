import { useEffect, useState } from 'react';
import { post, get } from '../../hooks/request';
import styles from '../../assets/css/styles.module.scss';
import { useRouter } from 'next/router';

export default function Detail() {
  const [todo, setTodo] = useState(null);
  const router = useRouter();
  const id = router.query.id;
  console.log('id', id);
  useEffect(() => {
    get('/api/todos/' + id).then((response) => {
      setTodo(response);
    });
  }, []);

  console.log('todo', todo);

  return (
    <div className={styles.container}>
      <div className={`${styles.header} mt-3 mb-3`}>
        <h2>Todo Ekle</h2>
        <span className={styles.close} onClick={() => setIsOpen(false)}>
          x
        </span>
        <input
          placeholder="Todo İsmi"
          value={todo.name}
          onChange={(e) => setNewTodo(e.target.value)}
        />

        <br></br>
        <button className="btn btn-success mt-2" onClick={() => saveTodo()}>
          Kaydet
        </button>
      </div>
    </div>
  );
}
