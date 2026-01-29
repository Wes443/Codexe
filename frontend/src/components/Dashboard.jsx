import { getAuth } from "../auth/useAuth";

function Dashboard() {
    const [user] = getAuth();

    return(
        <p>welcome {user.username}!</p>
    );
}

export default Dashboard;