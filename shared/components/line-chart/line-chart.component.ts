import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as d3 from 'd3';

import { coerceTimestamp } from '../../utils/date';
import { observeResize } from '../../utils/observe-resize';
import { ChartPoint } from './line-chart.module';
import { LineChartTooltipDirective } from './line-chart-tooltip.directive';

@UntilDestroy()
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent implements AfterViewInit, OnChanges {
  @ContentChild(LineChartTooltipDirective, { static: false, read: TemplateRef }) tooltipRef: TemplateRef<unknown>;

  @ViewChild('tooltipContainer', { static: true }) tooltipContainerRef: ElementRef;

  @ViewChild('chart', { static: false }) chartRef: ElementRef;

  @Input() public data: ChartPoint[];

  @Input() private color: string = '#000000';

  @Input() private isMinYZero: boolean = false;

  @Input() private lineWidth: number = 2;

  @Input() private showArea: boolean = false;

  @Input() private showHoverLine: boolean = false;

  @Input() private showTooltip: boolean = false;

  @Output() public chartPointHovered: EventEmitter<ChartPoint> = new EventEmitter();

  private containerHeight: number;

  private containerWidth: number;

  private height: number;

  private margin = {
    bottom: 5,
    left: 5,
    right: 5,
    top: 5,
  };

  private width: number;

  private chartContainer: d3.Selection<SVGSVGElement, unknown, null, undefined>;

  public chartPointActive: ChartPoint;

  private hoverLine: d3.Selection<SVGGElement, unknown, null, undefined>;

  private onMouserMoveSubj = new Subject<MouseEvent>();

  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;

  private tooltip: d3.Selection<Element, unknown, HTMLElement, unknown>;

  private area: d3.Area<ChartPoint>;

  private line: d3.Line<ChartPoint>;

  private x: d3.ScaleTime<number, number>;

  private y: d3.ScaleLinear<number, number>;

  private bisectDate = d3.bisector((d: ChartPoint): Date => {
    return new Date(d.date);
  }).center;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {
  }

  public ngAfterViewInit(): void {
    this.setChartSize();
    this.createSvg();
    this.createAxis();
    this.drawLine();

    if (this.showArea) {
      this.drawArea();
    }

    observeResize(this.chartRef.nativeElement).pipe(
      untilDestroyed(this),
    ).subscribe(() => this.repaint());

    this.onMouserMoveSubj.pipe(
      throttleTime(10),
      untilDestroyed(this),
    ).subscribe((event) => this.onMouseMove(event));
  }

  public ngOnChanges({ data }: SimpleChanges): void {
    if (data) {
      this.data = data.currentValue;
      if (this.svg) {
        this.repaint();
      }
    }
  }

  private repaint(): void {
    this.setChartSize();
    this.updateSvgDimensions();
    this.updateChart();
  }

  private setChartSize(): void {
    this.containerWidth = this.chartRef.nativeElement.clientWidth;
    this.containerHeight = this.chartRef.nativeElement.clientHeight;

    this.width = Math.max(this.containerWidth - this.margin.left - this.margin.right, 0);
    this.height = Math.max(this.containerHeight - this.margin.top - this.margin.bottom, 0);
  }

  private addGradient(): void {
    const svgDefs = this.svg.append('defs');

    const whiteChartGradient = svgDefs.append('linearGradient')
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '0%')
      .attr('y2', '100%')
      .attr('id', 'whiteChartGradient');

    whiteChartGradient.append('stop')
      .attr('stop-color', 'rgba(255, 255, 255, 0.4)')
      .attr('offset', '0');

    whiteChartGradient.append('stop')
      .attr('class', 'stop-right')
      .attr('stop-color', 'rgba(255, 255, 255, 0)')
      .attr('offset', '1');
  }

  private createSvg(): void {
    this.svg = d3.select(this.chartRef.nativeElement)
      .append('svg');

    this.addGradient();
    this.updateSvgDimensions();

    this.svg
      .append('g')
      .attr('class', 'chart-container')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    this.svg
      .append('rect')
      .attr('transform', `translate(${this.margin.left}, -${this.margin.top})`)
      .attr('class', 'overlay')
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .attr('width', this.width)
      .attr('height', this.height)
      .on('mouseenter', this.onMouseEnter)
      .on('mousemove', (event) => this.onMouserMoveSubj.next(event))
      .on('mouseleave', this.onMouseLeave);

    this.chartContainer = d3.select(this.chartRef.nativeElement).select('.chart-container');

    if (this.showHoverLine) {
      this.hoverLine = this.chartContainer
        .append('g')
        .attr('class', 'hover-line-items')
        .attr('pointer-events', 'none');
    }

    if (this.showTooltip) {
      this.tooltip = d3.select(this.tooltipContainerRef.nativeElement);
    }
  }

  public onMouseEnter = (): void => {
    if (this.showHoverLine) {
      this.hoverLine.append('line')
        .attr('class', 'hover-line')
        .attr('stroke', this.color)
        .attr('stroke-width', '1px')
        .attr('y1', 0)
        .attr('y2', this.height);

      this.hoverLine.append('circle')
        .attr('class', 'hover-circle')
        .attr('r', 3)
        .attr('fill', this.color);
    }

    if (this.showTooltip) {
      this.tooltip.style('visibility', 'visible');
    }

    this.cdRef.detectChanges();
  };

  public onMouseMove = (event: MouseEvent): void => {
    const positionX = d3.pointer(event)[0];
    const invertedX = this.x.invert(positionX);
    const index = this.bisectDate(this.data, invertedX, 1);
    const leftPoint = this.data[index - 1];
    const rightPoint = this.data[index];
    const hoverPoint: ChartPoint = (
      +coerceTimestamp(invertedX) - +coerceTimestamp(leftPoint.date) >
      +coerceTimestamp(rightPoint.date) - +coerceTimestamp(invertedX)
    ) ? rightPoint : leftPoint;
    const hoverPointX = Math.round(this.x(new Date(hoverPoint.date)));
    const hoverPointY = Math.round(this.y(hoverPoint.value));

    this.chartPointHovered.emit(hoverPoint);
    this.chartPointActive = hoverPoint;

    if (this.showTooltip) {
      const hoverPointXOffset = (hoverPointX < this.svg.node().clientWidth / 2)
        ? hoverPointX + this.margin.left * 2
        : hoverPointX - this.tooltip.node().clientWidth - this.margin.left;

      const hoverPointYOffset = (hoverPointY < this.svg.node().clientHeight / 2)
        ? hoverPointY + this.tooltip.node().clientHeight / 2 - this.margin.top
        : hoverPointY - this.tooltip.node().clientHeight / 2 + this.margin.top;

      this.tooltip
        .style('top', `${hoverPointYOffset}px`)
        .style('left', `${hoverPointXOffset}px`);
    }

    if (this.showHoverLine) {
      this.hoverLine
        .attr('transform', `translate(${hoverPointX}, 0)`)
        .select('.hover-circle')
        .attr('transform', `translate(0, ${this.y(hoverPoint.value)})`);
    }

    this.cdRef.detectChanges();
  };

  public onMouseLeave = (): void => {
    this.clearHoverItems();
  };

  private clearHoverItems(): void {
    if (this.showHoverLine) {
      this.hoverLine.selectAll('*').remove();
    }

    if (this.showTooltip) {
      this.tooltip.style('visibility', 'hidden');
    }

    this.chartPointHovered.emit(undefined);
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
      .attr('stroke-width', this.lineWidth)
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
      .attr('fill', 'url(#whiteChartGradient)')
      .attr('stroke', 'none')
      .attr('d', this.area);
  }

  private updateSvgDimensions(): void {
    this.svg
      .attr('viewBox', `0 0 ${this.containerWidth} ${this.containerHeight}`)
      .attr('width', this.containerWidth)
      .attr('height', this.containerHeight)
      .select('.overlay')
      .attr('width', this.width)
      .attr('height', this.height + this.margin.top + this.margin.bottom);
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

    if (this.showArea) {
      this.updateChartData(this.chartContainer.selectAll('.area'), this.area);
    }
  }

  private updateAxisData(elem, options): void {
    elem
      .call(options);
  }

  private updateChartData(elem, option): void {
    return elem
      .data([this.data])
      .attr('d', option);
  }
}
