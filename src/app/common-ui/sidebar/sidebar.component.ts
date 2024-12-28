import { Component, inject } from '@angular/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { AsyncPipe, NgForOf,JsonPipe } from '@angular/common';
import { SubscriberCardComponent } from "../subscriber-card/subscriber-card.component";
import { ImgUrlPipe } from '../../helpers/pipes/img-url.pipe';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProfileService } from '../../data/services/profile.service';
import { Profile } from '../../data/interfaces/profile.interface';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-sidebar',
  imports: [SvgIconComponent, JsonPipe,NgForOf, SubscriberCardComponent,ImgUrlPipe,RouterLink,AsyncPipe,RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  profileService=inject(ProfileService)

  subscribers$=this.profileService.getSubscribersShortList()

  me=this.profileService.me

  menuItems=[
    {
      label:'Моя страница',
      icon:'home',
      link:'profile/me'
    },
    {
      label:'Чаты',
      icon:'chat',
      link:'chats'
    },
    {
      label:'Поиск',
      icon:'search',
      link:'search'
    }
  ]

  ngOnInit(){
    firstValueFrom(this.profileService.getMe())
  }
}
