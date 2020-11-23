import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild
} from '@angular/core';
import * as d3 from 'd3';
import { ChartPoint } from '../../models/chart-point.model';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent implements AfterViewInit {

  @HostListener('window:resize', ['$event.target']) onResize() {
    this.resizeWorks();
  }

  @ViewChild('chart', { static: false }) chartRef: ElementRef;

  @Input() public data: ChartPoint[];
  @Input() private color: string;
  @Input() private isMinYZero: boolean = false;

  private containerWidth: number;
  private containerHeight: number;
  private width: number;
  private height: number;
  private margin = { top: 0, right: 5, bottom: 0, left: 5 };

  private svg: any;
  private x: any;
  private y: any;
  private line: d3.Line<ChartPoint>;
  private area: d3.Area<ChartPoint>;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setChartSize();
      this.createSvg();
      this.createAxis();
      // this.drawAxis();
      this.drawLine();
      this.drawArea();
    }, 0);
  }

  private resizeWorks(): void {
    this.setChartSize();
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
      .append('svg')
      .attr("viewBox", `0 0 ${this.containerWidth} ${this.containerHeight}`)
      .attr("width", this.containerWidth)
      .attr("height", this.containerHeight)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  private createAxis(): void {
    // Create the X-axis scale
    this.x = d3.scaleUtc();

    // Create the Y-axis scale
    this.y = d3.scaleLinear();

    this.updateAxis();
  }

  private drawAxis(): void {
    // Draw the X-axis on the DOM
    this.svg.append('g')
      .attr('transform', `translate(0,${this.height})`)
      .attr('class', 'axis axis--x')
      .call(d3.axisBottom(this.x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-30)")
      .style("text-anchor", "end");

    // Draw the Y-axis on the DOM
    this.svg.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(this.y));
  }

  private drawLine(): void {
    this.line = d3.line<ChartPoint>()
      .defined(d => !isNaN(d.value))
      .x(d => this.x(d.date))
      .y(d => this.y(d.value));

    this.svg.append('path')
      .datum(this.data)
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', this.color)
      .attr('stroke-width', 2)
      .attr('d', this.line)
  }

  private drawArea(): void {
    this.area = d3.area<ChartPoint>()
      .x(d => this.x(d.date))
      .y0(this.height)
      .y1((d: any) => this.y(d.value));

    this.svg.append('path')
      .datum(this.data)
      .attr('class', 'area')
      .attr('fill', this.color)
      .attr('opacity', '0.105')
      .attr('stroke', 'none')
      .attr('d', this.area);
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

    this.svg.select(".axis--x")
      .transition()
      .duration(300)
      .ease(d3.easeLinear)
      .call(d3.axisBottom(this.x));

    this.svg.select(".axis--y")
      .transition()
      .duration(300)
      .ease(d3.easeLinear)
      .call(d3.axisLeft(this.y));
  }

  private updateChart(): void {
    this.updateAxis();

    this.svg.selectAll(".line")
      .data([this.data])
      .transition()
      .duration(300)
      .ease(d3.easeLinear)
      .attr('d', this.line);

    this.svg.selectAll(".area")
      .data([this.data])
      .transition()
      .duration(300)
      .ease(d3.easeLinear)
      .attr('d', this.area);
  }
}
