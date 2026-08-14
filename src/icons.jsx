import LogoSvg from "./assets/logo.svg?react";
import UserSvg from "./assets/user-icon.svg?react";
import LogoutSvg from "./assets/logout-icon.svg?react";

export function LogoIcon(props) {
    return <LogoSvg {...props} />;
}

export function UserIcon(props) {
    return <UserSvg {...props} />;
}

export function LogoutIcon(props) {
    return <LogoutSvg {...props} />;
}
