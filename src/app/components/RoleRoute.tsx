import { Navigate } from "react-router";

interface RoleRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

export function RoleRoute({
    children,
    allowedRoles
}: RoleRouteProps) {

    const role =
        localStorage.getItem("role");

    if (
        !role ||
        !allowedRoles.includes(role)
    ) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    return <>{children}</>;
}