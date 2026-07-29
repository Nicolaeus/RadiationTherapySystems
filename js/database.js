/*
==============================================================================
Radiotherapy Equipment Database
Database Manager

Author : N N
==============================================================================*/

'use strict';

const Database = {

    //--------------------------------------------------------------------------
    // Raw database
    //--------------------------------------------------------------------------

    database: {

        machines: []

    },

    //--------------------------------------------------------------------------
    // Runtime indexes
    //--------------------------------------------------------------------------

    machines: [],

    manufacturers: [],

    manufacturersMap: new Map(),

    machinesMap: new Map(),

    searchIndex: [],

    statistics: {}

};

/*==============================================================================
 Load database
==============================================================================*/

Database.load = async function () {

    //----------------------------------------------------------------------
    // Load manufacturers catalogue
    //----------------------------------------------------------------------

    const indexResponse = await fetch(

        "database/index.json"

    );

    if (!indexResponse.ok) {

        throw new Error(

            "Unable to load database/index.json"

        );

    }

    const index = await indexResponse.json();

    //----------------------------------------------------------------------
    // Reset database
    //----------------------------------------------------------------------

    this.database = {

        machines: []

    };

    //----------------------------------------------------------------------
    // Load every manufacturer file
    //----------------------------------------------------------------------

    for (const filename of index.manufacturers) {

        try {

            const response = await fetch(

                `database/${filename}`

            );

            if (!response.ok) {

                console.warn(

                    "Unable to load",

                    filename

                );

                continue;

            }

            const json = await response.json();

            //------------------------------------------------------------------
            // File = array of machines
            //------------------------------------------------------------------

            if (Array.isArray(json)) {

                this.database.machines.push(

                    ...json

                );

            }

            //------------------------------------------------------------------
            // File = single machine
            //------------------------------------------------------------------

            else {

                this.database.machines.push(

                    json

                );

            }

        }

        catch (error) {

            console.error(

                filename,

                error

            );

        }

    }

    //----------------------------------------------------------------------
    // Build runtime indexes
    //----------------------------------------------------------------------

    this.buildIndexes();

    console.log(

        "Manufacturers :",

        this.manufacturers.length

    );

    console.log(

        "Machines :",

        this.machines.length

    );

};

/*==============================================================================
 Build indexes
==============================================================================*/

Database.buildIndexes = function () {

    //----------------------------------------------------------------------
    // Reset runtime structures
    //----------------------------------------------------------------------

    this.machines = [];

    this.manufacturers = [];

    this.manufacturersMap.clear();

    this.machinesMap.clear();

    this.searchIndex = [];

    const manufacturers = new Map();

    //----------------------------------------------------------------------
    // Build indexes
    //----------------------------------------------------------------------

    this.database.machines.forEach(machine => {

        //--------------------------------------------------------------
        // Machine list
        //--------------------------------------------------------------

        this.machines.push(machine);

        this.machinesMap.set(

            machine.id,

            machine

        );

        //--------------------------------------------------------------
        // Search index
        //--------------------------------------------------------------

        this.searchIndex.push({

            id: machine.id,

            manufacturer: machine.manufacturer,

            text: this.createSearchString(machine)

        });

        //--------------------------------------------------------------
        // Manufacturer
        //--------------------------------------------------------------

        const manufacturerName =

            machine.manufacturer || "Unknown";

        if (

            !manufacturers.has(

                manufacturerName

            )

        ) {

            manufacturers.set(

                manufacturerName,

                {

                    id: manufacturerName,

                    name: manufacturerName,

                    machines: []

                }

            );

        }

        manufacturers

            .get(

                manufacturerName

            )

            .machines

            .push(machine);

    });

    //----------------------------------------------------------------------
    // Final manufacturer list
    //----------------------------------------------------------------------

    this.manufacturers =

        [...manufacturers.values()]

            .sort(

                (a, b) =>

                    a.name.localeCompare(

                        b.name

                    )

            );

    this.manufacturers.forEach(

        manufacturer => {

            this.manufacturersMap.set(

                manufacturer.id,

                manufacturer

            );

        }

    );

    //----------------------------------------------------------------------
    // Statistics
    //----------------------------------------------------------------------

    this.computeStatistics();

};

