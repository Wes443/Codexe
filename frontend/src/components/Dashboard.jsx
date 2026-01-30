import { AuthModule } from "../auth/AuthModule";

function Dashboard() {

    const user = AuthModule.getUser();
    
    return(
        <>
            <p>welcome {user.username}!</p>
        </>

    );
}

export default Dashboard;