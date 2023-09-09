import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { HttpHelperService } from './http-helper.service';
import { Login } from '../modals/user';

import { Role } from '../modals/role';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpHelper: HttpHelperService, private router: Router) { }

  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    const user = localStorage.getItem('user');

    if (token && user) {
      return true;
    } else {
      return false;
    }
  }
  isUserSubcribed(): boolean {
    const user = localStorage.getItem('user');
    if (user) {

      const userData = JSON.parse(user);
      return userData.isSubscribed;
    }
    return false;
  }

  authenticateUser(data: any): void {
    // this.setAuthToken(data);
    this.setAuthUser(data);
  }

  login(data: Login): Observable<any> {
    return this.httpHelper.request('/Account/SignIn', {
      body: data,
      method: 'POST',
    });
  }

  register(data: any): Observable<any> {
    return this.httpHelper.request('/Account/SignUp', { body: data, method: 'POST' });
  }

  forgotPassword(data: any): Observable<any> {
    return this.httpHelper.request('/Account/ForgetPassword', {
      body: data,
      method: 'POST',
    });
  }
  resetPassword(data: any): Observable<any> {
    return this.httpHelper.request('/Account/SetPassword', {
      body: data,
      method: 'POST',
    });
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }

  getAuthToken() {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.token?.accessToken;
    }
    return null;
  }


  setAuthUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    return true;
  }

  getUser() {
    let user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
  }

  getRole(): Role {
    let user = localStorage.getItem('user');
    if (user) {
      let userData = JSON.parse(user);
      return userData.roleId as Role;
    }
    return Role.user;
  }

  // login(data: Login): Observable<any> {
  //   return this.httpHelper.request('/auth/login', {
  //     headers: { TOKEN: this.getAuthToken() },
  //     body: data,
  //     method: 'POST',
  //   });
  // }
}
