import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef, Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import * as d3 from 'd3';

export interface ChartPoint {
  date: number;
  value: number;
}

@Component({
  selector: 'app-chart',
  templateUrl: './pdv-activity-chart.component.html',
  styleUrls: ['./pdv-activity-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdvActivityChartComponent implements OnChanges, AfterViewInit {
  @Input() public data: ChartPoint[];

  @ViewChild('chartLine') private chartContainer: ElementRef;

  @ViewChild('chartLineResult') private chartResultContainer: ElementRef;

  bisectDate = d3.bisector((d: ChartPoint) => {
    return new Date(d.date);
  }).center;

  private chart: any;
  private chartResult: any;

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
  private chartLegend: any;

  public ngOnChanges(changes: SimpleChanges): void {
    this.repaintChart();
  }

  public ngAfterViewInit(): void {
    this.initChart();
    this.createChart();
    this.repaintChart();
  }

  private initChart(): void {
    this.chart = this.chartContainer.nativeElement;
    this.chartResult = this.chartResultContainer.nativeElement;
    this.chartLegend = d3.select(this.chartResult)
      .append('div')
      .attr('class', 'chart-legend');
  }

  public onResize(event): void {
    if (this.data) {
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
        this.data,
        d => new Date((d.date))
      ))
      .range([
        this.margin.left,
        this.width - this.margin.right
      ]);

    this.gy
      .domain([
        d3.min(this.data, (d: any) => d.value),
        d3.max(this.data, (d: any) => d.value)
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

      const index = self.bisectDate(self.data, date, 1);
      const d0 = self.data[index - 1];
      const d1 = self.data[index];
      const value0 = self.data[index - 1].value;
      const value1 = self.data[index].value;
      const d0UTC: any = new Date(d0.date);
      const d1UTC: any = new Date(d1.date);
      const d = (date - d0UTC > d1UTC - date) ? d1 : d0;

      const valuePercent = Math.abs((Math.min(value1, value0) / Math.max(value1, value0)) - 1).toFixed(3);
      const rateSign = value1 === value0 ? '' : value1 > value0 ? '+' : '-';
      const rateClass = value1 === value0 ? 'pdv-rate-history__none' : value1 > value0
        ? 'pdv-rate-history__rise' : 'pdv-rate-history__fall';

      // self.svg.on('touchend mouseleave', () => self.chartHover.call(self.callout, null));

      self.chartHover
        .attr('transform', `translate(${(self.gx(new Date(d.date)))},${(self.gy(d.value))})`)
        .attr('opacity', 1)
        .call(self.callout, `Date: ${self.formatDate(new Date(d.date))}, PDV: ${((d.value))}`);

      self.chartLegend.html(`
            <div>
              <div class="chart-legend__rate">${d.value} PDV</div>
              <div class="chart-legend__date">${self.formatDate(new Date(d.date))}</div>
            </div>
            <div class="pdv-rate-history ${rateClass}">
              <span>
                <div class="rate-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                   <g>
                    <path id="svg_1" d="m0,16c0,8.836 7.164,16 16.004,16c8.832,0 15.996,-7.164 15.996,-16c0,-8.838
                    -7.164,-16 -15.996,-16c-8.84,0 -16.004,7.162
                    -16.004,16zm24,-0.031l-6,0l0,8.031l-4,0l0,-8.031l-5.969,0l7.973,-7.971l7.996,7.971z"/>
                   </g>
                  </svg>
                </div>
                ${rateSign} ${valuePercent}%
              </span>
            </div>
        `);
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
      .attr('width', this.width - this.margin.left)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .on('mousemove', mousemove);

    this.svg.append('path')
      .datum(this.data)
      .attr('class', 'line-class')
      .attr('d', this.line);
  }

  private formatDate(date): void {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'UTC'
    });
  }

  callout = (g, value) => {
    if (!value) {
      g.attr('opacity', '0');
    }

    d3.selectAll('svg .hover-items > *').remove();

    g.append('line')
      .attr('class', 'hover-line')
      .attr('y1', -this.height)
      .attr('y2', this.height);

    g.append('circle')
      .attr('r', 3)
      .attr('class', 'hover-circle');
    g
      .attr('display', null)
      .attr('pointer-events', 'none');
  }
}
