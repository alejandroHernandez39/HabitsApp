import { useSelector, useDispatch } from "react-redux";
import {markHabitDoneThunk} from "@/features/habit/habitSlice";
import { AppState, AppDispatch } from "@/Redux/store";
import { fetchHabitsThunk } from "@/features/habit/habitSlice";

type Habits = {
    _id: string;
    title: string;
    description: string;
    createdAt: Date;
    lastUpdated: Date;
    lastDone: Date;
    days: number;
    startedAt: Date;
}

type HabitsProps = {
    habits: Habits[];
}

const handleMarkHabitDone = (habitId: string, dispatch: AppDispatch) => {
    dispatch(markHabitDoneThunk(habitId));
    dispatch(fetchHabitsThunk());
}

export default function Habits({habits}: HabitsProps) {
    const dispatch = useDispatch<AppDispatch>();
    const status = useSelector((state: AppState) => state.habit.status);
    const error = useSelector((state: AppState) => state.habit.error);

    const calculateProgress = (days:number) => {
        return Math.min(100, Math.floor((days / 66) * 100));
    }

    return (
        <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md mt-8">

            <h1 className="text-2xl font-bold mb-4 text-black">Habits</h1>

            <ul className="space-y-4">

            {habits.map((habit:Habits) => (

                    <li className="flex items-center justify-between" key={habit._id}>

                        <span className="text-black">{habit.title}</span>

                        <div className="flex items-center space-x-2">

                        

                        </div>
                        <progress className="w-24" value={calculateProgress(habit.days)} max="100"></progress>

                            <button className="px-2 py-1 text-sm text-white bg-blue-500 rounded" onClick={() => handleMarkHabitDone(habit._id, dispatch)}>{status[habit._id] === "loading" ? "Procesing":"Mark as done"}</button>
                            {status[habit._id] === "failed" && <span className="text-red-500 text-sm">{error[habit._id]}</span>}
                            {status[habit._id] === "succeeded" && <span className="text-green-500 text-sm">Habit marked as done</span>}

                    </li>

                ))}

            </ul>

        </div>
    )
}
