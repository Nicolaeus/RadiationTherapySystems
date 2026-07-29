/*
==============================================================================
Radiotherapy Equipment Database
Application entry point

Author : N N
==============================================================================*/

'use strict';

/*==============================================================================
 Global namespace
==============================================================================*/

window.App = {

    version: "1.0.0",

    database: null,

    currentManufacturer: null,

    currentMachine: null,

    currentView: "dashboard",

    initialized: false

};

/*==============================================================================
 Bootstrap
==============================================================================*/

document.addEventListener("DOMContentLoaded", async () => {

    try {

        await initializeApplication();

    }
    catch (error) {

        console.error(error);

        alert(
            "Unable to initialize the application.\n\n" +
            error.message
        );

    }

});

/*==============================================================================
 Initialization
==============================================================================*/

async function initializeApplication() {

    console.log("==============================================");
    console.log("Radiotherapy Equipment Database");
    console.log("Version :", App.version);
    console.log("==============================================");

    initialiseViews();

    initialiseButtons();

    initialiseSearch();

    updateStatus("Loading database...");

    await Database.load();

    App.database = Database.database;

    Dashboard.render();

    Viewer.populateManufacturers();

    /*Viewer.populateMachineList();*/

    updateDatabaseVersion();

    updateStatistics();

    updateStatus("Ready");

    App.initialized = true;

}

/*==============================================================================
 Views
==============================================================================*/

function initialiseViews() {

    const views = [

        "dashboard-view",
        "machine-list-view",
        "machine-view",
        "editor-view",
        "compare-view"

    ];

    views.forEach(id => {

        const element = document.getElementById(id);

        if (element) {

            element.classList.remove("view-visible");

        }

    });

    showView("dashboard");

}

window.showView = function (view) {
	    console.log("showView:", view);

    document
        .querySelectorAll(
            "#dashboard-view,#machine-list-view,#machine-view,#editor-view,#compare-view"
        )
        .forEach(v => {
            v.classList.remove("view-visible");
            console.log(v.id, "=>", v.className);
        });

    const map = {

        dashboard: "dashboard-view",

        list: "machine-list-view",

        machine: "machine-view",

        editor: "editor-view",

        compare: "compare-view"

    };

    document
        .querySelectorAll(
            "#dashboard-view,#machine-list-view,#machine-view,#editor-view,#compare-view"
        )
        .forEach(v => v.classList.remove("view-visible"));

    const id = map[view];

    if (!id)
        return;

    document
        .getElementById(id)
        .classList.add("view-visible");

    App.currentView = view;

const element = document.getElementById(id);

element.classList.add("view-visible");

console.log("ACTIVE =", element.id);

};

/*==============================================================================
 Buttons
==============================================================================*/

function initialiseButtons() {

    // Navigation entre les vues
    document
        .querySelectorAll("[data-view]")
        .forEach(button => {

            button.addEventListener("click", () => {

                showView(button.dataset.view);

            });

        });

    // Actions
    document
        .querySelectorAll("[data-action]")
        .forEach(button => {

            button.addEventListener("click", () => {

                switch (button.dataset.action) {

                    case "new-machine":
                        newMachine();
                        break;

                    case "save":
                        saveMachine();
                        break;

                    case "git-commit":
                        Git.commit();
                        break;

                    case "git-push":
                        Git.push();
                        break;

                }

            });

        });

}
/*==============================================================================
 Search
==============================================================================*/

function initialiseSearch() {

    const search = document.getElementById("search");

    if (!search)
        return;

    search.addEventListener("input", event => {

        Search.search(event.target.value);

    });

}

/*==============================================================================
 Status bar
==============================================================================*/

window.updateStatus = function (text) {

    const element = document.getElementById("status-text");

    if (element)
        element.textContent = text;

};

/*==============================================================================
 Database version
==============================================================================*/

function updateDatabaseVersion() {

    const version = document.getElementById("database-version");

    if (!version)
        return;

    const manufacturers =
        Database.getManufacturers().length;

    const machines =
        Database.getMachines().length;

    version.textContent =
        manufacturers +
        " manufacturers • " +
        machines +
        " machines";

}

/*==============================================================================
 Dashboard statistics
==============================================================================*/

function updateStatistics() {

    const totalMachines =
        document.getElementById("stat-machines");

    const totalManufacturers =
        document.getElementById("stat-manufacturers");

    if (totalMachines)
        totalMachines.textContent =
            Database.getMachines().length;

    if (totalManufacturers)
        totalManufacturers.textContent =
            Database.getManufacturers().length;

}

/*==============================================================================
 Machine selection
==============================================================================*/

window.openMachine = function (id) {

    App.currentMachine = id;

    Viewer.showMachine(id);

    showView("machine");

};

/*==============================================================================
 Manufacturer selection
==============================================================================*/

window.selectManufacturer = function (manufacturer) {

    App.currentManufacturer = manufacturer;

    Viewer.filterManufacturer(manufacturer);

    showView("list");

};

/*==============================================================================
 New machine
==============================================================================*/

window.newMachine = function () {

    Editor.new();

    showView("editor");

};

/*==============================================================================
 Edit machine
==============================================================================*/

window.editMachine = function (id) {

    Editor.edit(id);

    showView("editor");

};

/*==============================================================================
 Save
==============================================================================*/

window.saveMachine = async function () {

    try {

        await Editor.save();

        Dashboard.render();

        Viewer.populateMachineList();

        updateStatistics();

        updateStatus("Machine saved");

    }
    catch (error) {

        console.error(error);

        alert(error.message);

    }

};

/*==============================================================================
 Delete
==============================================================================*/

window.deleteMachine = async function (id) {

    if (!confirm("Delete this machine ?"))
        return;

    await Editor.remove(id);

    Dashboard.render();

    Viewer.populateMachineList();

    showView("list");

};

/*==============================================================================
 Compare
==============================================================================*/

window.openComparison = function () {

    Compare.render();

    showView("compare");

};

/*==============================================================================
 Refresh
==============================================================================*/

window.refreshDatabase = async function () {

    updateStatus("Reloading...");

    await Database.load();

    Dashboard.render();

    Viewer.populateManufacturers();

    Viewer.populateMachineList();

    updateDatabaseVersion();

    updateStatistics();

    updateStatus("Ready");

};

/*==============================================================================
 Keyboard shortcuts
==============================================================================*/

document.addEventListener("keydown", e => {

    if (e.ctrlKey && e.key === "f") {

        e.preventDefault();

        document.getElementById("search")?.focus();

    }

    if (e.ctrlKey && e.key === "n") {

        e.preventDefault();

        newMachine();

    }

    if (e.ctrlKey && e.key === "r") {

        e.preventDefault();

        refreshDatabase();

    }

    if (e.key === "Escape") {

        showView("dashboard");

    }

});

/*==============================================================================
 Global error handler
==============================================================================*/

window.addEventListener("error", e => {

    console.error(e.error);

    updateStatus("An unexpected error occurred.");

});

/*==============================================================================
 End of file
==============================================================================*/