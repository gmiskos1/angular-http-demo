import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { catchError, map, tap } from 'rxjs/operators';
import { BehaviorSubject, Subject, throwError } from "rxjs";


@Injectable({providedIn:'root'})
export class PostsService{
      error = new Subject<string>();
      postsChanged = new Subject<Post[]>();
      fetch = new BehaviorSubject<boolean>(false);

      constructor(private http:HttpClient){}

      createAndStorePost(title:string, content:string){
            const postData: Post = {title:title, content:content};
            this.http.post<{name:string, content:string}>(
                  'https://angular-ng-demo-default-rtdb.europe-west1.firebasedatabase.app/posts.json', 
                  postData,
                  {
                        //observe: 'body'//means response data
                        observe:'response'
                  }
                ).subscribe(responseData => {
                  console.log(responseData.body);
                  this.fetch.next(true);
                }, error =>{
                    this.error.next(error.message);  
                });
      }

      fetchPosts(){
            let searchParams = new HttpParams();
            searchParams = searchParams.append('print', 'pretty');
            searchParams = searchParams.append('custom', 'key');
            return  this.http.get<{[s:string]:Post}>('https://angular-ng-demo-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
            {
                  headers: new HttpHeaders({
                        'Custom-Header':'Hello'
                  }),
                  params: searchParams
            })
                .pipe(map( responseData =>{
                        const postsArray : Post[] = [];
                        for(const key in responseData){
                          if(responseData.hasOwnProperty(key)){
                            postsArray.push({ ...responseData[key], id:key});
                          }
                        }
                        return postsArray;
                      }),
                      catchError(errorRes =>{
                            return throwError(errorRes);
                      })
                );
      }

      deletePosts(){
            return this.http.delete('https://angular-ng-demo-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
            {
                  observe:'events',
                  responseType: 'text'
            }).pipe(tap(
                  event=>{
                       console.log(event); 
                       if(event.type === HttpEventType.Sent){
                              //..
                        }
                       if(event.type === HttpEventType.Response){
                             console.log(event.body);
                       }
                  }
            ));
      }
}