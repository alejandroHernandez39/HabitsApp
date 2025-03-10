"use client";
import Habits from "./habits";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchHabitsThunk } from "@/features/habit/habitSlice";
import { AppDispatch, AppState } from "../Redux/store";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const habits = useSelector((state: AppState) => state.habit.habits);
  useEffect(() => {
    dispatch(fetchHabitsThunk());
  }, [dispatch]);
  return (
    <div>
      <h1>Home</h1>
      <Habits habits={habits}/>
    </div>
  );
}
