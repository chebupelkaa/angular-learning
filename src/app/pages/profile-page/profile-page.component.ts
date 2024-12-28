import { Component, inject, Input } from '@angular/core';
import { ProfileHeaderComponent } from "../../common-ui/profile-header/profile-header.component";
import { ImgUrlPipe } from '../../helpers/pipes/img-url.pipe';
import { ProfileService } from '../../data/services/profile.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { SvgIconComponent } from '../../common-ui/svg-icon/svg-icon.component';
import { PostFeedComponent } from "./post-feed/post-feed.component";

@Component({
  selector: 'app-profile-page',
  imports: [ProfileHeaderComponent, RouterLink, ImgUrlPipe, AsyncPipe, SvgIconComponent, PostFeedComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {

  profileService=inject(ProfileService)
  route=inject(ActivatedRoute)

  me$=toObservable(this.profileService.me)

  subscribers$=this.profileService.getSubscribersShortList(5)
  
  profiles$=this.route.params
  .pipe(
    switchMap(({id})=>{
      if(id==="me") return this.me$

      return this.profileService.getAccount(id)  
    })
  )
}
