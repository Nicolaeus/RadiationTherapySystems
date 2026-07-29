<?php

declare(strict_types=1);

/******************************************************************************
 * Radiotherapy Equipment Database
 * Machine Repository
 ******************************************************************************/

class MachineRepository
{
    private string $databaseFile;

    private array $database = [];

    public function __construct(?string $databaseFile = null)
    {
        $this->databaseFile = $databaseFile
            ?? dirname(__DIR__) . '/database/database.json';

        $this->load();
    }

    /**************************************************************************
     * Database
     *************************************************************************/

    private function load(): void
    {
        if (!file_exists($this->databaseFile)) {

            throw new RuntimeException(
                'Database not found.'
            );

        }

        $json = file_get_contents($this->databaseFile);

        $this->database = json_decode($json, true);

        if (!is_array($this->database)) {

            throw new RuntimeException(
                'Invalid database.'
            );

        }
    }

    private function save(): void
    {
        file_put_contents(

            $this->databaseFile,

            json_encode(

                $this->database,

                JSON_PRETTY_PRINT
                | JSON_UNESCAPED_UNICODE
                | JSON_UNESCAPED_SLASHES

            )

        );
    }

    /**************************************************************************
     * Database
     *************************************************************************/

    public function database(): array
    {
        return $this->database;
    }

    /**************************************************************************
     * Manufacturers
     *************************************************************************/

    public function manufacturers(): array
    {
        return $this->database["manufacturers"] ?? [];
    }

    public function manufacturer(string $id): ?array
    {
        foreach ($this->manufacturers() as $manufacturer) {

            if ($manufacturer["id"] === $id) {

                return $manufacturer;

            }

        }

        return null;
    }

    /**************************************************************************
     * Machines
     *************************************************************************/

    public function all(): array
    {
        $machines = [];

        foreach ($this->manufacturers() as $manufacturer) {

            foreach ($manufacturer["machines"] as $machine) {

                $machine["manufacturer"] = [

                    "id" => $manufacturer["id"],
                    "name" => $manufacturer["name"]

                ];

                $machines[] = $machine;

            }

        }

        return $machines;
    }

    public function count(): int
    {
        return count($this->all());
    }

    public function find(string $id): ?array
    {
        foreach ($this->manufacturers() as $manufacturer) {

            foreach ($manufacturer["machines"] as $machine) {

                if ($machine["id"] === $id) {

                    $machine["manufacturer"] = [

                        "id" => $manufacturer["id"],
                        "name" => $manufacturer["name"]

                    ];

                    return $machine;

                }

            }

        }

        return null;
    }

    /**************************************************************************
     * Search
     *************************************************************************/

    public function search(string $query): array
    {
        $query = mb_strtolower($query);

        return array_values(

            array_filter(

                $this->all(),

                function ($machine) use ($query) {

                    return str_contains(

                        mb_strtolower(

                            json_encode($machine)

                        ),

                        $query

                    );

                }

            )

        );
    }

    /**************************************************************************
     * Filters
     *************************************************************************/

    public function byManufacturer(string $manufacturerId): array
    {
        $manufacturer = $this->manufacturer($manufacturerId);

        if (!$manufacturer) {

            return [];

        }

        return $manufacturer["machines"];
    }

    public function byTechnology(string $technology): array
    {
        return array_values(

            array_filter(

                $this->all(),

                fn($machine)

                => ($machine["technology"] ?? null)

                === $technology

            )

        );
    }

    public function byCountry(string $country): array
    {
        return array_values(

            array_filter(

                $this->all(),

                fn($machine)

                => ($machine["country"] ?? null)

                === $country

            )

        );
    }

    /**************************************************************************
     * CRUD
     *************************************************************************/

    public function create(
        string $manufacturerId,
        array $machine
    ): bool
    {
        foreach ($this->database["manufacturers"] as &$manufacturer) {

            if ($manufacturer["id"] !== $manufacturerId) {

                continue;

            }

            $manufacturer["machines"][] = $machine;

            $this->save();

            return true;

        }

        return false;
    }

    public function update(
        string $id,
        array $machine
    ): bool
    {
        foreach ($this->database["manufacturers"] as &$manufacturer) {

            foreach ($manufacturer["machines"] as $index => $current) {

                if ($current["id"] !== $id) {

                    continue;

                }

                $manufacturer["machines"][$index] = $machine;

                $this->save();

                return true;

            }

        }

        return false;
    }

    public function delete(string $id): bool
    {
        foreach ($this->database["manufacturers"] as &$manufacturer) {

            foreach ($manufacturer["machines"] as $index => $machine) {

                if ($machine["id"] !== $id) {

                    continue;

                }

                array_splice(

                    $manufacturer["machines"],

                    $index,

                    1

                );

                $this->save();

                return true;

            }

        }

        return false;
    }

    /**************************************************************************
     * Statistics
     *************************************************************************/

    public function statistics(): array
    {
        $machines = $this->all();

        return [

            "manufacturers" => count(
                $this->manufacturers()
            ),

            "machines" => count(
                $machines
            ),

            "countries" => count(

                array_unique(

                    array_filter(

                        array_column(
                            $machines,
                            "country"
                        )

                    )

                )

            ),

            "technologies" => count(

                array_unique(

                    array_filter(

                        array_column(
                            $machines,
                            "technology"
                        )

                    )

                )

            )

        ];
    }

    /**************************************************************************
     * Lists
     *************************************************************************/

    public function technologies(): array
    {
        $values = array_column(

            $this->all(),

            "technology"

        );

        $values = array_filter($values);

        sort($values);

        return array_values(

            array_unique($values)

        );
    }

    public function countries(): array
    {
        $values = array_column(

            $this->all(),

            "country"

        );

        $values = array_filter($values);

        sort($values);

        return array_values(

            array_unique($values)

        );
    }
}