import Countdown from 'react-countdown';
import './index.css';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox"

const Completionist = () => <span>You are good to go!</span>;

const padZero = (digit: number) => { return digit.toString().padStart(2, '0') };

const renderer = ({ hours, minutes, seconds, completed }: { hours: number; minutes: number; seconds: number; completed: boolean}) => {
  if (completed) {
    // Render a completed state
    return <Completionist />;
  } else {
    // Render a countdown
    return <div>
      <h1 className="text-white text-9xl tracking-widest font-medium font-mono">{padZero(hours)}:{padZero(minutes)}:{padZero(seconds)}</h1>
    </div>
  }
};

type DaysOfWeekThing = { label: string; isSelected: boolean }[];

const daysOfWeekThing = [
  { label: 'M', isSelected: false },
  { label: 'T', isSelected: false },
  { label: 'W', isSelected: false },
  { label: 'T', isSelected: false },
  { label: 'F', isSelected: false },
  { label: 'S', isSelected: false },
  { label: 'S', isSelected: false },
] as DaysOfWeekThing;

function AddCountdownDialog({ addDialog }: { addDialog: (body: TimerBody) => void }) {
  const [repeat, setRepeat] = useState<boolean>(false);
  const [countdownName, setCountdownName] = useState<string>('');
  const [countdownTime, setCountdownTime] = useState<string>('');
  const [daysOfWeek, setDaysOfWeek] = useState<DaysOfWeekThing>(daysOfWeekThing);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        <Button variant="outline">Add Countdown</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add Countdown</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={countdownName}
              onChange={(e) => setCountdownName(e.currentTarget.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Time
            </Label>
            <Input
              id="username"
              value={countdownTime}
              onChange={(e) => setCountdownTime(e.currentTarget.value)}
              className="col-span-3"
              type="time"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Repeat
            </Label>
            <Checkbox id="terms1" onCheckedChange={() => {setRepeat(!repeat)}} checked={repeat} className="" />
          </div>
          {
            repeat 
              ?           
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Days
                  </Label>
                  <div className="flex flex-row">
                    {
                      daysOfWeek.map((day, idx) => (
                        <div 
                          className={`mx-1 ${day.isSelected ? 'border-b-4' : null} border-white h-8 w-max flex justify-center items-center p-2`} 
                          onClick={() => {
                            const copy = [...daysOfWeek];
                            copy[idx].isSelected = !copy[idx].isSelected;
                            setDaysOfWeek(copy);
                          }}>
                          <p className="text-white">
                            {day.label}
                          </p>
                        </div>
                      ))
                    }
                  </div>
                </div>
                : null
          }
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => {
            const body = {
              name: countdownName,
              time: countdownTime,
              repeat: repeat
            } as TimerBody;

            if (repeat) {
              body.repeatDays = daysOfWeek.map(day => day.isSelected);
            }

            addDialog(body);
            setOpen(false);
            }}>Add Countdown</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  )
}

interface TimerBody {
  name: string;
  repeatDays?: boolean[];
  time: string;
  repeat: boolean;
}

function sortTimers(a: TimerBody, b: TimerBody) {
  const aParts = a.time.split(':');
  const bParts = b.time.split(':');

  const aHours = parseInt(aParts[0]);

  const bHours = parseInt(bParts[0]);

  if (aHours < bHours) {
    return -1;
  } else if (aHours > bHours) {
    return 1;
  } else {
    const aMinutes = parseInt(aParts[1]);
    const bMinutes = parseInt(bParts[1]);

    if (aMinutes < bMinutes) {
      return -1;
    } else if (aMinutes > bMinutes) {
      return 1;
    }
  }

  return -1
}

function App() {
  const [timers, setTimers] = useState<TimerBody[]>([]);

  const fetchExistingTimers = () => {
    const existingDataFromStorage = localStorage.getItem('timer');
    let timers = [] as TimerBody[];
    if (existingDataFromStorage) {
      timers = JSON.parse(existingDataFromStorage);
    }

    timers.sort(sortTimers);
    return timers;
  }

  useEffect(() => {
    const timers = fetchExistingTimers();
    setTimers(timers);
  }, [])

  const addDialog = (body: TimerBody) => {
    const toAdd = fetchExistingTimers();
    toAdd.sort(sortTimers)
    toAdd.push(body);
    localStorage.setItem('timer', JSON.stringify(toAdd));
    setTimers(toAdd);
  }

  return (
    <div className="min-h-screen min-w-screen bg-slate-900 justify-center items-center flex flex-col gap-16" >
      <div>
        <h1 className="scroll-m-20 text-9xl font-extrabold tracking-tight text-white">
          Countdown
        </h1>
      </div>
      <Countdown 
        date={Date.now() + 10000}
        renderer={renderer}
      />
      <AddCountdownDialog addDialog={addDialog} />
      {localStorage.getItem('timer')}

      <Button onClick={() => localStorage.removeItem('timer')}>Clear</Button>
    </div>
  )
}

export default App