/*==============================================================================
 Search string
==============================================================================*/

Database.createSearchString = function (machine) {

    let text = "";

    Object.values(machine).forEach(value => {

        if (typeof value === "string") {

            text +=

                " " + value;

        }

        if (Array.isArray(value)) {

            text +=

                " " + value.join(" ");

        }

    });

    return text.toLowerCase();

};

/*==============================================================================
 Statistics
==============================================================================*/

Database.computeStatistics = function () {

    this.statistics = {

        machines:

            this.machines.length,

        manufacturers:

            this.manufacturers.length,

        technologies: {},

        countries: {},

        statuses: {}

    };

    this.machines.forEach(machine => {

        //--------------------------------------------------------------
        // Technology
        //--------------------------------------------------------------

        if (machine.technology?.type) {

            const type =

                machine.technology.type;

            this.statistics

                .technologies[type] ??= 0;

            this.statistics

                .technologies[type]++;

        }

        //--------------------------------------------------------------
        // Country
        //--------------------------------------------------------------

        if (machine.manufacturer_country) {

            const country =

                machine.manufacturer_country;

            this.statistics

                .countries[country] ??= 0;

            this.statistics

                .countries[country]++;

        }

        //--------------------------------------------------------------
        // Production status
        //--------------------------------------------------------------

        if (machine.production_status) {

            const status =

                machine.production_status;

            this.statistics

                .statuses[status] ??= 0;

            this.statistics

                .statuses[status]++;

        }

    });

};

/*==============================================================================
 Getters
==============================================================================*/

Database.getMachines = function () {

    return this.machines;

};

Database.getManufacturers = function () {

    return this.manufacturers;

};

Database.getMachine = function (id) {

    return this.machinesMap.get(id);

};

Database.getManufacturer = function (id) {

    return this.manufacturersMap.get(id);

};

Database.getStatistics = function () {

    return this.statistics;

};

/*==============================================================================
 Filters
==============================================================================*/

Database.byManufacturer = function (manufacturer) {

    return this.machines.filter(

        machine =>

            machine.manufacturer === manufacturer ||

            machine.manufacturerId === manufacturer

    );

};

Database.byTechnology = function (technology) {

    return this.machines.filter(

        machine =>

            machine.technology?.type === technology

    );

};

Database.byCountry = function (country) {

    return this.machines.filter(

        machine =>

            machine.manufacturer_country === country

    );

};

Database.byStatus = function (status) {

    return this.machines.filter(

        machine =>

            machine.production_status === status

    );

};

/*==============================================================================
 Search
==============================================================================*/

Database.search = function (query) {

    query = query.trim().toLowerCase();

    if (!query.length)

        return this.machines;

    return this.searchIndex

        .filter(item =>

            item.text.includes(query)

        )

        .map(item =>

            this.getMachine(item.id)

        );

};

/*==============================================================================
 Sort
==============================================================================*/

Database.sort = function (

    machines,

    field,

    ascending = true

) {

    return [...machines].sort((a, b) => {

        let av = a[field];

        let bv = b[field];

        //--------------------------------------------------------------
        // Undefined values
        //--------------------------------------------------------------

        if (av === undefined || av === null)

            av = "";

        if (bv === undefined || bv === null)

            bv = "";

        //--------------------------------------------------------------
        // Strings
        //--------------------------------------------------------------

        if (

            typeof av === "string" ||

            typeof bv === "string"

        ) {

            av = String(av);

            bv = String(bv);

            return ascending

                ? av.localeCompare(bv)

                : bv.localeCompare(av);

        }

        //--------------------------------------------------------------
        // Numbers
        //--------------------------------------------------------------

        return ascending

            ? av - bv

            : bv - av;

    });

};

