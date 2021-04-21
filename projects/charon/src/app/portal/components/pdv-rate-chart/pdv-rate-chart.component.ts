import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Compiler,
  Component,
  ElementRef,
  Injector,
  Input,
  OnChanges,
} from '@angular/core';
import * as Highcharts from 'highcharts';

import { ComponentFactoryClass } from './utils/component-factory';
import { TooltipComponent } from './tooltip/tooltip.component';
import { TooltipModule } from './tooltip';

export type PdvChartPoint = Record<number, number>;

@Component({
  selector: 'app-pdv-rate-chart',
  templateUrl: './pdv-rate-chart.component.html',
  styleUrls: ['./pdv-rate-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PdvRateChartComponent implements AfterViewInit, OnChanges {
  @Input() data: PdvChartPoint[];

  constructor(
    private injector: Injector,
    private compiler: Compiler,
    private elementRef: ElementRef<HTMLElement>,
  ) {
  }

  public ngOnInit(): void {
    this.paintChart();
  }
  public ngAfterViewInit(): void {
    this.paintChart();
  }

  public ngOnChanges(): void {
    this.paintChart();
  }

  private paintChart(): void {
    Highcharts.chart(this.elementRef.nativeElement, this.setChartOptions());
  }

  private setChartOptions(): Highcharts.Options {
    const component = new ComponentFactoryClass<TooltipModule, TooltipComponent>
    (this.injector, this.compiler).createComponent(TooltipModule, TooltipComponent);

    const defaultOptions: Highcharts.Options = {
      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
      time: {
        useUTC: false,
      },
      title: {
        text: '',
      },
    };

    return {
      ...defaultOptions,
      chart: {
        height: 250,
        marginBottom: 20,
        marginLeft: 10,
        marginRight: 45,
        marginTop: 10,
      },
      tooltip: {
        backgroundColor: '#FFFFFF',
        borderColor: '#EDEDEE',
        borderRadius: 12,
        borderWidth: 2,
        enabled: true,
        headerShape: 'square',
        shadow: false,
        formatter(): string {
          component.instance.data = this;
          component.changeDetectorRef.detectChanges();
          return component.location.nativeElement.outerHTML;
        },
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              [0, 'rgba(159, 101, 253, .24)'],
              [1, 'rgba(159, 101, 253, 0)'],
            ],
          },
          lineWidth: 2,
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: true,
                radius: 5,
              },
            },
          },
          states: {
            hover: {
              lineWidth: 2,
            },
          },
          threshold: null,
        },
      },
      series: [
        {
          color: '#9F65FD',
          data: this.data,
          type: 'area',
        },
      ],
      xAxis: {
        dateTimeLabelFormats: {
          millisecond: '%H:%M:%S.%L',
          second: '%H:%M:%S',
          minute: '%H:%M',
          hour: '%H:%M',
          day: '%e %b',
          week: '%e %b',
          month: '%b \'%y',
          year: '%Y',
        },
        labels: {
          enabled: true,
          style: {
            color: '#B6B7BA',
            fontSize: '12px',
          },
        },
        type: 'datetime',
        title: {
          text: '',
        },
      },
      yAxis: {
        alignTicks: true,
        visible: true,
        opposite: true,
        endOnTick: true,
        gridLineColor: '#EDEDEE',
        labels: {
          enabled: true,
          align: 'left',
          step: 2,
          x: 8,
          y: -8,
          style: {
            color: '#B6B7BA',
            fontSize: '12px',
          },

        },
        tickAmount: 8,
        tickPosition: 'inside',
        title: {
          text: '',
        },
        showLastLabel: false,
      },
    };
  }
}

