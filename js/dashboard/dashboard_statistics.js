/*
==============================================================================
Radiotherapy Equipment Database
Dashboard statistics

Author : N N
==============================================================================
*/

'use strict';

const DashboardStatistics = {};

/*==============================================================================
 Main
==============================================================================*/

DashboardStatistics.get = function () {

    const machines = Database.getMachines();

    const manufacturers = Database.getManufacturers();
	
	const activeMachines = machines.filter(
    machine => machine.production_status === "Active" || machine.production_status === "In Production"
);

return {

    machines: machines.length,

    activeMachines: activeMachines.length,

    manufacturers: manufacturers.length,

    countries: this.countCountries(machines),

    technologies: this.countTechnologies(machines),

    production: this.countProduction(machines),

    timeline: this.buildTimeline(machines)

};

};


/*==============================================================================
 Countries
==============================================================================*/

DashboardStatistics.countCountries = function (machines) {

    const result = {};

    machines.forEach(machine => {

        const country = machine.manufacturer_country || "Unknown";

        result[country] = (result[country] || 0) + 1;

    });

    return result;

};

/*==============================================================================
 Technologies
==============================================================================*/

DashboardStatistics.countTechnologies = function (machines) {

    const result = {};

    machines.forEach(machine => {

        const tech =

            machine.technology?.type ||

            "Unknown";

        result[tech] = (result[tech] || 0) + 1;

    });

    return result;

};

/*==============================================================================
 Production
==============================================================================*/

DashboardStatistics.countProduction = function (machines) {

    const result = {};

    machines.forEach(machine => {

        const status =

            machine.production_status ||

            "UNKNOWN";

        result[status] = (result[status] || 0) + 1;

    });

    return result;

};

/*==============================================================================
 Timeline
==============================================================================*/

DashboardStatistics.buildTimeline = function (machines) {

    const result = {};

    machines.forEach(machine => {

        const year = machine.installation_start;

        if (!year)
            return;

        result[year] = (result[year] || 0) + 1;

    });

    return result;

};

/*==============================================================================
 Sorted helpers
==============================================================================*/

DashboardStatistics.sorted = function (object) {

    return Object.entries(object)

        .sort(

            (a, b) => b[1] - a[1]

        );

};

/*==============================================================================
 Totals
==============================================================================*/

DashboardStatistics.totalCountries = function () {

    return Object.keys(

        this.get().countries

    ).length;

};

DashboardStatistics.totalTechnologies = function () {

    return Object.keys(

        this.get().technologies

    ).length;

};

/*==============================================================================
 Top manufacturers
==============================================================================*/

DashboardStatistics.topManufacturers = function (

    limit = 10

) {

    return Database

        .getManufacturers()

        .sort(

            (a, b) =>

                b.machines.length -

                a.machines.length

        )

        .slice(0, limit);

};

/*==============================================================================
 Newest machines
==============================================================================*/

DashboardStatistics.latestMachines = function (

    limit = 10

) {

    return Database

        .getMachines()

        .filter(

            machine =>

                machine.installation_start

        )

        .sort(

            (a, b) =>

                b.installation_start -

                a.installation_start

        )

        .slice(0, limit);

};

/*==============================================================================
 Oldest machines
==============================================================================*/

DashboardStatistics.oldestMachines = function (

    limit = 10

) {

    return Database

        .getMachines()

        .filter(

            machine =>

                machine.installation_start

        )

        .sort(

            (a, b) =>

                a.installation_start -

                b.installation_start

        )

        .slice(0, limit);

};

/*==============================================================================
 End
==============================================================================*/