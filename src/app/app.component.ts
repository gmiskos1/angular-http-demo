import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts = [];
  isFetching = false;
  isDeleting = false;
  error = null;
  private errorSub: Subscription;

  constructor(private http: HttpClient, private postsService:PostsService) {}
 
  ngOnInit() {
    this.errorSub = this.postsService.error.subscribe(
      (errorMessage) =>{
        this.error = errorMessage;
      }
    )

    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(posts=>{
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error =>{
      this.isFetching = false;
      this.error = error.message;
    });
  }

  onCreatePost(postData:Post) {
    // Send Http request
    console.log(postData);
    this.postsService.createAndStorePost(postData.title, postData.content);   
    this.postsService.fetch.subscribe(
      (ff:boolean)=>{
        if(ff){
          this.onFetchPosts();
        }
      }
    )
  }

  onFetchPosts() {
    // Send Http request
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(posts=>{
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error =>{
      this.isFetching = false;
      this.error = error.message;
    });
  }

  onClearPosts() {
    // Send Http request
    this.isDeleting = true;
    this.postsService.deletePosts().subscribe(
      () =>{
        this.loadedPosts = [];
        this.isDeleting = false;
      }
    );
  }

  onHandleError(){
    this.error = null;
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }
}
