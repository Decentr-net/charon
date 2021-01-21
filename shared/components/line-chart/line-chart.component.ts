import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input, OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as d3 from 'd3';

import { ChartPoint } from '@shared/components/line-chart';
import { observeResize } from '@shared/utils/observe-resize';

@UntilDestroy()
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent implements AfterViewInit, OnChanges {
  @ViewChild('chart', { static: false }) chartRef: ElementRef;

  @Input() public data: ChartPoint[];
  @Input() private color: string;
  @Input() private isMinYZero: boolean = false;

  private containerWidth: number;
  private containerHeight: number;
  private width: number;
  private height: number;
  private margin = { top: 5, right: 5, bottom: 5, left: 5 };

  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private chartContainer: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private x: d3.ScaleTime<number, number>;
  private y: d3.ScaleLinear<number, number>;
  private line: d3.Line<ChartPoint>;
  private area: d3.Area<ChartPoint>;

  public ngAfterViewInit(): void {
    this.setChartSize();
    this.createSvg();
    this.createAxis();
    this.drawLine();
    this.drawArea();

    observeResize(this.chartRef.nativeElement).pipe(
      untilDestroyed(this)
    ).subscribe(() => this.resizeWorks());
  }

  public ngOnChanges({ data }: SimpleChanges): void {
    if (data) {
      this.data = data.currentValue;

      if (this.chartRef) {
        this.resizeWorks();
      }
    }
  }

  private resizeWorks(): void {
    this.setChartSize();
    this.updateSvgDimensions();
    this.updateChart();
  }

  private setChartSize(): void {
    this.containerWidth = this.chartRef.nativeElement.clientWidth;
    this.containerHeight = this.chartRef.nativeElement.clientHeight;

    this.width = this.containerWidth - this.margin.left - this.margin.right;
    this.height = this.containerHeight - this.margin.top - this.margin.bottom;
  }

  private createSvg(): void {
    this.svg = d3.select(this.chartRef.nativeElement)
      .append('svg');

    this.updateSvgDimensions();

    this.svg
      .append('g')
      .attr('class', 'chart-container')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    this.chartContainer = d3.select(this.chartRef.nativeElement).select('.chart-container');
  }

  private createAxis(): void {
    // Create the X-axis scale
    this.x = d3.scaleUtc();

    // Create the Y-axis scale
    this.y = d3.scaleLinear();

    this.updateAxis();
  }

  private drawLine(): void {
    this.line = d3.line<ChartPoint>()
      .defined(d => !isNaN(d.value))
      .x(d => this.x(d.date))
      .y(d => this.y(d.value));

    this.chartContainer.append('path')
      .datum(this.data)
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', this.color)
      .attr('stroke-width', 2)
      .attr('d', this.line);
  }

  private drawArea(): void {
    this.area = d3.area<ChartPoint>()
      .x(d => this.x(d.date))
      .y0(this.height)
      .y1(d => this.y(d.value));

    this.chartContainer.append('path')
      .datum(this.data)
      .attr('class', 'area')
      .attr('fill', this.color)
      .attr('opacity', '0.105')
      .attr('stroke', 'none')
      .attr('d', this.area);
  }

  private updateSvgDimensions(): void {
    this.svg
      .attr('viewBox', `0 0 ${this.containerWidth} ${this.containerHeight}`)
      .attr('width', this.containerWidth)
      .attr('height', this.containerHeight);
  }

  private updateAxis(): void {
    this.x
      .range([0, this.width])
      .domain(d3.extent(this.data, d => d.date));

    this.y
      .range([this.height, 0]);

    if (this.isMinYZero) {
      this.y
        .domain([0, d3.max(this.data, d => d.value)]);
    } else {
      this.y
        .domain(d3.extent(this.data, d => d.value));
    }

    this.updateAxisData(this.chartContainer.select('.axis--x'), d3.axisBottom(this.x));
    this.updateAxisData(this.chartContainer.select('.axis--y'), d3.axisLeft(this.y));
  }

  private updateChart(): void {
    this.updateAxis();
    this.updateChartData(this.chartContainer.selectAll('.line'), this.line);
    this.updateChartData(this.chartContainer.selectAll('.area'), this.area);
  }

  private updateAxisData = (elem, options) => elem
    .transition()
    .duration(300)
    .ease(d3.easeLinear)
    .call(options);

  private updateChartData = (elem, option) => elem
    .data([this.data])
    .transition()
    .duration(300)
    .ease(d3.easeLinear)
    .attr('d', option);
}
