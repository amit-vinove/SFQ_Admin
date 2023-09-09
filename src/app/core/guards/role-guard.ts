import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    CanDeactivate,
    CanLoad,
    Route,
    Router,
    RouterStateSnapshot,
    UrlSegment,
    UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from '../modals/role';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from './auth-guard';

@Injectable({
    providedIn: 'root',
})
export class RoleGuard implements CanActivate {
    constructor(private _authService: AuthService, private router: Router) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        let url: string = state.url;

        return this.checkUserLogin(next, url);
    }
    checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {

        if (this._authService.isAuthenticated()) {
            const userRole: Role = this._authService.getRole();
            if (route.data['role'] && route.data['role'].indexOf(userRole) === -1) {
                this.router.navigate(['/']);
                return false;
            }
            return true;
        }

        this.router.navigate(['/']);
        return false;
    }
}
