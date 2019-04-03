import {AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BBox, BBoxConfig} from '../resize-rect/resize-rect.component';

enum WorkState {
  create = 'create',
  select = 'select',
  move = 'move',
  resize = 'resize'
}

interface AimProperties {
  aimVisible: boolean;
  aimEnable: boolean;
}

@Component({
  selector: 'app-image-markup',
  templateUrl: './image-markup.component.html',
  styleUrls: ['./image-markup.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageMarkupComponent implements OnInit, AfterViewChecked {
  color: string = null;
  clX = 0;
  clY = 0;
  scale = 1.0;
  isZoomRect = false;
  isAction = false;
  isOut = false;
  mHeightForRefresh = 'none';
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('img') img: ElementRef;
  @ViewChild('aimhor') aimhor: ElementRef;
  @ViewChild('aimvert') aimvert: ElementRef;

  private workState: WorkState;
  lastRect: BBox;
  tempRect: BBox;
  initImgRect: BBox;
  tempConf: BBoxConfig;

  aimProps: AimProperties = {aimEnable: false, aimVisible: false};

  constructor(private cdRef: ChangeDetectorRef) {
  }

  getInfo(elem: ElementRef | BBox, name?: string): string {
    const rect = elem instanceof ElementRef ? elem.nativeElement.getBoundingClientRect() : elem;
    const strArr = [];
    if (!name) {
      name = 'elem';
    }
    strArr.push(name.concat(': '));
    for (const key in rect) {
      if (key !== 'toJSON') {
        strArr.push(`key: ${key} val: ${rect[key]}`);
      }
    }
    return strArr.join(' | ');
  }

  outInfo() {
    console.log(`offL: ${this.canvas.nativeElement.offsetLeft}  offT: ${this.canvas.nativeElement.offsetTop}`);
    console.log(`offW: ${this.canvas.nativeElement.offsetWidth}  offH: ${this.canvas.nativeElement.offsetHeight}`);
    console.log(this.getInfo(this.canvas, 'canvas'));
    console.log(this.getInfo(this.img, 'img'));
    console.log(this.getInfo(this.initImgRect, 'imgRect'));
  }

  onScroll(event) {
    // console.log(event.srcElement);
  }

  zoomIn() {
    if (this.scale < 3.0) {
      this.scale += 0.2;
      this.refreshCanvas();
      this.isZoomRect = true;
    }
  }

  zoomOut() {
    if (this.scale > 1.0) {
      this.scale -= 0.2;
      this.refreshCanvas();
      this.isZoomRect = true;
    }
  }

  getState() {

  }

  zoomAim() {
    if (this.aimProps.aimEnable) {
      this.aimvert.nativeElement.style.height = (100 * this.scale) + '%';
      this.aimhor.nativeElement.style.width = (100 * this.scale) + '%';
    }
  }

  zoomRect() {
    const realScale = this.getRealScale();
    this.tempRect.sx = realScale.sx;
    this.tempRect.sy = realScale.sy;
    console.log(this.getInfo(this.img, 'img'));
    console.log(this.getInfo(this.tempRect, 'rect'));
  }

  refreshCanvas() {
    if (this.mHeightForRefresh === 'none') {
      this.mHeightForRefresh = '100%';
    } else {
      this.mHeightForRefresh = 'none';
    }
  }

  setAimVisible(visible: boolean) {
    if (this.aimProps.aimEnable) {
      this.aimProps.aimVisible = visible;
    }
  }

  onClickDown(event: MouseEvent) {
    // TODO: необходимо релизовать обработку выбора rect'ов и обработку кликов по рабочим div'ам
    const elem = event.target as HTMLElement;
    console.log(`target: ${elem}  id: ${elem.id}`);

    this.lastRect = this.tempRect;
    this.clX = event.x;
    this.clY = event.y;
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const realX = (event.x - Math.floor(Number(rect.x))) + this.canvas.nativeElement.scrollLeft;
    const realY = (event.y - Math.floor(Number(rect.y))) + this.canvas.nativeElement.scrollTop;
    this.tempRect = {x: realX / this.tempRect.sx, y: realY / this.tempRect.sy, w: 0, h: 0, sx: this.tempRect.sx, sy: this.tempRect.sy};
    this.isAction = true;
    return false;
  }

  onEvent(event: MouseEvent) {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    if (this.isAction) {
      this.clX = event.x;
      this.clY = event.y;
      const realX = (event.x - Math.floor(Number(rect.x)) + this.canvas.nativeElement.scrollLeft) / this.tempRect.sx;
      const realY = (event.y - Math.floor(Number(rect.y)) + this.canvas.nativeElement.scrollTop) / this.tempRect.sy;
      const w = realX - this.tempRect.x;
      const h = realY - this.tempRect.y;
      this.tempRect.w = w >= 0 ? w : 0;
      this.tempRect.h = h >= 0 ? h : 0;
    }
    if (this.aimProps.aimEnable) {
      this.aimvert.nativeElement.style.left = ((event.x - Math.floor(Number(rect.x)) + this.canvas.nativeElement.scrollLeft)) + 'px';
      this.aimhor.nativeElement.style.top = ((event.y - Math.floor(Number(rect.y)) + this.canvas.nativeElement.scrollTop)) + 'px';
      this.zoomAim();
    }
  }

  onClickUp() {
    if (Math.abs(this.tempRect.w) < 3 || Math.abs(this.tempRect.h) < 3) {
      this.tempRect = this.lastRect;
    }
    this.isAction = false;
  }

  onEnter() {
    this.isOut = false;
    this.setAimVisible(true);
    this.zoomAim();
  }

  onOut() {
    this.setAimVisible(false);
    this.onClickUp();
  }

  getColor(value: string) {
    this.color = value;
  }

  private getBBox(boundingClientRect): BBox {
    return {x: boundingClientRect.x, y: boundingClientRect.y, w: boundingClientRect.width, h: boundingClientRect.height, sx: 1.0, sy: 1.0};
  }

  private getRealScale() {
    console.log(`rectW: ${this.img.nativeElement.getBoundingClientRect().width} / initRectW: ${this.initImgRect.w}
     = ${this.img.nativeElement.getBoundingClientRect().width / this.initImgRect.w}`);
    console.log(`rectH: ${this.img.nativeElement.getBoundingClientRect().height} / initRectH: ${this.initImgRect.h}
     = ${this.img.nativeElement.getBoundingClientRect().height / this.initImgRect.h}`);
    return {
      sx: this.img.nativeElement.getBoundingClientRect().width / this.initImgRect.w,
      sy: this.img.nativeElement.getBoundingClientRect().height / this.initImgRect.h
    };
  }

  ngOnInit() {
    this.tempRect = {x: 500, y: 250, w: 50, h: 50, sx: this.scale, sy: this.scale};
    this.tempConf = {color: '#00ff00', widthLine: 2};
    this.workState = WorkState.create;
  }

  ngAfterViewChecked(): void {
    if (this.isZoomRect) {
      this.zoomRect();
      this.isZoomRect = false;
      this.cdRef.detectChanges();
    }
  }

  initImg() {
    console.log(this.getInfo(this.img, 'img'));
    this.initImgRect = this.getBBox(this.img.nativeElement.getBoundingClientRect());
  }

}
