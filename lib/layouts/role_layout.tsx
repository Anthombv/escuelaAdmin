import { useAuth } from "../hooks/use_auth";
import { UserRole } from "../../backend/types";
import { CheckPermissions } from "../utils/check_permissions";

type Props = {
  permissions: Array<UserRole>;
  children: React.ReactNode;
};

const RoleLayout = (props: Props) => {
  const { auth } = useAuth();
  if (CheckPermissions(auth, props.permissions)) return <>{props.children}</>;
  return <div>No tiene permiso para entrar a esta Página</div>;
};

export default RoleLayout;
