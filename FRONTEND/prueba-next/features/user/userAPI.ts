export const fetchRegisterUser = async (username:string, password:string) => {
    const response = await fetch("localhost:3001/users/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
});
    if (!response.ok) {
        throw new Error("Failed to register user");
    }
    return response.json();
}

export const fetchLoginUser = async (username:string, password:string) => {
    const response = await fetch("localhost:3001/users/login", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
        throw new Error("Failed to login user");
    }
    return response.json();
}   