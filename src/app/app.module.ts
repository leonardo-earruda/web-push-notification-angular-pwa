import { NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SwPush, SwUpdate } from '@angular/service-worker';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule implements OnInit {
  VAPID_PUBLIC_KEY =
    'BKgc1qt8nvxIJFkr0no6ovjrl7orZ3PA8IaVbQx0h2taLlDVmIauXqOH8X97bASc5HYWWHR0cOOa3bb2u7o9DQU';

  constructor(private pushSw: SwPush, private update: SwUpdate) {
    this.SubscribeToPush();
    pushSw.messages.subscribe((msg) => {
      console.log(JSON.stringify(msg));
    });
  }

  ngOnInit() {
    this.SubscribeToPush();
  }

  SubscribeToPush() {
    this.pushSw
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      })
      .then((pushSubscription) => {
        console.log(JSON.stringify(pushSubscription));
      })

      .catch((err) => {
        console.error('Ocorreu um erro:' + err);
      });
  }
}
