import "./Home.scss";

function Home() {
  return (
    <div className="home">
      <div className="home__welcome-message">
        <h1 className="home__welcome-message__header">
          Welcome to the Note App
        </h1>
        <p className="home__welcome-message__subheader">
          Select a note from the left sidebar to view its content.
        </p>
      </div>
      <div className="home__instruction">
        <p>Start writing, organizing, and tracking your notes easily!</p>
      </div>
    </div>
  );
}

export default Home;
