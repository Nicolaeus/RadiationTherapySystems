<?php

declare(strict_types=1);

/******************************************************************************
 * Radiotherapy Equipment Database
 * Git Repository
 *
 * This repository manages local version snapshots of the JSON database.
 * It does NOT require Git to be installed.
 ******************************************************************************/

class GitRepository
{
    private string $databaseFile;

    private string $historyDirectory;

    public function __construct(
        ?string $databaseFile = null,
        ?string $historyDirectory = null
    )
    {
        $root = dirname(__DIR__);

        $this->databaseFile = $databaseFile
            ?? $root . '/database/database.json';

        $this->historyDirectory = $historyDirectory
            ?? $root . '/database/history';

        if (!is_dir($this->historyDirectory)) {

            mkdir(
                $this->historyDirectory,
                0777,
                true
            );

        }
    }

    /**************************************************************************
     * Backup
     *************************************************************************/

    public function backup(
        string $message = ''
    ): string
    {
        $version = date('Ymd_His');

        $snapshot = [

            "version"   => $version,
            "created"   => date(DATE_ATOM),
            "message"   => $message,
            "database"  => json_decode(
                file_get_contents($this->databaseFile),
                true
            )

        ];

        $filename =

            $this->historyDirectory .

            '/' .

            $version .

            '.json';

        file_put_contents(

            $filename,

            json_encode(

                $snapshot,

                JSON_PRETTY_PRINT
                | JSON_UNESCAPED_UNICODE
                | JSON_UNESCAPED_SLASHES

            )

        );

        return $version;
    }

    /**************************************************************************
     * History
     *************************************************************************/

    public function history(): array
    {
        $files = glob(

            $this->historyDirectory .

            '/*.json'

        );

        rsort($files);

        $history = [];

        foreach ($files as $file) {

            $snapshot = json_decode(

                file_get_contents($file),

                true

            );

            $history[] = [

                "version" => $snapshot["version"],
                "created" => $snapshot["created"],
                "message" => $snapshot["message"]

            ];

        }

        return $history;
    }

    /**************************************************************************
     * Restore
     *************************************************************************/

    public function restore(
        string $version
    ): bool
    {
        $file =

            $this->historyDirectory .

            '/' .

            $version .

            '.json';

        if (!file_exists($file)) {

            return false;

        }

        $snapshot = json_decode(

            file_get_contents($file),

            true

        );

        file_put_contents(

            $this->databaseFile,

            json_encode(

                $snapshot["database"],

                JSON_PRETTY_PRINT
                | JSON_UNESCAPED_UNICODE
                | JSON_UNESCAPED_SLASHES

            )

        );

        return true;
    }

    /**************************************************************************
     * Delete Snapshot
     *************************************************************************/

    public function delete(
        string $version
    ): bool
    {
        $file =

            $this->historyDirectory .

            '/' .

            $version .

            '.json';

        if (!file_exists($file)) {

            return false;

        }

        unlink($file);

        return true;
    }

    /**************************************************************************
     * Latest
     *************************************************************************/

    public function latest(): ?array
    {
        $history = $this->history();

        return $history[0] ?? null;
    }

    /**************************************************************************
     * Exists
     *************************************************************************/

    public function exists(
        string $version
    ): bool
    {
        return file_exists(

            $this->historyDirectory .

            '/' .

            $version .

            '.json'

        );
    }

    /**************************************************************************
     * Count
     *************************************************************************/

    public function count(): int
    {
        return count(

            glob(

                $this->historyDirectory .

                '/*.json'

            )

        );
    }

    /**************************************************************************
     * Export
     *************************************************************************/

    public function export(
        string $version
    ): ?string
    {
        $file =

            $this->historyDirectory .

            '/' .

            $version .

            '.json';

        if (!file_exists($file)) {

            return null;

        }

        return file_get_contents($file);
    }

    /**************************************************************************
     * Import
     *************************************************************************/

    public function import(
        string $json
    ): bool
    {
        $snapshot = json_decode(

            $json,

            true

        );

        if (!$snapshot) {

            return false;

        }

        if (

            !isset($snapshot["version"]) ||

            !isset($snapshot["database"])

        ) {

            return false;

        }

        $file =

            $this->historyDirectory .

            '/' .

            $snapshot["version"] .

            '.json';

        file_put_contents(

            $file,

            json_encode(

                $snapshot,

                JSON_PRETTY_PRINT
                | JSON_UNESCAPED_UNICODE
                | JSON_UNESCAPED_SLASHES

            )

        );

        return true;
    }

    /**************************************************************************
     * Current Version
     *************************************************************************/

    public function currentVersion(): string
    {
        return hash_file(

            'sha256',

            $this->databaseFile

        );
    }

    /**************************************************************************
     * Has Changes
     *************************************************************************/

    public function hasChanges(): bool
    {
        $latest = $this->latest();

        if (!$latest) {

            return true;

        }

        $snapshot = json_decode(

            file_get_contents(

                $this->historyDirectory .

                '/' .

                $latest["version"] .

                '.json'

            ),

            true

        );

        return hash(

            'sha256',

            json_encode($snapshot["database"])

        )

        !==

        hash_file(

            'sha256',

            $this->databaseFile

        );
    }
}