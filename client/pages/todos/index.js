import React from 'react';
import { useEffect, useState } from 'react';
import { post, get } from '../../hooks/request';
import styles from '../../assets/css/styles.module.scss';
import 'bootstrap/dist/css/bootstrap.css';
import Image from 'next/image';
import logo from '../../assets/img/logo.jpg';
import Link from 'next/link';
import { FaPlus, FaPen, FaCheck } from 'react-icons/fa';

import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#0d6efd',
    border: 'none',
    borderRadius: '1rem',
    width: '20rem',
    position: 'fixed',
  },
};

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [newTodo, setNewTodo] = useState('');
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
    setNewTodo('');
  };

  const saveTodo = () => {
    var data = {
      name: newTodo,
    };
    post('/api/todos', data);
  };

  useEffect(() => {
    get('/api/todos/list/' + page + '/' + search).then((response) => {
      setTodos(response);
    });
  }, [page, search]);

  console.log('todos', todos);
  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        style={customStyles}
        overlayClassName={styles.modal}
        contentLabel="Example Modal"
      >
        <h2>Todo Ekle</h2>
        <span className={styles.close} onClick={() => setIsOpen(false)}>
          x
        </span>
        <input
          placeholder="Todo İsmi"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />

        <br></br>
        <button className="btn btn-success mt-2" onClick={() => saveTodo()}>
          Kaydet
        </button>
      </Modal>

      <div className={styles.container}>
        <div className={`${styles.header} mt-3 mb-3`}>
          <input
            type="text"
            className={`${styles.search} ${styles.width100}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="list">
          <div className={styles.item}>
            <div className={styles.buttonContainer}>
              <button
                onClick={() => openModal()}
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
              <div className={styles.item} key={todo.id}>
                <div className="row">
                  <div className="col-3">
                    <Image
                      src={todo.photo ? todo.photo : logo}
                      width={100}
                      height={100}
                      alt="Todo image"
                    />
                  </div>
                  <div className="col-8 d-grid">
                    <div className="title align-items-center">{todo.name}</div>
                    <div className="tags align-items-center">
                      {todo.tags.map(function (tag) {
                        return tag + ' ';
                      })}
                    </div>
                  </div>

                  <div className="col-1 d-flex">
                    <Link
                      href={`/todos/${todo.id}`}
                      className="align-items-center"
                    >
                      <button className="btn btn-primary">
                        <FaPen />
                      </button>
                    </Link>
                    <div className="align-items-center">
                      <button className="btn btn-success">
                        <FaCheck />
                      </button>
                    </div>
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
