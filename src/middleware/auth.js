import { Auth } from "@/store/auth";

export default (to, from, next) => {
  const auth = Auth();

  if (!auth.check()) {
    return next({ name: 'login' });
  }
}