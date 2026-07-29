<?php

declare(strict_types=1);

/******************************************************************************
 * Radiotherapy Equipment Database
 * JSON Validator
 ******************************************************************************/

class JsonValidator
{
    private array $errors = [];

    /**************************************************************************
     * Public API
     *************************************************************************/

    public function validate(
        array $data,
        array $schema
    ): bool
    {
        $this->errors = [];

        $this->validateNode(
            $data,
            $schema,
            '$'
        );

        return empty($this->errors);
    }

    public function errors(): array
    {
        return $this->errors;
    }

    /**************************************************************************
     * Recursive validation
     *************************************************************************/

    private function validateNode(
        mixed $value,
        array $schema,
        string $path
    ): void
    {
        $type = $schema["type"] ?? null;

        switch ($type) {

            case "object":

                $this->validateObject(
                    $value,
                    $schema,
                    $path
                );

                break;

            case "array":

                $this->validateArray(
                    $value,
                    $schema,
                    $path
                );

                break;

            case "string":

                $this->validateString(
                    $value,
                    $schema,
                    $path
                );

                break;

            case "integer":

                $this->validateInteger(
                    $value,
                    $schema,
                    $path
                );

                break;

            case "number":

                $this->validateNumber(
                    $value,
                    $schema,
                    $path
                );

                break;

            case "boolean":

                $this->validateBoolean(
                    $value,
                    $schema,
                    $path
                );

                break;

        }

    }

    /**************************************************************************
     * Object
     *************************************************************************/

    private function validateObject(
        mixed $value,
        array $schema,
        string $path
    ): void
    {
        if (!is_array($value)) {

            $this->error(
                $path,
                "Expected object."
            );

            return;
        }

        $required =

            $schema["required"] ?? [];

        foreach ($required as $field) {

            if (!array_key_exists($field, $value)) {

                $this->error(

                    $path . "." . $field,

                    "Missing required field."

                );

            }

        }

        $properties =

            $schema["properties"] ?? [];

        foreach ($properties as $name => $propertySchema) {

            if (!array_key_exists($name, $value)) {

                continue;

            }

            $this->validateNode(

                $value[$name],

                $propertySchema,

                $path . "." . $name

            );

        }
    }

    /**************************************************************************
     * Array
     *************************************************************************/

    private function validateArray(
        mixed $value,
        array $schema,
        string $path
    ): void
    {
        if (!is_array($value)) {

            $this->error(
                $path,
                "Expected array."
            );

            return;
        }

        if (

            isset($schema["minItems"])

            &&

            count($value) < $schema["minItems"]

        ) {

            $this->error(

                $path,

                "Minimum items: " .

                $schema["minItems"]

            );

        }

        if (

            isset($schema["maxItems"])

            &&

            count($value) > $schema["maxItems"]

        ) {

            $this->error(

                $path,

                "Maximum items: " .

                $schema["maxItems"]

            );

        }

        if (!isset($schema["items"])) {

            return;

        }

        foreach ($value as $index => $item) {

            $this->validateNode(

                $item,

                $schema["items"],

                $path . "[" . $index . "]"

            );

        }
    }

    /**************************************************************************
     * String
     *************************************************************************/

    private function validateString(
        mixed $value,
        array $schema,
        string $path
    ): void
    {
        if (!is_string($value)) {

            $this->error(
                $path,
                "Expected string."
            );

            return;
        }

        if (

            isset($schema["minLength"])

            &&

            mb_strlen($value)

            <

            $schema["minLength"]

        ) {

            $this->error(

                $path,

                "Minimum length: "

                .

                $schema["minLength"]

            );

        }

        if (

            isset($schema["maxLength"])

            &&

            mb_strlen($value)

            >

            $schema["maxLength"]

        ) {

            $this->error(

                $path,

                "Maximum length: "

                .

                $schema["maxLength"]

            );

        }

        if (

            isset($schema["enum"])

            &&

            !in_array(

                $value,

                $schema["enum"],

                true

            )

        ) {

            $this->error(

                $path,

                "Invalid value."

            );

        }

        if (

            isset($schema["pattern"])

            &&

            !preg_match(

                "/" .

                $schema["pattern"]

                . "/",

                $value

            )

        ) {

            $this->error(

                $path,

                "Pattern mismatch."

            );

        }
    }

    /**************************************************************************
     * Integer
     *************************************************************************/

    private function validateInteger(
        mixed $value,
        array $schema,
        string $path
    ): void
    {
        if (!is_int($value)) {

            $this->error(
                $path,
                "Expected integer."
            );

            return;
        }

        if (

            isset($schema["minimum"])

            &&

            $value < $schema["minimum"]

        ) {

            $this->error(

                $path,

                "Minimum value: "

                .

                $schema["minimum"]

            );

        }

        if (

            isset($schema["maximum"])

            &&

            $value > $schema["maximum"]

        ) {

            $this->error(

                $path,

                "Maximum value: "

                .

                $schema["maximum"]

            );

        }
    }

    /**************************************************************************
     * Number
     *************************************************************************/

    private function validateNumber(
        mixed $value,
        array $schema,
        string $path
    ): void
    {
        if (!is_numeric($value)) {

            $this->error(
                $path,
                "Expected number."
            );

            return;
        }

        $value = (float)$value;

        if (

            isset($schema["minimum"])

            &&

            $value < $schema["minimum"]

        ) {

            $this->error(

                $path,

                "Minimum value: "

                .

                $schema["minimum"]

            );

        }

        if (

            isset($schema["maximum"])

            &&

            $value > $schema["maximum"]

        ) {

            $this->error(

                $path,

                "Maximum value: "

                .

                $schema["maximum"]

            );

        }
    }

    /**************************************************************************
     * Boolean
     *************************************************************************/

    private function validateBoolean(
        mixed $value,
        array $schema,
        string $path
    ): void
    {
        if (!is_bool($value)) {

            $this->error(
                $path,
                "Expected boolean."
            );

        }
    }

    /**************************************************************************
     * Error
     *************************************************************************/

    private function error(
        string $path,
        string $message
    ): void
    {
        $this->errors[] = [

            "path" => $path,

            "message" => $message

        ];
    }
}