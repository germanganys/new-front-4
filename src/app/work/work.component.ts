import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MessageService} from 'primeng/api';

interface Choice {
  value: number;
  strValue: string;
}

interface Point {
  x: number;
  y: number;
  r: number;
  result: boolean;
}

@Component({
  selector: 'app-admin',
  templateUrl: 'work.component.html',
  providers: [MessageService]
})
export class WorkComponent implements OnInit {
  xChoices: Choice[];
  rChoices: Choice[];

  currX: number;
  currY: number;
  currR: number;

  baseApiUrl = 'http://134.0.115.32:8080/unnamed/api/points/';
  baseLkUrl = 'http://134.0.115.32:8080/unnamed/lk/';

  logoutUrl = this.baseLkUrl + 'logout';
  addPointUrl = this.baseApiUrl + 'add';
  resultsUrl = this.baseApiUrl + 'get';
  clearUrl = this.baseApiUrl + 'clear';

  errorResponse = 'failed';
  okResponse = 'ok';

  points: { [key: number]: Point[]; } = {
    1: [],
    2: [],
    3: [],
  };
  pointsForTable: Point[] = [];
  pointsForVisual: Point[] = [];

  constructor(private router: Router, private http: HttpClient, private messageService: MessageService) {
    this.currX = 0;
    this.currY = 0;
    this.currR = 1;
    this.xChoices = [
      {value: -5, strValue: '-5'},
      {value: -4, strValue: '-4'},
      {value: -3, strValue: '-3'},
      {value: -2, strValue: '-2'},
      {value: -1, strValue: '-1'},
      {value: 0, strValue: '0'},
      {value: 1, strValue: '1'},
      {value: 2, strValue: '2'},
      {value: 3, strValue: '3'},
    ];
    this.rChoices = this.xChoices;
    if (localStorage.getItem('key') == null) {
      router.navigate(['']);
    }
    this.fetchPoints();
  }

  ngOnInit(): void {
  }


  onCanvasClick(event: MouseEvent): void {

    if (this.currR < 1) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'The negative or 0 R is prohibited'});
      return;
    }

    const elem = document.getElementById('canvas');
    const br = elem.getBoundingClientRect();
    const left = br.left;
    const top = br.top;

    const clientX: number = event.clientX - left;
    const clientY: number = event.clientY - top;

    const transfX = this.currR * (clientX - 150) / 130;
    const transfY = this.currR * (150 - clientY) / 130;

    this.http.post(this.addPointUrl, {
        key: localStorage.getItem('key'),
        x: transfX,
        y: transfY,
        r: this.currR
      }
    ).subscribe(data => {
      const resp: any = data;
      if (resp.status === this.errorResponse) {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Failed to add'});
      } else {
        const lastPt: Point = resp.last_point;
        this.points[lastPt.r].push(lastPt);
        this.pointsForTable.push(lastPt);
      }
    });

  }


  fetchPoints(): void {
    this.http.post(this.resultsUrl, {
      key: localStorage.getItem('key')
    }).toPromise()
      .then(resp => resp as any)
      .then(resp => resp.data as Point[])
      .then(data => {
        data.forEach(val => this.points[val.r].push(val));
        this.pointsForTable = data;
        this.pointsForVisual = this.points[this.currR];
      });
  }

  onSubmit(): void {

    if (this.currR < 1) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'The negative or 0 R is prohibited'});
      return;
    }

    this.http.post(this.addPointUrl, {
        key: localStorage.getItem('key'),
        x: this.currX,
        y: this.currY,
        r: this.currR
      }
    ).subscribe(data => {
      const resp: any = data;
      if (resp.status === this.errorResponse) {
        console.log('Failed to add');
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Failed to add'});
      } else {
        const lastPt: Point = resp.last_point;
        this.points[lastPt.r].push(lastPt);
        this.pointsForTable.push(lastPt);
      }
    });
  }

  logout(): void {
    this.http.post(this.logoutUrl, {key: localStorage.getItem('key')});
    localStorage.removeItem('key');
    this.router.navigate(['']);
  }

  onClear(): void {
    this.http.post(this.clearUrl, {key: localStorage.getItem('key')}).subscribe(data => {
      const resp: any = data;
      if (resp.status === this.errorResponse) {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Failed to clear'});
      } else {
        location.reload(true);
      }
    });
  }

  rChanged(): void {
    this.pointsForVisual = this.points[this.currR];
  }
}