/*==============================================================================
 Add machine
==============================================================================*/

Database.addMachine = function (

    manufacturer,

    machine

) {

    //--------------------------------------------------------------
    // Complete manufacturer field if missing
    //--------------------------------------------------------------

    if (!machine.manufacturer) {

        machine.manufacturer = manufacturer;

    }

    //--------------------------------------------------------------
    // Add machine
    //--------------------------------------------------------------

    this.database.machines.push(

        machine

    );

    //--------------------------------------------------------------
    // Refresh indexes
    //--------------------------------------------------------------

    this.buildIndexes();

};

/*==============================================================================
 Update machine
==============================================================================*/

Database.updateMachine = function (

    id,

    updated

) {

    const machine =

        this.getMachine(id);

    if (!machine)

        return;

    Object.assign(

        machine,

        updated

    );

    this.buildIndexes();

};

/*==============================================================================
 Delete machine
==============================================================================*/

Database.deleteMachine = function (id) {

    this.database.machines =

        this.database.machines.filter(

            machine =>

                machine.id !== id

        );

    this.buildIndexes();

};

/*==============================================================================
 Export
==============================================================================*/

Database.exportJSON = function () {

    return JSON.stringify(

        this.database.machines,

        null,

        4

    );

};

/*==============================================================================
 Save
==============================================================================*/

Database.save = function () {

    const blob = new Blob(

        [

            this.exportJSON()

        ],

        {

            type: "application/json"

        }

    );

    const url =

        URL.createObjectURL(blob);

    const a =

        document.createElement("a");

    a.href = url;

    a.download = "database.json";

    a.click();

    URL.revokeObjectURL(url);

};

/*==============================================================================
 Validate
==============================================================================*/

Database.validate = function () {

    const errors = [];

    const ids = new Set();

    this.machines.forEach(machine => {

        //----------------------------------------------------------------------
        // Mandatory fields
        //----------------------------------------------------------------------

        if (!machine.id) {

            errors.push(

                "Missing machine id"

            );

        }

        if (!machine.manufacturer) {

            errors.push(

                `${machine.id || "UNKNOWN"} : missing manufacturer`

            );

        }

        if (!machine.model) {

            errors.push(

                `${machine.id || "UNKNOWN"} : missing model`

            );

        }

        //----------------------------------------------------------------------
        // Duplicate ids
        //----------------------------------------------------------------------

        if (machine.id) {

            if (ids.has(machine.id)) {

                errors.push(

                    `Duplicate id : ${machine.id}`

                );

            }

            ids.add(machine.id);

        }

        //----------------------------------------------------------------------
        // Technology block
        //----------------------------------------------------------------------

        if (!machine.technology) {

            errors.push(

                `${machine.id} : missing technology block`

            );

        }

    });

    return errors;

};

/*==============================================================================
 Reload
==============================================================================*/

Database.reload = async function () {

    await this.load();

};

/*==============================================================================
 Debug
==============================================================================*/

Database.debug = function () {

    console.group(

        "Database"

    );

    console.log(

        "Machines :", this.machines.length

    );

    console.log(

        "Manufacturers :", this.manufacturers.length

    );

    console.log(

        "Statistics :", this.statistics

    );

    console.log(

        "Manufacturers list :",

        this.manufacturers

    );

    console.groupEnd();

};

/*==============================================================================
 Helpers
==============================================================================*/

Database.exists = function (id) {

    return this.machinesMap.has(id);

};

Database.count = function () {

    return this.machines.length;

};

Database.countManufacturers = function () {

    return this.manufacturers.length;

};

/*==============================================================================
 Initialization
==============================================================================*/

Database.initialize = async function () {

    await this.load();

    const errors = this.validate();

    if (errors.length) {

        console.warn(

            "Database validation :",

            errors.length,

            "issue(s)"

        );

        console.table(errors);

    }

    this.debug();

};

/*==============================================================================
 End
==============================================================================*/