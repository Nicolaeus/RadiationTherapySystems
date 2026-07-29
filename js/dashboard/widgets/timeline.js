/*
==============================================================================
Radiotherapy Equipment Database
Dashboard Timeline Widget

Author : N N
==============================================================================
*/

'use strict';

const TimelineWidget = {};

/*==============================================================================
 Render
==============================================================================*/

TimelineWidget.render = function () {

    const stats = DashboardStatistics.get();

    const section = document.createElement("section");

    section.className = "dashboard-card dashboard-timeline";

    const title = document.createElement("h2");

    title.className = "dashboard-card-title";

    title.textContent = "Installation Timeline";

    section.appendChild(title);

    const chart = document.createElement("div");

    chart.className = "timeline-chart";

    const years = Object.entries(stats.timeline)

        .sort(

            (a, b) =>

                Number(a[0]) -

                Number(b[0])

        );

    if (years.length === 0) {

        chart.innerHTML = `

            <div class="timeline-empty">

                No installation dates available.

            </div>

        `;

        section.appendChild(chart);

        return section;

    }

    const max = Math.max(

        ...years.map(

            y => y[1]

        )

    );

    years.forEach(([year, count]) => {

        chart.appendChild(

            this.createBar(

                year,

                count,

                max

            )

        );

    });

    section.appendChild(chart);

    return section;

};

/*==============================================================================
 Bar
==============================================================================*/

TimelineWidget.createBar = function (

    year,

    count,

    max

) {

    const item = document.createElement("div");

    item.className = "timeline-item";

    const height =

        Math.max(

            8,

            (count / max) * 160

        );

    item.innerHTML = `

        <div class="timeline-count">

            ${count}

        </div>

        <div
            class="timeline-bar"
            style="height:${height}px">
        </div>

        <div class="timeline-year">

            ${year}

        </div>

    `;

    return item;

};

/*==============================================================================
 Highlight latest year
==============================================================================*/

TimelineWidget.latestYear = function () {

    const timeline =

        DashboardStatistics

            .get()

            .timeline;

    const years =

        Object.keys(timeline)

            .map(Number);

    if (years.length === 0)
        return null;

    return Math.max(...years);

};

/*==============================================================================
 Earliest year
==============================================================================*/

TimelineWidget.firstYear = function () {

    const timeline =

        DashboardStatistics

            .get()

            .timeline;

    const years =

        Object.keys(timeline)

            .map(Number);

    if (years.length === 0)
        return null;

    return Math.min(...years);

};

/*==============================================================================
 End
==============================================================================*/