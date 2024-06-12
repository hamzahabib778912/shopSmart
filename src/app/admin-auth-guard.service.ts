import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuardService {
  constructor(private auth : AuthService, private router: Router, private userService: UserService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean{
    return this.auth.user$.pipe(
      switchMap(user => {
        if (user) {
          return this.userService.getUser(user.uid).pipe(
            map(dbUser => {
              if (dbUser && dbUser.isAdmin) {
                return true;
              } else {
                this.router.navigate(['/']);
                return false;
              }
            })
          );
        } else {
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return new Observable<boolean>(observer => observer.next(false));
        }
      })
    );
  }
}
