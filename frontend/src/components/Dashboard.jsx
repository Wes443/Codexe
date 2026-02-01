import { AuthModule } from "../auth/AuthModule";

function Dashboard() {
    //get the user from module
    const user = AuthModule.getUser();
    
    return(
        <>
            <p>welcome {user.username}!</p>
        </>

    );
}

export default Dashboard;