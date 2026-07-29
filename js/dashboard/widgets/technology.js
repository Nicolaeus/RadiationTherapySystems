/*
==============================================================================
Radiotherapy Equipment Database
Dashboard Technology Widget

Author : N N
==============================================================================
*/

'use strict';

const TechnologyWidget = {};

/*==============================================================================
 Render
==============================================================================*/

TechnologyWidget.render = function () {

    const stats = DashboardStatistics.get();

    const section = document.createElement("section");

    section.className = "dashboard-card";

    const title = document.createElement("h2");

    title.className = "dashboard-card-title";

    title.textContent = "Technologies";

    section.appendChild(title);

    const body = document.createElement("div");

    body.className = "technology-list";

    const entries = DashboardStatistics

        .sorted(stats.technologies);

    const max = entries.length > 0

        ? entries[0][1]

        : 1;

    entries.forEach(([name, value]) => {

        body.appendChild(

            this.createRow(

                name,

                value,

                max

            )

        );

    });

    section.appendChild(body);

    return section;

};

/*==============================================================================
 Row
==============================================================================*/

TechnologyWidget.createRow = function (

    name,

    value,

    max

) {

    const row = document.createElement("div");

    row.className = "technology-row";

    const percent =

        (value / max) * 100;

    row.innerHTML = `

        <div class="technology-header">

            <span class="technology-name">

                ${name}

            </span>

            <span class="technology-value">

                ${value}

            </span>

        </div>

        <div class="technology-bar">

            <div
                class="technology-bar-fill"
                style="width:${percent}%">
            </div>

        </div>

    `;

    return row;

};

/*==============================================================================
 End
==============================================================================*/