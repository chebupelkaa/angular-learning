import { Component, effect, inject, ViewChild } from '@angular/core';
import { ProfileHeaderComponent } from "../../common-ui/profile-header/profile-header.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom, last } from 'rxjs';
import { ProfileService } from '../../data/services/profile.service';
import { AvatarUploadComponent } from "./avatar-upload/avatar-upload.component";

@Component({
  selector: 'app-settings-page',
  imports: [ProfileHeaderComponent, ReactiveFormsModule, AvatarUploadComponent],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {

  fb=inject(FormBuilder)
  profileService=inject(ProfileService)

  @ViewChild(AvatarUploadComponent) avatarUploader!:AvatarUploadComponent

  form=this.fb.group({
    firstName:['',Validators.required],
    lastName:['',Validators.required],
    username:[{value:'',disabled:true},Validators.required],
    description:[''],
    stack:['']
  })


  constructor(){
    effect(()=>{
      //@ts-ignore
      this.form.patchValue({
        ...this.profileService.me(),
      //@ts-ignore
      stack:this.mergeStack(this.profileService.me()?.stack)
      })
    })
  }

  ngAfteViewInit(){
    this.avatarUploader.avatar
  }

  onSave(){
    this.form.markAllAsTouched()
    this.form.updateValueAndValidity()

    if(this.form.invalid) return

    if(this.avatarUploader.avatar){
      firstValueFrom(this.profileService.uploadAvatar(this.avatarUploader.avatar))
    }

    console.log(this.avatarUploader)

    //@ts-ignore
    firstValueFrom(this.profileService.patchProfile({
      ...this.form.value,
      stack:this.splitStack(this.form.value.stack)
    }))

  }

  splitStack(stack:string|null|[]|undefined):string[]{
    if(!stack) return []
    if(Array.isArray(stack)) return stack
    return stack.split(',')
  }

  mergeStack(stack:string | null | string[] | undefined){
    if(!stack) return ''
    if(Array.isArray(stack)) return stack.join(',')
    return stack
  }
}