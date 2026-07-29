/*
==============================================================================
Radiotherapy Equipment Database
Dashboard Production Widget

Author : N N
==============================================================================
*/

'use strict';

const ProductionWidget = {};

/*==============================================================================
 Render
==============================================================================*/

ProductionWidget.render = function () {

    const stats = DashboardStatistics.get();

    const section = document.createElement("section");

    section.className = "dashboard-card";

    const title = document.createElement("h2");

    title.className = "dashboard-card-title";

    title.textContent = "Production Status";

    section.appendChild(title);

    const body = document.createElement("div");

    body.className = "production-list";

    const entries = DashboardStatistics

        .sorted(stats.production);

    const max = entries.length > 0

        ? entries[0][1]

        : 1;

    entries.forEach(([status, value]) => {

        body.appendChild(

            this.createRow(

                status,

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

ProductionWidget.createRow = function (

    status,

    value,

    max

) {

    const row = document.createElement("div");

    row.className = "production-row";

    const percent =

        (value / max) * 100;

    row.innerHTML = `

        <div class="production-header">

            <span class="production-badge ${this.statusClass(status)}">

                ${status}

            </span>

            <span class="production-value">

                ${value}

            </span>

        </div>

        <div class="production-bar">

            <div
                class="production-bar-fill ${this.statusClass(status)}"
                style="width:${percent}%">
            </div>

        </div>

    `;

    return row;

};

/*==============================================================================
 Status class
==============================================================================*/

ProductionWidget.statusClass = function (status) {

    switch ((status || "").toUpperCase()) {

        case "ACTIVE":
            return "status-active";

        case "DISCONTINUED":
            return "status-discontinued";

        case "PROTOTYPE":
            return "status-prototype";

        case "FUTURE":
            return "status-future";

        default:
            return "status-unknown";

    }

};

/*==============================================================================
 End
==============================================================================*/