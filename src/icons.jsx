import LogoSvg from "./assets/logo.svg?react";
import UserSvg from "./assets/user-icon.svg?react";
import LogoutSvg from "./assets/logout-icon.svg?react";
import LinesSvg from "./assets/lines-icon.svg?react";
import CodeSvg from "./assets/code-icon.svg?react";
import ZenSvg from "./assets/zen-icon.svg?react";
import CursorSvg from "./assets/cursor-icon.svg?react";
import ClockSvg from "./assets/clock-icon.svg?react";

export function LogoIcon(props) {
    return <LogoSvg {...props} />;
}

export function UserIcon(props) {
    return <UserSvg {...props} />;
}

export function LogoutIcon(props) {
    return <LogoutSvg {...props} />;
}

export function LinesIcon(props) {
    return <LinesSvg {...props} />;
}

export function CodeIcon(props) {
    return <CodeSvg {...props} />;
}

export function ZenIcon(props) {
    return <ZenSvg {...props} />;
}

export function CursorIcon(props) {
    return <CursorSvg {...props} />
}

export function ClockIcon(props) {
    return <ClockSvg {...props} />
}
