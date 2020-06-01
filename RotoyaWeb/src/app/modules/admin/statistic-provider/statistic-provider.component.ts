import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-statistic-provider',
    templateUrl: './statistic-provider.component.html'
})
export class StatisticProviderComponent implements OnInit {
    multi: any[];
    view: any[] = [1000];

    // options
    legend: boolean = true;
    showLabels: boolean = true;
    animations: boolean = true;
    xAxis: boolean = true;
    yAxis: boolean = true;
    showYAxisLabel: boolean = true;
    showXAxisLabel: boolean = true;
    xAxisLabel: string = 'Year';
    yAxisLabel: string = 'Population';
    timeline: boolean = true;

    colorScheme = {
        domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
    };
    constructor() {
    }

    ngOnInit(): void {
        this.multi = [
            {
                "name": "San Marino",
                "series": [
                    {
                        "value": 2063,
                        "name": "2016-09-20T17:42:00.086Z"
                    },
                    {
                        "value": 4413,
                        "name": "2016-09-17T08:35:29.583Z"
                    },
                    {
                        "value": 4309,
                        "name": "2016-09-14T22:59:27.735Z"
                    },
                    {
                        "value": 6339,
                        "name": "2016-09-15T05:59:14.449Z"
                    },
                    {
                        "value": 2049,
                        "name": "2016-09-23T12:27:27.249Z"
                    }
                ]
            },
            {
                "name": "Saint Kitts and Nevis",
                "series": [
                    {
                        "value": 3965,
                        "name": "2016-09-20T17:42:00.086Z"
                    },
                    {
                        "value": 6477,
                        "name": "2016-09-17T08:35:29.583Z"
                    },
                    {
                        "value": 4883,
                        "name": "2016-09-14T22:59:27.735Z"
                    },
                    {
                        "value": 2800,
                        "name": "2016-09-15T05:59:14.449Z"
                    },
                    {
                        "value": 2720,
                        "name": "2016-09-23T12:27:27.249Z"
                    }
                ]
            },
            {
                "name": "Libya",
                "series": [
                    {
                        "value": 3801,
                        "name": "2016-09-20T17:42:00.086Z"
                    },
                    {
                        "value": 3570,
                        "name": "2016-09-17T08:35:29.583Z"
                    },
                    {
                        "value": 4840,
                        "name": "2016-09-14T22:59:27.735Z"
                    },
                    {
                        "value": 3046,
                        "name": "2016-09-15T05:59:14.449Z"
                    },
                    {
                        "value": 4737,
                        "name": "2016-09-23T12:27:27.249Z"
                    }
                ]
            },
            {
                "name": "Uzbekistan",
                "series": [
                    {
                        "value": 5592,
                        "name": "2016-09-20T17:42:00.086Z"
                    },
                    {
                        "value": 2298,
                        "name": "2016-09-17T08:35:29.583Z"
                    },
                    {
                        "value": 2334,
                        "name": "2016-09-14T22:59:27.735Z"
                    },
                    {
                        "value": 2064,
                        "name": "2016-09-15T05:59:14.449Z"
                    },
                    {
                        "value": 5935,
                        "name": "2016-09-23T12:27:27.249Z"
                    }
                ]
            },
            {
                "name": "Isle of Man",
                "series": [
                    {
                        "value": 5519,
                        "name": "2016-09-20T17:42:00.086Z"
                    },
                    {
                        "value": 3203,
                        "name": "2016-09-17T08:35:29.583Z"
                    },
                    {
                        "value": 4337,
                        "name": "2016-09-14T22:59:27.735Z"
                    },
                    {
                        "value": 2776,
                        "name": "2016-09-15T05:59:14.449Z"
                    },
                    {
                        "value": 4415,
                        "name": "2016-09-23T12:27:27.249Z"
                    }
                ]
            }
        ]
    }

    onSelect(data): void {
        console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    }

    onActivate(data): void {
        console.log('Activate', JSON.parse(JSON.stringify(data)));
    }

    onDeactivate(data): void {
        console.log('Deactivate', JSON.parse(JSON.stringify(data)));
    }
}
