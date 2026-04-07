export const Button = ({ children, onClick }) => {
    return (
      <button className="btn btn-primary m-2" onClick={onClick}>
        {children}
      </button>
    );
  };