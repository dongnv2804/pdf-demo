import "./App.css";

const App = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);
    let data = new FormData(e.target);
    for (const item of data.values()) {
      console.log(item);
    }
  };
  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input name="id" />
        <input name="age" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default App;
