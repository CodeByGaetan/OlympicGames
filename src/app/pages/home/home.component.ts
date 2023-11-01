import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Olympic } from 'src/app/core/models/olympic.model';
import { Statistic } from 'src/app/core/models/statistic.model';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  
  olympics$!: Observable<Olympic[]>;
  
  title!: string;
  statistics!: Statistic[];
  
  view!: [number,number];

  constructor(private olympicService: OlympicService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.title = "Medals per Country";
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.pipe(
      tap(stats => {
        console.log("pipe Home : " + stats.length);
        this.statistics = [{
          statName: "Number of JOs",
          value: (stats[0] === undefined ? 0 : stats[0].participations.length)
        },{
          statName: "Number of countries",
          value: stats.length
        }];
      })
    ).subscribe();
  }

  ngAfterViewInit(): void {
    this.resizeGraph();
    this.cd.detectChanges();
  }

  resizeGraph() {
    const headerHeight = document.getElementById("headerHome")?.offsetHeight ?? 0
    // console.log("Home, hauteur du Header : " + headerHeight);
    this.view = [innerWidth-40, Math.max(innerHeight-headerHeight-40, 200)];
  }

}
