import { HttpClient } from '@angular/common/http';
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { BehaviorSubject, catchError, filter, switchMap, tap, throwError } from "rxjs";
import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";

let isRefreshing$=new BehaviorSubject<boolean>(false);

export const authTokenInterceptor:HttpInterceptorFn=(req: HttpRequest<any>,next)=>{
    const authService=inject(AuthService)
    const token=authService.token

    if(!token) return next(req)

    if(isRefreshing$.value){
        return refreshAndProceed(authService,req,next)
    }

    return next(addToken(req,token))
    .pipe(
        catchError((error)=>{
            if(error.status===403){
                return refreshAndProceed(authService,req,next)
            }
            return throwError(()=>error)
        })
    )
}

const refreshAndProceed=(
    authService:AuthService,
    req:HttpRequest<any>,   
    next:HttpHandlerFn
)=>{
    if(!isRefreshing$.value){
        isRefreshing$.next(true)
        return authService.refreshAuthToken()
        .pipe(
            switchMap((res:any)=>{
                isRefreshing$.next(false)
                return next(addToken(req,res.access_token))
                .pipe(
                    tap(()=>isRefreshing$.next(false))
                )
            })
        )
    }
    //return next(addToken(req,authService.token!))
    if (req.url.includes('refresh')) return next(addToken(req,authService.token!))

    return isRefreshing$.pipe(
        filter(isRefreshing=>!isRefreshing),
        switchMap(res=>{
            return next(addToken(req,authService.token!))
        })
    )
}


const addToken=(req:HttpRequest<unknown>,token:string)=>{
    return req.clone({
        setHeaders:{    
            Authorization:`Bearer ${token}`
        }
    })
}