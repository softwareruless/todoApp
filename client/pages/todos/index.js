import React from 'react';
import { useEffect, useState } from 'react';
import { get } from '../../hooks/request';
import styles from '../../assets/css/styles.module.scss';
import 'bootstrap/dist/css/bootstrap.css';
import Image from 'next/image';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Todos() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    get('/api/todos').then((response) => {
      setTodos(response);
    });
  }, []);

  console.log('todos', todos);

  return (
    <>
      <div className={styles.container}>
        <div className={`${styles.header} mt-3 mb-3`}>
          <input
            type="text"
            className={`${styles.search} ${styles.width100}`}
          />
        </div>
        <div className="list">
          <div className={styles.item}>
            <div className={styles.buttonContainer}>
              {/* <FontAwesomeIcon icon="fa-solid fa-plus" /> */}
              <button className="add"></button>
            </div>
          </div>

          <div className={styles.item}>
            <div className="row">
              <div className="col-3">
                <Image
                  src="/assets/img/logo.jpg"
                  width={500}
                  height={500}
                  alt="Todo image"
                />
              </div>
              <div className="col-8">
                <div className="title">Todo 1</div>
                <div className="tags">Tag 1 Tag 2 Tag 3</div>
              </div>

              <div className="col-1">
                <button></button>
              </div>
            </div>
          </div>

          <div className={styles.item}>
            <div className="row">
              <div className="col-3">
                <Image
                  src="/assets/img/logo.jpg"
                  width={500}
                  height={500}
                  alt="Todo image"
                />
              </div>
              <div className="col-8">
                <div className="title">Todo 1</div>
                <div className="tags">Tag 1 Tag 2 Tag 3</div>
              </div>

              <div className="col-1">
                <button></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
