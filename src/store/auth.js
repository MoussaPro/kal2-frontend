import { defineStore } from 'pinia';
import router from "@/router";

export const Auth = defineStore('auth', {
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    user: JSON.parse(localStorage.getItem('user')),
    token: localStorage.getItem('token'),
    returnUrl: null
  }),
  actions: {
    login(token, user) {
      window.localStorage.setItem('token', token);
      window.localStorage.setItem('user', JSON.stringify(user));
      this.token = token;
      this.user = user;
    },
    logout() {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('user');
      this.user = null;
      this.token = null;
      router.push('/login');
    },
    check() {
      return !!this.token;
    }
  }
});