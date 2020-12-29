import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild
} from '@angular/core';
import * as d3 from 'd3';

import { calculateDifferencePercentage, exponentialToFixed } from '@shared/utils/number';
import { PdvValuePipe } from '@shared/pipes/pdv-value/pdv-value.pipe';
import { addAmountToDate, DateAmountType } from '@shared/utils/date';

export interface ChartPoint {
  date: number;
  value: number;
}

interface FilterButton {
  amount: number;
  dateType: DateAmountType,
  label: string
}

@Component({
  selector: 'app-chart',
  templateUrl: './pdv-activity-chart.component.html',
  styleUrls: ['./pdv-activity-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    PdvValuePipe,
  ],
})
export class PdvActivityChartComponent implements AfterViewInit {
  @Input() public data: ChartPoint[];

  @ViewChild('chartLine') private chartContainer: ElementRef;

  private bisectDate = d3.bisector((d: ChartPoint) => {
    return new Date(d.date);
  }).center;

  public filterButtons: FilterButton[] = [
    {dateType: DateAmountType.DAYS, amount: -7, label: '1W'},
    {dateType: DateAmountType.MONTHS, amount: -1, label: '1M'},
    {dateType: DateAmountType.MONTHS, amount: -3, label: '3M'},
    {dateType: DateAmountType.MONTHS, amount: -6, label: '6M'},
    {dateType: DateAmountType.YEARS, amount: -1, label: '1Y'},
    {dateType: DateAmountType.DAYS, amount: 0, label: 'ALL'},
  ];

  public rateMargin;
  public rate;
  public rateDate;

  private chart: any;
  private chartData: ChartPoint[];

  private margin = { top: 15, right: 5, bottom: 15, left: 5 };
  private width = 0;
  private height = 160 - this.margin.top - this.margin.bottom;

  private xAxis: any;
  private yAxis: any;

  private gx: any;
  private gy: any;

  private svg: any;

  private line: any;

  private chartHover: any;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  public ngOnInit(): void {
    this.chartData = this.data;
  }

  public ngAfterViewInit(): void {
    this.initChart();
  }

  private initChart(): void {
    this.changeDetectorRef.detectChanges();

    if (!this.chartContainer) {
      return;
    }

    this.chart = this.chartContainer.nativeElement;

    this.createChart();
    this.repaintChart();
  }

  public onResize(event): void {
    if (this.chartData) {
      this.createChart();
      this.repaintChart();
    }
  }

  private createChart(): void {
    d3.selectAll('.chart-svg').remove();

    this.width = this.chartContainer.nativeElement.clientWidth - this.margin.left - this.margin.right;

    this.svg = d3.select(this.chart)
      .attr('overflow', 'visible')
      .append('svg')
      .attr('class', 'chart-svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('class', 'chart-container')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  private setAxisScales(): void {
    this.gx = d3.scaleUtc();
    this.gy = d3.scaleLinear();

    this.gx
      .domain(d3.extent(
        this.chartData,
        d => new Date((d.date))
      ))
      .range([
        this.margin.left,
        this.width - this.margin.right
      ]);

    this.gy
      .domain([
        d3.min(this.chartData, (d: any) => d.value),
        d3.max(this.chartData, (d: any) => d.value)
      ])
      .nice()
      .range([
        this.height - this.margin.bottom,
        this.margin.top
      ]);
  }

  private drawAxis(): void {
    this.xAxis = g => g
      .attr('transform', `translate(0,${this.height - this.margin.bottom})`)
      .call(d3.axisBottom(this.gx).ticks(this.width / 80).tickSizeOuter(0));

    this.yAxis = g => g
      .attr('transform', `translate(${this.margin.left},0)`)
      .call(d3.axisLeft(this.gy));

    this.svg.append('g').call(this.xAxis);
    this.svg.append('g').call(this.yAxis);
  }

  private repaintChart(): void {
    const self = this;

    d3.selectAll('.chart-svg g > *').remove();

    // this.drawAxis();
    this.setAxisScales();

    function mousemove(event): void {
      const date = self.gx.invert(d3.pointer(event, this)[0]);

      const index = self.bisectDate(self.chartData, date, 1);
      const d0 = self.chartData[index - 1];
      const d1 = self.chartData[index];
      const value0 = self.chartData[index - 1].value;
      const value1 = self.chartData[index].value;
      const d0UTC: any = new Date(d0.date);
      const d1UTC: any = new Date(d1.date);
      const d = (date - d0UTC > d1UTC - date) ? d1 : d0;

      const valuePercent = calculateDifferencePercentage(value1, value0);

      // self.svg.on('touchend mouseleave', () => self.chartHover.call(self.callout, null));

      self.chartHover
        .attr('transform', `translate(${(self.gx(new Date(d.date)))},${(self.gy(d.value))})`)
        .attr('opacity', 1)
        .call(self.callout, `Date: ${self.formatDate(new Date(d.date))}, PDV: ${((d.value))}`);

      self.rateMargin = Number(valuePercent);
      self.rate = exponentialToFixed(d.value);
      self.rateDate = self.formatDate(new Date(d.date));
      self.changeDetectorRef.detectChanges();
    }

    this.line = d3.line()
      .defined((d: any) => !isNaN(d.value))
      .x((d: any) => this.gx(new Date(d.date)))
      .y((d: any) => this.gy(d.value));

    this.chartHover = this.svg
      .append('g')
      .attr('class', 'hover-items');

    this.svg.append('rect')
      .attr('transform', `translate(${this.margin.left}, -${this.margin.top})`)
      .attr('class', 'overlay')
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .attr('width', this.width - this.margin.left)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .on('mouseenter', mousemove)
      .on('mousemove', mousemove);

    this.svg.append('path')
      .datum(this.chartData)
      .attr('class', 'line-class')
      .attr('pointer-events', 'none')
      .attr('fill', 'none')
      .attr('stroke', '#4477E4')
      .attr('stroke-width', '1')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', this.line);
  }

  private formatDate(date): void {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
    });
  }

  private callout = (g, value) => {
    if (!value) {
      g.attr('opacity', '0');
    }

    d3.selectAll('svg .hover-items > *').remove();

    g.append('line')
      .attr('class', 'hover-line')
      .attr('stroke', '#4477E4')
      .attr('stroke-width', '1px')
      .attr('y1', -this.height)
      .attr('y2', this.height);

    g.append('circle')
      .attr('r', 3)
      .attr('class', 'hover-circle')
      .attr('stroke', '#4477E4');

    g
      .attr('display', null)
      .attr('pointer-events', 'none');
  };

  public filterChartData($event: MouseEvent, amount: number, dateType: DateAmountType): void {
    const filterByDate = addAmountToDate(new Date(), amount, dateType).valueOf();

    this.updateClass($event, 'active');

    if (amount === 0) {
      this.chartData = this.data;
      return this.initChart();
    }

    this.chartData = this.data.filter((chartPoint) => chartPoint.date > filterByDate);

    return this.initChart();
  }

  private removeClass($event: any, className: string, parent: string, removeFrom: string): void {
    $event.target.closest(parent).querySelectorAll(removeFrom).forEach(item => {
      item.classList.remove(className);
    });
  }

  private updateClass($event: MouseEvent, className: string): void {
    this.removeClass($event, className, 'ul', 'li');
    ($event.target as Element).classList.add(className);
  }
}
