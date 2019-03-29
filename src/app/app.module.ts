import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { ImageMarkupComponent } from './image-markup/image-markup.component';
import { ResizeRectComponent } from './resize-rect/resize-rect.component';


@NgModule({
  declarations: [
    AppComponent,
    ImageMarkupComponent,
    ResizeRectComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
