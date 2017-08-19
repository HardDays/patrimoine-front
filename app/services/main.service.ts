import { Injectable } from "@angular/core";
import { Http, URLSearchParams } from '@angular/http';
import {AdsModel} from "./../models/ads.model";
import {AllUsersModel} from "./../models/allusers.model";
import {NewsModel} from "./../models/news.model";
import {AllNewsModel} from "./../models/allnews.model";
import {RegisterUserModel} from "./../models/register.user.model";
import {RegisterCompanyModel} from "./../models/register.company.model";
import { HttpService } from "./http.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/Rx';
import {Subject} from 'rxjs/Subject';
import { GetParamsModel } from '../models/getparams.model';
import { UserModel } from '../models/user.model';
import { CheckboxModel } from '../models/checkbox.model';
import { TokenModel } from '../models/token.model';

    @Injectable()
    export class MainService{

        public onAuthChange$: Subject<boolean>;
        constructor(
            public httpService : HttpService,
            private router: Router
        ){
            this.onAuthChange$ = new Subject();
            this.onAuthChange$.next(false);
        }
        public me: UserModel;

        ParamsToUrlSearchParams(params:any):string{
            let options = new URLSearchParams();

            for(let key in params){
                let prop:any = params[key];
                if(prop){
                    if( prop instanceof Array){
                        for(let i in prop){
                            options.append(key+"[]",prop[i]);
                        }
                    }
                    else
                        options.set(key,params[key]);
                }
            }
            return options.toString();
        }

        GetCheckedCheckboxes(input:CheckboxModel[]): string[]
        {
            let result: string[]= [];
            let checked:CheckboxModel[]=input.filter(x=>x.checked);
            for(let i of checked)
                result.push(i.value);
            return result;
        }
        GetCheckboxesFromChecked(input:string[],output:CheckboxModel[]):CheckboxModel[]
        {
            for(let i of input){
                output.find(x=> x.value == i).checked = true;
            }
            return output;
        }

        GetCheckboxNamesFromCheckboxModel(input:string[],cb:CheckboxModel[]){
            let result:string[]= [];
            for(let i of input){
                let res = cb.find(x=> x.value == i);
                if(res && res.name)
                    result.push(res.name);
            }
            return result;
        }

        GetAllAds(params : any){
            return this.httpService.GetData('/ads/all',this.ParamsToUrlSearchParams(params));
        }


        GetAdsById(id:number){
            /*return AdsPromise
                .then(Ads => Ads.find(x => x.id == id));*/
            return this.httpService.GetData('/ads/info/'+id,"");
        }

        CreateAd(title:string, desc:string){
            let params = {title:title,description:desc};
                
            /*return AdsPromise
                .then(Ads => Ads.push(new AdsModel(id+1,title,desc,"",this.me.id,1,1,null,null,"fintech",[""],[""])));*/
            return this.httpService.PostData('/ads/create',JSON.stringify(params));
        }

        DeleteAd(ad:AdsModel){
            return this.httpService.DeleteData('/ads/delete/'+ad.id);
        }

        UpdateAd(id:number,title:string,desc:string){
            let ad = {title:title,description:desc};
            let params = new URLSearchParams();
            params.set('ad',JSON.stringify(ad));
            return this.httpService.PutData('/ads/update/' + id,JSON.stringify(params))
                .map((resp:Response)=>resp.json())
                .catch((error:any) =>{return Observable.throw(error);});
        }



        GetAllUsers(params:any)
        {
            return this.httpService.GetData('/users/all',this.ParamsToUrlSearchParams(params));
        }

        GetUserById(id:number){
            return this.httpService.GetData('/users/info/'+id,"");
        }

        GetMe(){
            return this.httpService.GetData('/users/my_info',"");
        }
        RateUser(user:number,rate:number){
            return this.httpService.PostData("/users/rate",JSON.stringify({user_id:user,rate:rate}));
        }
        UnrateUser(user:number)
        {
            return this.httpService.PostData("/users/unrate",JSON.stringify({user_id:user}));
        }

        GetMyRates(){
            return this.httpService.GetData("/users/get_my_rates",null);
        }
        LikeUser(user:number)
        {
            return this.httpService.PostData("/users/like",JSON.stringify({user_id:user}));
        }
        UnlikeUser(user:number)
        {
            return this.httpService.PostData("/users/unlike",JSON.stringify({user_id:user}));
        }
        GetMyLikes(){
            return this.httpService.GetData("/users/get_my_likes",null);
        }

        CreateUser(user:RegisterUserModel){
            let params = {
                user: user,
                expertises: ["placement"],
                agrements: ["CJA"]
            };
            return this.httpService.PostData('/users/create',JSON.stringify(params));
        }

        CreateUserCompany(user:RegisterUserModel, company:RegisterCompanyModel, expertises:string[], agrements:string[]){
            let params = {
                user: user,
                company: company,
                expertises: expertises,
                agrements: agrements
            };
            return this.httpService.PostData('/users/create',JSON.stringify(params));
        }


        UpdateUser(user:UserModel){
            return this.httpService.PutData('/users/update',JSON.stringify(user));
        }

        UserLogin(email:string, password:string){
            let params = {
                email: email,
                password: password
            };
    
            return this.httpService.PostData('/auth/login',JSON.stringify(params));
        }

        BaseInitAfterLogin(data:TokenModel){
            this.httpService.BaseInitByToken(data.token);
            this.GetMe()
            .subscribe((user:UserModel)=>{
                    this.me = user;
                    this.onAuthChange$.next(true);
                });
        }

        TryToLoginWithToken()
        {
            let token = localStorage.getItem('token');
            if(token)
            {
                this.BaseInitAfterLogin(new TokenModel(token));
            }

        }

        Logout(){
            
            this.httpService.token = null;
            this.httpService.headers.delete('Authorization');
            this.onAuthChange$.next(false);
            localStorage.removeItem('token');
            return this.httpService.PostData("/auth/logout",null);
            
        }

        GetAllNews(params : any){
            return this.httpService.GetData('/news/all',this.ParamsToUrlSearchParams(params));
        }

        GetNewsById(id:number){
            return this.httpService.GetData('/news/info/'+id,"");
        }

        CreateNews(title:string, descr:string){
            let params = {title:title,description:descr};
                
            /*return AdsPromise
                .then(Ads => Ads.push(new AdsModel(id+1,title,desc,"",this.me.id,1,1,null,null,"fintech",[""],[""])));*/
            return this.httpService.PostData('/news/create',JSON.stringify(params));
        }

        UpdateNews(id:number, title:string, descr:string){
            let params = {ad:{title:title,description:descr}};
            return this.httpService.PutData('/news/update/'+id,JSON.stringify(params));
        }

        DeleteNews(id:number){
            return this.httpService.DeleteData('/news/delete/'+id);
        }

        GetImageById(id:number){
            return this.httpService.GetData('/images/info/'+id,"");
        }
    }
