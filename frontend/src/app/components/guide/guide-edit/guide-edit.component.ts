import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDrawer, MatSidenavContainer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { environment } from 'environment';
import mapboxgl from 'mapbox-gl';
import { Subject, take, takeUntil } from 'rxjs';
import { Guide, Place } from 'src/app/interfaces/guide.interface';
import { GuideService } from 'src/app/services/guide/guide.service';
import { UserService } from 'src/app/services/user/user.service';
import * as guideEditActions from '../../../store/editingGuide/guide-edit.actions';
import * as guideEditSelectors from '../../../store/editingGuide/guide-edit.selectors';
import * as userSelectors from '../../../store/user/user.selectors';

@Component({
  selector: 'app-guide-edit',
  templateUrl: './guide-edit.component.html',
  styleUrls: ['./guide-edit.component.scss'],
})
export class GuideEditComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('drawer') drawer!: MatDrawer;
  @ViewChild('overview') overview!: ElementRef;
  @ViewChild(MatSidenavContainer) sidenavContainer!: MatSidenavContainer;

  scrollToSection(section: ElementRef, sectionName: string): void {
    section.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
  scrollToDynamicSection(sectionI: string) {
    const sectionElement = this.elementRef.nativeElement.querySelector(
      `.section-${sectionI}`,
    );
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
  ngAfterViewInit() {
    this.setSidenavMode();
    window.addEventListener('resize', () => {
      this.setSidenavMode();
    });
  }
  private setSidenavMode() {
    if (window.innerWidth >= 1200) {
      this.drawer.mode = 'side';
    } else {
      this.drawer.mode = 'over';
    }
  }

  currentPosition = 0;
  showMap = false;
  private ngUnsubscribe$ = new Subject<void>();
  guide$ = this.store.select(guideEditSelectors.selectEditingGuide);
  user$ = this.store.select(userSelectors.selectUser);
  guide!: Guide;
  map!: mapboxgl.Map;
  markers: mapboxgl.Marker[] = [];
  currentMarker!: mapboxgl.Marker;
  guideHeadingInput = '';
  headingLoading = false;
  coverPhotoLoading = false;
  deleteGuideLoading = false;
  generalTipsSaving = false;
  writersRelationsaving = false;
  addSectionLoading = false;
  deleteSectionLoading = false;

  constructor(
    private store: Store,
    private guideService: GuideService,
    private renderer: Renderer2,
    private el: ElementRef,
    private userService: UserService,
    private router: Router,
    private elementRef: ElementRef,
    fb: FormBuilder,
  ) {
    mapboxgl.accessToken = environment.MAPBOX_TOKEN;
    this.guide$.pipe(take(1)).subscribe({
      next: (guide) => {
        this.guide = guide;
      },
    });
  }
  ngOnInit(): void {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: this.guide.place?.coordinates,
      zoom: 9,
    });
    this.guide$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (guide) => {
        this.guide = guide;
        this.guideHeadingInput = guide.name!;
        this.markers.forEach((marker) => marker.remove());
        this.markers = [];
        guide.sections?.forEach((element, i) => {
          element.places?.forEach((place, placeI) => {
            const divElement = this.renderer.createElement('div');
            this.renderer.addClass(divElement, 'marker');
            const spanElement = this.renderer.createElement('span');
            const bElement = this.renderer.createElement('b');
            const text = this.renderer.createText(`${i + 1}.${placeI + 1}`);
            this.renderer.appendChild(bElement, text);
            this.renderer.appendChild(spanElement, bElement);
            this.renderer.appendChild(divElement, spanElement);
            this.renderer.appendChild(this.el.nativeElement, divElement);
            const marker = new mapboxgl.Marker(divElement)
              .setLngLat(place.coordinates!)
              .setPopup(
                new mapboxgl.Popup().setHTML(
                  `<h1 class="text-lg font-bold">${place.name}</h1><br>
                  <div class="flex flex-col space-y-2"><img class="h-24 w-full rounded-lg object-cover"
                  src="${place.image}"><br>
                  <p class="line-clamp-3 break-words">${place.description}</p>
                  </div>
                  `,
                ),
              )
              .addTo(this.map);
            this.markers.push(marker);
          });
        });
      },
    });
  }

  isDrawerOpen(): boolean {
    return this.drawer?.opened || false;
  }

  showDeleteGuideModal() {
    const deleteGuideModal = document.getElementById(
      'deleteGuideModal',
    ) as HTMLDialogElement;
    deleteGuideModal.showModal();
  }

  closeDeleteGuideModal() {
    const deleteGuideModal = document.getElementById(
      'deleteGuideModal',
    ) as HTMLDialogElement;
    deleteGuideModal.close();
  }

  deleteGuide() {
    this.deleteGuideLoading = true;
    this.guideService
      .deleteGuide(this.guide._id!)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: () => {
          this.store.dispatch(guideEditActions.deleteGuideEdit());
          this.deleteGuideLoading = false;
          this.router.navigate(['/home']);
        },
        error: (errMessage) => {
          this.deleteGuideLoading = false;
          console.log(errMessage);
        },
      });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result;
        this.changeCoverPhoto(base64String);
      };
      reader.readAsDataURL(file);
    }
  }
  changeCoverPhoto(base64String: string): void {
    this.coverPhotoLoading = true;
    this.guideService
      .changeCoverphoto(this.guide._id!, { coverPhoto: base64String })
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.store.dispatch(
            guideEditActions.updateCoverPhoto({ coverPhoto: res.coverPhoto }),
          );
          this.coverPhotoLoading = false;
        },
        error: (errMessage: string) => {
          console.log(errMessage);
          this.coverPhotoLoading = false;
        },
      });
  }

  onHeadingBlur() {
    this.headingLoading = true;
    if (
      this.guideHeadingInput?.trim().length > 3 &&
      this.guideHeadingInput !== this.guide.name
    ) {
      this.guideService
        .changeName(this.guide._id!, { guideName: this.guideHeadingInput })
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.store.dispatch(
              guideEditActions.updateGuideName({ name: res.guideName }),
            );
            this.headingLoading = false;
          },
          error: (errMessage: string) => {
            this.headingLoading = false;
          },
        });
    } else {
      this.headingLoading = false;
      this.guideHeadingInput = this.guide.name!;
    }
  }

  updateGeneralTips(newValue: string) {
    if (newValue !== this.guide?.generalTips) {
      this.generalTipsSaving = true;
      this.guideService
        .updateGeneralTips(this.guide?._id!, {
          generalTips: newValue,
        })
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.store.dispatch(
              guideEditActions.updateGeneralTips({
                generalTips: res.generalTips,
              }),
            );
            this.generalTipsSaving = false;
          },
          error: (errMessage) => {
            console.log(errMessage);
            this.generalTipsSaving = false;
          },
        });
    }
  }

  updateWritersRelation(newValue: string) {
    if (newValue !== this.guide?.writersRelation) {
      this.writersRelationsaving = true;
      this.guideService
        .updateWritersRelation(this.guide?._id!, {
          writersRelation: newValue,
        })
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.store.dispatch(
              guideEditActions.updateWritersRelation({
                writersRelation: res.writersRelation,
              }),
            );
            this.writersRelationsaving = false;
          },
          error: (errMessage) => {
            console.log(errMessage);
            this.writersRelationsaving = false;
          },
        });
    }
  }

  addNewSection() {
    if (!this.addSectionLoading) {
      this.addSectionLoading = true;
      this.guideService
        .addSection(this.guide._id!)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.addSectionLoading = false;
            this.store.dispatch(
              guideEditActions.addSection({ section: res.section }),
            );
          },
          error: (errMessage) => {
            console.log(errMessage);
            this.addSectionLoading = false;
          },
        });
    }
  }

  onAccordionClicked(place: Place) {
    this.map.flyTo({ center: place.coordinates, zoom: 13 });
    let count = 0;
    let flag = false;
    for (const element of this.guide.sections || []) {
      for (const item of element.places || []) {
        if (place._id == item._id) {
          flag = true;
          break;
        } else {
          count++;
        }
      }
      if (flag) {
        break;
      }
    }
    this.togglePopupByIndex(count);
  }

  togglePopupByIndex(index: number) {
    if (this.currentMarker) {
      const popup = this.currentMarker!.getPopup();
      if (popup.isOpen()) {
        this.currentMarker!.togglePopup();
      }
    }
    if (index >= 0 && index < this.markers.length) {
      const popup = this.markers[index].getPopup();
      if (!popup.isOpen()) {
        this.markers[index].togglePopup();
      }
      this.currentMarker = this.markers[index];
    }
  }

  showMapFn() {
    this.currentPosition =
      this.sidenavContainer.scrollable.measureScrollOffset('top');
    this.showMap = true;
  }
  closeMap() {
    this.showMap = false;
    setTimeout(() => {
      this.sidenavContainer.scrollable.scrollTo({
        top: this.currentPosition,
        behavior: 'auto',
      });
    }, 100);

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
