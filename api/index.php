<?php
/******************************************************************************
 * Radiotherapy Equipment Database
 * REST API
 *
 * Author : N N
 ******************************************************************************/

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

/******************************************************************************
 * Configuration
 ******************************************************************************/

define('DATABASE_PATH', dirname(__DIR__) . '/database/database.json');

/******************************************************************************
 * Helpers
 ******************************************************************************/

function jsonResponse(mixed $data, int $status = 200): never
{
    http_response_code($status);

    echo json_encode(
        $data,
        JSON_PRETTY_PRINT |
        JSON_UNESCAPED_UNICODE |
        JSON_UNESCAPED_SLASHES
    );

    exit;
}

function loadDatabase(): array
{
    if (!file_exists(DATABASE_PATH)) {

        jsonResponse([
            'success' => false,
            'message' => 'Database not found.'
        ], 500);

    }

    $json = file_get_contents(DATABASE_PATH);

    return json_decode($json, true);
}

function saveDatabase(array $database): void
{
    file_put_contents(
        DATABASE_PATH,
        json_encode(
            $database,
            JSON_PRETTY_PRINT |
            JSON_UNESCAPED_UNICODE |
            JSON_UNESCAPED_SLASHES
        )
    );
}

function requestBody(): array
{
    $body = file_get_contents("php://input");

    if ($body === '')
        return [];

    return json_decode($body, true) ?? [];
}

function machineIndex(array &$database, string $id): ?array
{
    foreach ($database["manufacturers"] as $mIndex => $manufacturer) {

        foreach ($manufacturer["machines"] as $machineIndex => $machine) {

            if ($machine["id"] === $id) {

                return [

                    "manufacturer" => $mIndex,

                    "machine" => $machineIndex

                ];

            }

        }

    }

    return null;
}

/******************************************************************************
 * Router
 ******************************************************************************/

$method = $_SERVER["REQUEST_METHOD"];

$path = trim(

    parse_url(

        $_SERVER["REQUEST_URI"],

        PHP_URL_PATH

    ),

    "/"

);

$parts = explode("/", $path);

$route = end($parts);

/******************************************************************************
 * GET
 ******************************************************************************/

if ($method === "GET") {

    $database = loadDatabase();

    switch ($route) {

        case "database":

            jsonResponse($database);

        case "manufacturers":

            jsonResponse($database["manufacturers"]);

        case "machines":

            $machines = [];

            foreach ($database["manufacturers"] as $manufacturer) {

                foreach ($manufacturer["machines"] as $machine) {

                    $machine["manufacturer"] = $manufacturer["name"];

                    $machines[] = $machine;

                }

            }

            jsonResponse($machines);

        default:

            if (isset($_GET["id"])) {

                $id = $_GET["id"];

                foreach ($database["manufacturers"] as $manufacturer) {

                    foreach ($manufacturer["machines"] as $machine) {

                        if ($machine["id"] === $id) {

                            $machine["manufacturer"] =

                                $manufacturer["name"];

                            jsonResponse($machine);

                        }

                    }

                }

            }

            jsonResponse([
                "success" => false,
                "message" => "Unknown endpoint."
            ],404);

    }

}

/******************************************************************************
 * POST
 ******************************************************************************/

if ($method === "POST") {

    $database = loadDatabase();

    $body = requestBody();

    if (

        empty($body["manufacturer"]) ||

        empty($body["machine"])

    ) {

        jsonResponse([
            "success"=>false,
            "message"=>"Invalid payload."
        ],400);

    }

    foreach ($database["manufacturers"] as &$manufacturer) {

        if ($manufacturer["id"] === $body["manufacturer"]) {

            $manufacturer["machines"][] =

                $body["machine"];

            saveDatabase($database);

            jsonResponse([

                "success"=>true

            ]);

        }

    }

    jsonResponse([
        "success"=>false,
        "message"=>"Manufacturer not found."
    ],404);

}

/******************************************************************************
 * PUT
 ******************************************************************************/

if ($method === "PUT") {

    $database = loadDatabase();

    $body = requestBody();

    if (empty($body["id"])) {

        jsonResponse([
            "success"=>false,
            "message"=>"Missing id."
        ],400);

    }

    $index = machineIndex(

        $database,

        $body["id"]

    );

    if (!$index) {

        jsonResponse([
            "success"=>false,
            "message"=>"Machine not found."
        ],404);

    }

    $database["manufacturers"]

        [

            $index["manufacturer"]

        ]

        [

            "machines"

        ]

        [

            $index["machine"]

        ] = $body;

    saveDatabase($database);

    jsonResponse([

        "success"=>true

    ]);

}

/******************************************************************************
 * DELETE
 ******************************************************************************/

if ($method === "DELETE") {

    $database = loadDatabase();

    $id = $_GET["id"] ?? null;

    if (!$id) {

        jsonResponse([
            "success"=>false,
            "message"=>"Missing id."
        ],400);

    }

    $index = machineIndex(

        $database,

        $id

    );

    if (!$index) {

        jsonResponse([
            "success"=>false,
            "message"=>"Machine not found."
        ],404);

    }

    array_splice(

        $database["manufacturers"]

            [

                $index["manufacturer"]

            ]

            [

                "machines"

            ],

        $index["machine"],

        1

    );

    saveDatabase($database);

    jsonResponse([

        "success"=>true

    ]);

}

/******************************************************************************
 * Unsupported
 ******************************************************************************/

jsonResponse([

    "success"=>false,

    "message"=>"Unsupported HTTP method."

],405);