/*
==============================================================================
Radiotherapy Equipment Database
Dashboard
==============================================================================
*/

'use strict';

const Dashboard = {};

/*==============================================================================
 Render
==============================================================================*/

Dashboard.render = function () {
	
	console.trace("Dashboard.render()");

    const container = document.getElementById("dashboard-view");

    if (!container)
        return;

    container.innerHTML = "";

    /*container.appendChild(HeroWidget.render());*/

    container.appendChild(MetricsWidget.render());

    const row = document.createElement("div");

    row.className = "dashboard-row";

    row.appendChild(TechnologyWidget.render());
    row.appendChild(ProductionWidget.render());

    container.appendChild(row);

    container.appendChild(TimelineWidget.render());

};

/*==============================================================================
 Refresh
==============================================================================*/

Dashboard.refresh = function () {

    this.render();

};

/*==============================================================================
 Init
==============================================================================*/

Dashboard.init = function () {

    this.refresh();

};
