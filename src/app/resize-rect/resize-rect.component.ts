import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

export interface BBox {
  x: number;
  y: number;
  w: number;
  h: number;
  sx: number;
  sy: number;
}

export interface BBoxConfig {
  color: string;
  widthLine: number;
}

@Component({
  selector: 'app-resize-rect',
  templateUrl: './resize-rect.component.html',
  styleUrls: ['./resize-rect.component.css']
})
export class ResizeRectComponent implements OnInit {

  @Input() rect: BBox;
  @Input() config: BBoxConfig;
  @Input() active: boolean;

  @ViewChild('ulcorner') private ulCorner: ElementRef;
  @ViewChild('brcorner') private brCorner: ElementRef;
  private cornerWH = 10;

  constructor(private doms: DomSanitizer) {
  }

  getStyleMain() {
    const realX = this.rect.x * this.rect.sx;
    const realY = this.rect.y * this.rect.sy;
    const realW = this.rect.w * this.rect.sx;
    const realH = this.rect.h * this.rect.sy;
    const strStyle = `width:${realW}px;height:${realH}px;left:${realX}px;top:${realY}px;
    border-width:${this.config.widthLine}px!important;border-color: ${this.config.color}!important;z-index:10`;
    const halfWH = this.cornerWH / 2;

    this.ulCorner.nativeElement.style.width = `${this.cornerWH}px`;
    this.ulCorner.nativeElement.style.height = `${this.cornerWH}px`;
    this.ulCorner.nativeElement.style.left = `${realX - halfWH + this.config.widthLine}px`;
    this.ulCorner.nativeElement.style.top = `${realY - halfWH + this.config.widthLine}px`;
    this.ulCorner.nativeElement.style.backgroundColor = 'gray';
    this.ulCorner.nativeElement.style.zIndex = '11';

    this.brCorner.nativeElement.style.width = `${this.cornerWH}px`;
    this.brCorner.nativeElement.style.height = `${this.cornerWH}px`;
    this.brCorner.nativeElement.style.left = `${(realX + realW) - halfWH - this.config.widthLine}px`;
    this.brCorner.nativeElement.style.top = `${(realY + realH) - halfWH - this.config.widthLine}px`;
    this.brCorner.nativeElement.style.backgroundColor = 'gray';
    this.brCorner.nativeElement.style.zIndex = '11';
    return this.doms.bypassSecurityTrustStyle(strStyle);
  }

  getSomeInfo() {
    console.log('click-click');
  }

  beginResize(event: MouseEvent) {
    console.log(event.target);
    console.log(event.currentTarget);
    console.log(event.relatedTarget);
    console.log(event);
  }

  endResize(event: MouseEvent) {
  }

  ngOnInit() {
  }

}
