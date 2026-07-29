/*
==============================================================================
Radiotherapy Equipment Database
Dashboard Metrics Widget

Author : N N
==============================================================================
*/

'use strict';

const MetricsWidget = {};

/*==============================================================================
 Render
==============================================================================*/

MetricsWidget.render = function () {

    const stats = DashboardStatistics.get();

    const section = document.createElement("section");

    section.className = "dashboard-metrics";

    section.append(

        this.createCard(
            "🖥️",
            `${stats.machines} / ${stats.activeMachines}`,
			"Models / En production"
        ),

        this.createCard(
            "🏭",
            stats.manufacturers,
            "Manufacturers"
        ),

        this.createCard(
            "🌍",
            Object.keys(stats.countries).length,
            "Countries"
        ),

        this.createCard(
            "⚙️",
            Object.keys(stats.technologies).length,
            "Technologies"
        )

    );

    return section;

};

/*==============================================================================
 Metric card
==============================================================================*/

MetricsWidget.createCard = function (

    icon,
    value,
    label

) {

    const card = document.createElement("div");

    card.className = "metric-card";

    card.innerHTML = `

        <div class="metric-icon">

            ${icon}

        </div>

        <div class="metric-value">

            ${value}

        </div>

        <div class="metric-label">

            ${label}

        </div>

    `;

    return card;

};

/*==============================================================================
 End
==============================================================================*/