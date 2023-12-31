import { Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { Olympic } from 'src/app/core/models/olympic.model';
import { Statistic } from 'src/app/core/models/statistic.model';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  olympics$!: Observable<Olympic[]>;
  title!: string;
  statistics!: Statistic[];
  view!: [number, number];

  private destroy$!: Subject<boolean>;

  constructor(
    private olympicService: OlympicService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.title = "Medals per Country";
    this.olympics$ = this.olympicService.getOlympics();

    this.destroy$ = new Subject<boolean>();

    // Get header data from olympics$
    this.olympics$.pipe(
      takeUntil(this.destroy$),
      tap(stats => {
        this.statistics = [{
          statName: "Number of JOs",
          value: (stats[0] === undefined ? 0 : stats[0].participations.length)
        }, {
          statName: "Number of countries",
          value: stats.length
        }];
      })
    ).subscribe();
  }

  // Size the chart after data loaded
  ngAfterViewInit(): void {
    this.resizeGraph();
    this.changeDetector.detectChanges();
  }

  // Resize the chart when window size change
  resizeGraph(): void {
    const headerHeight = document.getElementById("headerHome")?.offsetHeight ?? 0;
    this.view = [innerWidth - 40, Math.max(innerHeight - headerHeight - 40, 200)];
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

}
