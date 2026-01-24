import { logout } from '../services/userServices'

function Logout({ onLogout }) {
    const handleLogout = async () => {
        //clear the access token upon logout
        await logout();
        onLogout();
    }
}
export default Logout;