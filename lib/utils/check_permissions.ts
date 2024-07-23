import { User, UserRole } from "../../backend/types"

const CheckPermissions = (auth: User, permissions: Array<UserRole>): boolean => {
  if(!auth) return false
  if(permissions.includes(auth.role)) return true
  return false
}

const CheckFinished= (auth: User, permissions: Array<UserRole>, state: string, spected: string) => CheckPermissions(auth, permissions) && state === spected

export { CheckPermissions , CheckFinished }