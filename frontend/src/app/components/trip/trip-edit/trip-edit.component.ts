import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDrawer, MatSidenavContainer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { environment } from 'environment';
import mapboxgl from 'mapbox-gl';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  pipe,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';
import {
  ItineraryPlace,
  PlaceToVisit,
  Trip,
} from 'src/app/interfaces/trip.interface';
import { User } from 'src/app/interfaces/user.model';
import { TripService } from 'src/app/services/trip/trip.service';
import { UserService } from 'src/app/services/user/user.service';
import * as tripEditActions from '../../../store/editingTrip/trip-edit.actions';
import * as tripEditSelector from '../../../store/editingTrip/trip-edit.selectors';
import * as userSelector from '../../../store/user/user.selectors';
import { BudgetComponent } from './budget/budget.component';
import { ItineraryComponent } from './itinerary/itinerary.component';
import { OverviewComponent } from './overview/overview.component';

@Component({
  selector: 'app-trip-edit',
  templateUrl: './trip-edit.component.html',
  styleUrls: ['./trip-edit.component.scss'],
})
export class TripEditComponent implements OnDestroy, OnInit, AfterViewInit {
  @ViewChild(MatSidenavContainer) sidenavContainer!: MatSidenavContainer;
  @ViewChild('drawer') drawer!: MatDrawer;
  @ViewChild('overview') overview!: ElementRef;
  @ViewChild('itinerary') itinerary!: ElementRef;
  @ViewChild('budget') budget!: ElementRef;
  @ViewChild(OverviewComponent) appOverview!: OverviewComponent;
  @ViewChild(ItineraryComponent) appItinerary!: ItineraryComponent;
  @ViewChild(BudgetComponent) appBudget!: BudgetComponent;
  scrollToOverviewSections(sectionId: string) {
    this.appOverview.scrollToSection(sectionId);
  }
  scrollToBudgetSections(sectionId: string) {
    this.appBudget.scrollToSection(sectionId);
  }
  scrollToDynamicSection(sectionId: string) {
    this.appItinerary.scrollToSection(sectionId);
  }
  scrollToSection(section: ElementRef, sectionName: string): void {
    section.nativeElement.scrollIntoView({ behavior: 'smooth' });
    this.activeSection = sectionName;
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
  map!: mapboxgl.Map;
  markers: mapboxgl.Marker[] = [];
  markers2: mapboxgl.Marker[] = [];
  currentMarker!: mapboxgl.Marker;
  trip!: Trip;
  headingLoading = false;
  tripName: string | undefined = '';
  nameInput = '';
  tripId = '';
  coverPhotoLoading = false;
  activeSection: string = 'overview';
  showOverview = true;
  userSearchControl = new FormControl();
  userSearchResults: Array<User & { member?: boolean }> = [];
  inviteTripmateLoading = {
    value: false,
    index: 0,
  };
  removeTripmateLoading = {
    value: false,
    index: 0,
  };
  leaveTripLoading = false;
  deleteTripLoading = false;
  editTripPrivacyForm: FormGroup;
  editPrivacyLoading = false;
  editTripPrivacyErrorMessage = '';
  private ngUnsubscribe = new Subject<void>();
  trip$ = this.store.select(tripEditSelector.selectEditingTrip);
  user$ = this.store.select(userSelector.selectUser);

  constructor(
    private store: Store,
    private tripService: TripService,
    private renderer: Renderer2,
    private el: ElementRef,
    private userService: UserService,
    private router: Router,
    fb: FormBuilder,
  ) {
    mapboxgl.accessToken = environment.MAPBOX_TOKEN;
    this.trip$.pipe(take(1)).subscribe({
      next: (trip) => {
        this.trip = trip;
      },
    });
    this.editTripPrivacyForm = fb.group({
      visibility: [`${this.trip.visibility}`, [Validators.required]],
    });
  }

  ngOnInit() {
    this.userSearchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((username: string) => {
          // Cancel previous request and start a new one
          return this.userService.searchUsers(username);
        }),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe({
        next: (res) => {
          this.userSearchResults = [];
          res.users.forEach((user) => {
            const member = this.trip.tripMates?.some(
              (u) => u._id === user._id!,
            );
            this.userSearchResults.push({ ...user, member });
          });
        },
        error: (errMessage) => {
          console.log(errMessage);
        },
      });
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: this.trip.place?.coordinates,
      zoom: 9,
    });
    this.trip$.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (trip) => {
        this.trip = trip;
        this.tripName = trip.name;
        this.nameInput = trip.name!;
        this.tripId = trip._id!;
        this.markers.forEach((marker) => marker.remove());
        this.markers2.forEach((marker) => marker.remove());
        this.markers = [];
        this.markers2 = [];
        trip.overview?.placesToVisit.forEach((element, i) => {
          const divElement = this.renderer.createElement('div');
          this.renderer.addClass(divElement, 'marker');
          const spanElement = this.renderer.createElement('span');
          const bElement = this.renderer.createElement('b');
          const text = this.renderer.createText('' + (i + 1));
          this.renderer.appendChild(bElement, text);
          this.renderer.appendChild(spanElement, bElement);
          this.renderer.appendChild(divElement, spanElement);
          this.renderer.appendChild(this.el.nativeElement, divElement);
          const marker = new mapboxgl.Marker(divElement)
            .setLngLat(element.coordinates!)
            .setPopup(
              new mapboxgl.Popup().setHTML(
                `<h1 class="text-lg font-bold">${element.name}</h1><br>
                <div class="flex flex-col space-y-2"><img class="h-24 min-w-[150px] w-full rounded-lg object-cover"
                src="${element.image}">
                </div>
                `,
              ),
            )
            .addTo(this.map);
          this.markers.push(marker);
        });
        trip.itinerary?.forEach((element, i) => {
          element.places?.forEach((place, placeI) => {
            const divElement = this.renderer.createElement('div');
            this.renderer.addClass(divElement, 'marker2');
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
                  <div class="flex flex-col space-y-2"><img class="h-24 min-w-[150px] w-full rounded-lg object-cover"
                  src="${place.image}">
                  </div>
                  `,
                ),
              )
              .addTo(this.map);
            this.markers2.push(marker);
          });
        });
      },
    });
  }
  isDrawerOpen(): boolean {
    return this.drawer?.opened || false;
  }
  onHeadingBlur() {
    this.headingLoading = true;
    if (this.nameInput?.trim().length > 3 && this.nameInput !== this.tripName) {
      this.tripService
        .changeName(this.tripId, { tripName: this.nameInput })
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (res) => {
            this.store.dispatch(
              tripEditActions.updateTripName({ name: res.tripName }),
            );
            this.headingLoading = false;
          },
          error: (errMessage: string) => {
            this.headingLoading = false;
          },
        });
    } else {
      this.headingLoading = false;
      this.nameInput = this.tripName!;
    }
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
    this.tripService
      .changeCoverphoto(this.tripId, { coverPhoto: base64String })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.store.dispatch(
            tripEditActions.updateCoverPhoto({ coverPhoto: res.coverPhoto }),
          );
          this.coverPhotoLoading = false;
        },
        error: (errMessage: string) => {
          this.coverPhotoLoading = false;
        },
      });
  }
  onAccordionClicked(place: PlaceToVisit) {
    this.map.flyTo({ center: place.coordinates, zoom: 13 });
    this.togglePopupByIndex(place.index!);
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
  onAccordionClicked2(place: ItineraryPlace) {
    this.map.flyTo({ center: place.coordinates, zoom: 13 });
    let count = 0;
    let flag = false;
    for (const element of this.trip.itinerary || []) {
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
    this.togglePopupByIndex2(count);
  }
  togglePopupByIndex2(index: number) {
    if (this.currentMarker) {
      const popup = this.currentMarker!.getPopup();
      if (popup.isOpen()) {
        this.currentMarker!.togglePopup();
      }
    }
    if (index >= 0 && index < this.markers2.length) {
      const popup = this.markers2[index].getPopup();
      if (!popup.isOpen()) {
        this.markers2[index].togglePopup();
      }
      this.currentMarker = this.markers2[index];
    }
  }
  showAddTripmateModal() {
    const addTripmateModal = document.getElementById(
      'addTripmateModal',
    ) as HTMLDialogElement;
    addTripmateModal.showModal();
  }
  inviteTripmate(index: number, userId: string) {
    this.inviteTripmateLoading = { value: true, index };
    this.tripService
      .inviteTripMate(this.tripId, { userId })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.store.dispatch(
            tripEditActions.updateInvitedTripmates({
              invitedTripmates: res.invitedTripMates,
            }),
          );
          this.inviteTripmateLoading = { value: false, index };
        },
        error: (errMessage) => {
          console.log(errMessage);
          this.inviteTripmateLoading = { value: false, index };
        },
      });
  }
  removeTripMate(index: number, tripMateId: string) {
    this.removeTripmateLoading = { value: true, index };
    this.tripService
      .removeTripMate(this.tripId, tripMateId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.store.dispatch(
            tripEditActions.updateTripMates({ tripMates: res.tripMates }),
          );
          this.removeTripmateLoading = { value: false, index };
        },
        error: (errMessage) => {
          console.log(errMessage);
          this.removeTripmateLoading = { value: false, index };
        },
      });
  }
  leaveTrip() {
    this.leaveTripLoading = true;
    this.tripService
      .leaveTrip(this.trip._id!)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.store.dispatch(tripEditActions.deleteTripEdit());
          this.leaveTripLoading = false;
          this.router.navigate(['/home']);
        },
        error: (errMessage) => {
          console.log(errMessage);
          this.leaveTripLoading = false;
        },
      });
  }

  showDeleteTripModal() {
    const deleteTripModal = document.getElementById(
      'deleteTripModal',
    ) as HTMLDialogElement;
    deleteTripModal.showModal();
  }
  closeDeleteTripModal() {
    const deleteTripModal = document.getElementById(
      'deleteTripModal',
    ) as HTMLDialogElement;
    deleteTripModal.close();
  }
  deleteTrip() {
    this.deleteTripLoading = true;
    this.tripService
      .deleteTrip(this.tripId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.store.dispatch(tripEditActions.deleteTripEdit());
          this.deleteTripLoading = false;
          this.router.navigate(['/home']);
        },
        error: (errMessage) => {
          this.deleteTripLoading = false;
          console.log(errMessage);
        },
      });
  }
  showEditTripPrivacyModal() {
    const editTripPrivacyModal = document.getElementById(
      'editTripPrivacyModal',
    ) as HTMLDialogElement;
    editTripPrivacyModal.showModal();
  }
  closeEditTripPrivacyModal() {
    const editTripPrivacyModal = document.getElementById(
      'editTripPrivacyModal',
    ) as HTMLDialogElement;
    editTripPrivacyModal.close();
  }
  changeTripPrivacy() {
    const newValue = this.editTripPrivacyForm.value.visibility;
    const oldValue = this.trip.visibility;
    if (newValue !== oldValue) {
      this.editPrivacyLoading = true;
      this.tripService
        .changeVisibility(this.tripId, this.editTripPrivacyForm.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (res) => {
            this.store.dispatch(
              tripEditActions.updateVisibility({ visibility: res.visibility }),
            );
            this.editPrivacyLoading = false;
            this.closeEditTripPrivacyModal();
          },
          error: (errMessage) => {
            this.editTripPrivacyErrorMessage = errMessage;
            this.editPrivacyLoading = true;
          },
        });
    } else {
      this.closeEditTripPrivacyModal();
    }
  }
  showViewTripmatesModal() {
    const viewTripmatesModal = document.getElementById(
      'viewTripmatesModal',
    ) as HTMLDialogElement;
    viewTripmatesModal.showModal();
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
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
