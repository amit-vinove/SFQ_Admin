import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanDeactivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
  ) { }

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.authService.logout();
      return false;
    } else {
      return true;
    }
  }

  canDeactivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      return false;
    }
    return true;
  }

  canActivateChild(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.authService.logout();
      return false;
    } else {
      return true;
    }
  }
}
