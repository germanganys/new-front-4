import {Component, Input, OnInit} from '@angular/core';

interface Point {
  x: number;
  y: number;
  r: number;
  result: boolean;
  username: string;
}

@Component({
  selector: 'app-visual',
  templateUrl: './visual.component.svg',
})
export class VisualComponent implements OnInit {

  @Input() rValue = 1;
  @Input() simplePoints: Point[] = [];
  @Input() username = '';

  constructor() { }

  ngOnInit(): void {
  }

}
