import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { environment } from 'environment';
import mapboxgl from 'mapbox-gl';
import { Subject, take, takeUntil } from 'rxjs';
import { Guide } from 'src/app/interfaces/guide.interface';
import { GuideService } from 'src/app/services/guide/guide.service';
import { UserService } from 'src/app/services/user/user.service';
import * as guideEditSelectors from '../../../store/editingGuide/guide-edit.selectors';
import * as userSelectors from '../../../store/user/user.selectors';

@Component({
  selector: 'app-guide-edit',
  templateUrl: './guide-edit.component.html',
  styleUrls: ['./guide-edit.component.scss'],
})
export class GuideEditComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer!: MatDrawer;
  @ViewChild('overview') overview!: ElementRef;

  scrollToSection(section: ElementRef, sectionName: string): void {
    section.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

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

  constructor(
    private store: Store,
    private guideService: GuideService,
    private renderer: Renderer2,
    private el: ElementRef,
    private userService: UserService,
    private router: Router,
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
                  src="${place.image}"><p class="text-sm">${place.description}</p>
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
    // this.tripService
    //   .deleteTrip(this.tripId)
    //   .pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe({
    //     next: () => {
    //       this.store.dispatch(tripEditActions.deleteTripEdit());
    //       this.deleteTripLoading = false;
    //       this.router.navigate(['/home']);
    //     },
    //     error: (errMessage) => {
    //       this.deleteTripLoading = false;
    //       console.log(errMessage);
    //     },
    //   });
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
