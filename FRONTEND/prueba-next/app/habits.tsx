type Habits = {
    name: string;
    description: string;
}

type HabitsProps = {
    habits: Habits[];
}

export default function Habits({habits}: HabitsProps) {
    return (
        <ul>
            {habits.map((habit) => (
                <li key={habit.name}>{habit.description}</li>
            ))}
        </ul>
    )
}
