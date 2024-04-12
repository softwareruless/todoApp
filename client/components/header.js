import Link from 'next/link';
import styles from '../assets/css/styles.module.scss';

export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href}>
          <Link className="nav-link" href={href}>
            {label}
          </Link>
        </li>
      );
    });

  return (
    <div className="bg-light ">
      <nav className="navbar navbar-light col-11 m-auto">
        <link rel="icon" href="../assets/img/logo.jpg" sizes="any" />

        <Link className="navbar-brand" href="/">
          Todo App
        </Link>

        <div className="d-flex justify-content-end">
          <ul className="nav d-flex align-items-center">{links}</ul>
        </div>
      </nav>
    </div>
  );
};
