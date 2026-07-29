/*
==============================================================================
Radiotherapy Equipment Database
Dashboard Hero Widget

Author : N N
==============================================================================
*/

'use strict';

const HeroWidget = {};

/*==============================================================================
 Render
==============================================================================*/

HeroWidget.render = function () {

    const stats = DashboardStatistics.get();

    const hero = document.createElement("section");

    hero.className = "dashboard-hero";

    hero.innerHTML = `

        <div class="dashboard-hero-content">

            <h1 class="dashboard-title">

                Radiotherapy Equipment Database

            </h1>

            <p class="dashboard-subtitle">

                The worldwide radiotherapy equipment knowledge base

            </p>

            <div class="dashboard-summary">

                <span>

                    <strong>${stats.machines}</strong>
                    machines

                </span>

                <span class="separator">•</span>

                <span>

                    <strong>${stats.manufacturers}</strong>
                    manufacturers

                </span>

                <span class="separator">•</span>

                <span>

                    <strong>${Object.keys(stats.countries).length}</strong>
                    countries

                </span>

                <span class="separator">•</span>

                <span>

                    <strong>${Object.keys(stats.technologies).length}</strong>
                    technologies

                </span>

            </div>

        </div>

    `;

    return hero;

};

/*==============================================================================
 End
==============================================================================*/