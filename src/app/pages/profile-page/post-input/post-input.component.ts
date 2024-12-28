import { Component, inject, input } from '@angular/core';

import { ProfileService } from '../../../data/services/profile.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';
import { Profile } from '../../../data/interfaces/profile.interface';
import { ImgUrlPipe } from '../../../helpers/pipes/img-url.pipe';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-post-input',
  imports: [AsyncPipe,ReactiveFormsModule,SvgIconComponent,ImgUrlPipe],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss'
})
export class PostInputComponent {
   
    fb=inject(FormBuilder);
    profileService=inject(ProfileService)
    route=inject(ActivatedRoute)
    me$=toObservable(this.profileService.me)
     
    profiles$=this.route.params
      .pipe(
        switchMap(({id})=>{
          if(id==="me") return this.me$
    
          return this.profileService.getAccount(id)  
        })
      )


    inputForm=this.fb.group({
      text:['']
    })


}
