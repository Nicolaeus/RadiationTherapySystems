/*
==============================================================================
Radiotherapy Equipment Database
Search Engine

Author : N N
==============================================================================*/

'use strict';

const Search = {

    lastQuery: "",

    currentResults: [],

    filters: {

        manufacturer: null,

        technology: null,

        country: null,

        status: null

    },

    sort: {

        field: "name",

        ascending: true

    }

};

/*==============================================================================
 Main search
==============================================================================*/

Search.search = function (query = "") {

    this.lastQuery = query.trim();

    let machines = Database.getMachines();

    machines = this.applyFilters(machines);

    if (this.lastQuery !== "") {

        machines = Database.search(this.lastQuery);

        machines = this.applyFilters(machines);

    }

    machines = Database.sort(

        machines,

        this.sort.field,

        this.sort.ascending

    );

    this.currentResults = machines;

    Viewer.populateMachineList(machines);
	
	if (App.currentView === "dashboard") {

		showView("list");

	}

    this.updateResultCount();

};

/*==============================================================================
 Filters
==============================================================================*/

Search.applyFilters = function (machines) {

    return machines.filter(machine => {

        if (

            this.filters.manufacturer &&
            machine.manufacturerId !== this.filters.manufacturer

        )
            return false;

        if (

            this.filters.technology &&
            machine.technology?.type !== this.filters.technology

        )
            return false;

        if (

            this.filters.country &&
            machine.country !== this.filters.country

        )
            return false;

        if (

            this.filters.status &&
            machine.status !== this.filters.status

        )
            return false;

        return true;

    });

};

/*==============================================================================
 Manufacturer
==============================================================================*/

Search.filterManufacturer = function (manufacturerId) {

    this.filters.manufacturer = manufacturerId;

    this.search(this.lastQuery);

};

/*==============================================================================
 Technology
==============================================================================*/

Search.filterTechnology = function (technology) {

    this.filters.technology = technology;

    this.search(this.lastQuery);

};

/*==============================================================================
 Country
==============================================================================*/

Search.filterCountry = function (country) {

    this.filters.country = country;

    this.search(this.lastQuery);

};

/*==============================================================================
 Status
==============================================================================*/

Search.filterStatus = function (status) {

    this.filters.status = status;

    this.search(this.lastQuery);

};

/*==============================================================================
 Reset
==============================================================================*/

Search.clearFilters = function () {

    this.filters = {

        manufacturer: null,

        technology: null,

        country: null,

        status: null

    };

    this.search(this.lastQuery);

};

/*==============================================================================
 Sorting
==============================================================================*/

Search.setSort = function (

    field,

    ascending = true

) {

    this.sort.field = field;

    this.sort.ascending = ascending;

    this.search(this.lastQuery);

};

/*==============================================================================
 Result counter
==============================================================================*/

Search.updateResultCount = function () {

    const element = document.getElementById("result-count");

    if (!element)
        return;

    element.textContent =
        this.currentResults.length +
        " machine(s)";

};

/*==============================================================================
 Suggestions
==============================================================================*/

Search.suggestions = function (query) {

    query = query.toLowerCase();

    if (query.length < 2)
        return [];

    const suggestions = [];

    Database.getMachines().forEach(machine => {

        const values = [

            machine.name,

            machine.model,

            machine.manufacturer,

            machine.country,

            machine.status,

            machine.technology?.type

        ];

        values.forEach(value => {

            if (!value)
                return;

            const text = value.toString();

            if (

                text.toLowerCase().startsWith(query) &&
                !suggestions.includes(text)

            ) {

                suggestions.push(text);

            }

        });

    });

    return suggestions.sort().slice(0, 10);

};

/*==============================================================================
 Highlight
==============================================================================*/

Search.highlight = function (

    text,

    query

) {

    if (!query)
        return text;

    const regex = new RegExp(

        "(" + query + ")",

        "ig"

    );

    return text.replace(

        regex,

        "<mark>$1</mark>"

    );

};

/*==============================================================================
 Search box
==============================================================================*/

Search.bindSearchBox = function () {

    const input = document.getElementById("search");

    if (!input)
        return;

    input.addEventListener(

        "input",

        event => {

            this.search(event.target.value);

        }

    );

};

/*==============================================================================
 Search by id
==============================================================================*/

Search.byId = function (id) {

    return Database.getMachine(id);

};

/*==============================================================================
 Search by manufacturer
==============================================================================*/

Search.byManufacturer = function (manufacturer) {

    return Database.byManufacturer(manufacturer);

};

/*==============================================================================
 Search by technology
==============================================================================*/

Search.byTechnology = function (technology) {

    return Database.byTechnology(technology);

};

/*==============================================================================
 Search by country
==============================================================================*/

Search.byCountry = function (country) {

    return Database.byCountry(country);

};

/*==============================================================================
 Search by status
==============================================================================*/

Search.byStatus = function (status) {

    return Database.byStatus(status);

};

/*==============================================================================
 Export current results
==============================================================================*/

Search.exportResults = function () {

    const json = JSON.stringify(

        this.currentResults,

        null,

        4

    );

    const blob = new Blob(

        [json],

        {

            type: "application/json"

        }

    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "search_results.json";

    a.click();

    URL.revokeObjectURL(url);

};

/*==============================================================================
 Statistics
==============================================================================*/

Search.statistics = function () {

    return {

        total: this.currentResults.length,

        manufacturers: [

            ...new Set(

                this.currentResults.map(

                    m => m.manufacturer

                )

            )

        ].length,

        countries: [

            ...new Set(

                this.currentResults.map(

                    m => m.country

                )

            )

        ].length,

        technologies: [

            ...new Set(

                this.currentResults.map(

                    m => m.technology?.type

                )

            )

        ].length

    };

};

/*==============================================================================
 Initialize
==============================================================================*/

Search.init = function () {

    this.bindSearchBox();

    this.search("");

};

/*==============================================================================
 End
==============================================================================*/