import Header from './header';

const Layout = ({ children }) => {
  // toast.success('Basarili');
  // İsterseniz burada farklı layoutlar için koşullar da ekleyebilirsiniz.
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default Layout;
