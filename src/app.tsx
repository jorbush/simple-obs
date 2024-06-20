import Recorder from "./components/Recorder";
import Footer from "./components/Footer";
import "./index.css";
import Header from "./components/Header";

const App = () => (
  <div className="flex max-h-screen flex-col items-center justify-between bg-black font-hacker text-white">
    <Header />
    <div className="flex h-screen flex-col items-center justify-center">
      <Recorder />
    </div>
    <Footer />
  </div>
);

export default App;
