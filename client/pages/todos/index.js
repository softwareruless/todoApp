import React from 'react';
import { useEffect, useState } from 'react';
import { get } from '../../hooks/request';
import styles from '../../assets/css/styles.module.scss';
import 'bootstrap/dist/css/bootstrap.css';
import Image from 'next/image';

import { FaPlus } from 'react-icons/fa';

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    var data = {
      page: page,
      search: search,
    };

    get('/api/todos', data).then((response) => {
      setTodos(response);
    });
  }, [page, search]);

  console.log('todos', todos);

  return (
    <>
      <div className={styles.container}>
        <div className={`${styles.header} mt-3 mb-3`}>
          <input
            type="text"
            className={`${styles.search} ${styles.width100}`}
            value={search}
            onChange={(e) => e.target.value}
          />
        </div>
        <div className="list">
          <div className={styles.item}>
            <div className={styles.buttonContainer}>
              <button
                className={`${styles.button} ${styles.addButton} btn btn-success`}
              >
                <div className={styles.icon}>
                  <FaPlus />
                </div>

                <p className={styles.addText}>Ekle</p>
              </button>
            </div>
          </div>

          {todos.map(function (todo) {
            return (
              <div className={styles.item}>
                <div className="row">
                  <div className="col-3">
                    <Image
                      src={todo.photo}
                      width={500}
                      height={500}
                      alt="Todo image"
                    />
                  </div>
                  <div className="col-8">
                    <div className="title">{todo.name}</div>
                    <div className="tags">
                      {todo.tags.map(function (tag) {
                        return tag;
                      })}
                    </div>
                  </div>

                  <div className="col-1">
                    <button></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
