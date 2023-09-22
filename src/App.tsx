import Countdown from 'react-countdown';
import './index.css';

const Completionist = () => <span>You are good to go!</span>;

const padZero = (digit: number) => { return digit.toString().padStart(2, '0') };

const renderer = ({ hours, minutes, seconds, completed }: { hours: number; minutes: number; seconds: number; completed: boolean}) => {
  if (completed) {
    // Render a completed state
    return <Completionist />;
  } else {
    // Render a countdown
    return <div>
      <span className="text-white text-9xl tracking-widest font-medium font-mono">{padZero(hours)}:{padZero(minutes)}:{padZero(seconds)}</span>
    </div>
  }
};

function App() {
  return (
    <div className="min-h-screen min-w-screen bg-slate-900 justify-center items-center flex flex-col gap-16" >
      <div><p className="text-white text-7xl">Countdown</p></div>
      <Countdown 
        date={Date.now() + 10000}
        renderer={renderer}
      />
    </div>
  )
}

export default App
