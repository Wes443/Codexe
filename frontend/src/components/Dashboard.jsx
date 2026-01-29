import { useAuth } from "../auth/useAuth";

function Dashboard() {
    const [user] = useAuth();

    return(
        <p>welcome {user.username}!</p>
    );
}

export default Dashboard;