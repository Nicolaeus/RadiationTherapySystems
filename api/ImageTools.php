<?php

declare(strict_types=1);

/**
 * ============================================================================
 * ImageTools
 * ----------------------------------------------------------------------------
 * Generic image processing utilities.
 *
 * Features
 * --------
 * - JPEG / PNG / WEBP
 * - EXIF orientation correction
 * - Aspect ratio preservation
 * - High quality resize
 * - WEBP conversion
 * - Transparency support
 * - Memory protection
 * ============================================================================
 */

final class ImageTools
{

    /*
    |--------------------------------------------------------------------------
    | Configuration
    |--------------------------------------------------------------------------
    */

    public const MAX_WIDTH  = 1024;

    public const MAX_HEIGHT = 768;

    public const QUALITY = 90;

    public const MAX_PIXELS = 50_000_000;

    private const ALLOWED_MIME = [

        'image/jpeg',

        'image/png',

        'image/webp'

    ];

    /*
    |--------------------------------------------------------------------------
    | Public API
    |--------------------------------------------------------------------------
    */

    public static function isSupported(string $mime): bool
    {
        return in_array(
            $mime,
            self::ALLOWED_MIME,
            true
        );
    }

    /**
     * Convert any supported image into WEBP.
     */
    public static function convertToWebp(
        string $input,
        string $output
    ): bool
    {

        $info = @getimagesize($input);

        if ($info === false)
            return false;

        $width  = $info[0];
        $height = $info[1];
        $mime   = $info['mime'];

        if (!self::isSupported($mime))
            return false;

        if ($width <= 0 || $height <= 0)
            return false;

        if (($width * $height) > self::MAX_PIXELS)
            return false;

        if (!self::checkMemory($width, $height))
            return false;

        $image = self::createImage(
            $input,
            $mime
        );

        if (!$image)
            return false;

        $image = self::fixOrientation(
            $image,
            $input,
            $mime
        );

        $resized = self::resize($image);

        if (!$resized)
            return false;

        $success = imagewebp(
            $resized,
            $output,
            self::QUALITY
        );

        return $success;

    }

    /*
    |--------------------------------------------------------------------------
    | Image loading
    |--------------------------------------------------------------------------
    */

    private static function createImage(
        string $filename,
        string $mime
    )
    {

        return match ($mime) {

            'image/jpeg' => @imagecreatefromjpeg($filename),

            'image/png'  => @imagecreatefrompng($filename),

            'image/webp' => @imagecreatefromwebp($filename),

            default => false

        };

    }

    /*
    |--------------------------------------------------------------------------
    | EXIF
    |--------------------------------------------------------------------------
    */

    private static function fixOrientation(
        $image,
        string $filename,
        string $mime
    )
    {

        if (
            $mime !== 'image/jpeg' ||
            !function_exists('exif_read_data')
        ) {
            return $image;
        }

        $exif = @exif_read_data($filename);

        if (!$exif)
            return $image;

        if (!isset($exif['Orientation']))
            return $image;

        switch ($exif['Orientation']) {

            case 3:
                $image = imagerotate($image, 180, 0);
                break;

            case 6:
                $image = imagerotate($image, -90, 0);
                break;

            case 8:
                $image = imagerotate($image, 90, 0);
                break;

        }

        return $image;

    }

    /*
    |--------------------------------------------------------------------------
    | Resize
    |--------------------------------------------------------------------------
    */

    private static function resize($source)
    {

        $width  = imagesx($source);
        $height = imagesy($source);

        $ratio = min(

            self::MAX_WIDTH / $width,

            self::MAX_HEIGHT / $height,

            1

        );

        $newWidth  = (int) round($width * $ratio);
        $newHeight = (int) round($height * $ratio);

        $destination = imagecreatetruecolor(
            $newWidth,
            $newHeight
        );

        imagealphablending(
            $destination,
            false
        );

        imagesavealpha(
            $destination,
            true
        );

        $transparent = imagecolorallocatealpha(
            $destination,
            0,
            0,
            0,
            127
        );

        imagefill(
            $destination,
            0,
            0,
            $transparent
        );

        imagecopyresampled(

            $destination,

            $source,

            0,
            0,

            0,
            0,

            $newWidth,

            $newHeight,

            $width,

            $height

        );

        return $destination;

    }

    /*
    |--------------------------------------------------------------------------
    | Memory protection
    |--------------------------------------------------------------------------
    */

    private static function checkMemory(
        int $width,
        int $height
    ): bool
    {

        $estimated =
            ($width * $height * 4) * 2;

        $limit = ini_get('memory_limit');

        if ($limit === '-1')
            return true;

        $bytes = self::convertToBytes($limit);

        return $estimated < ($bytes * 0.70);

    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    private static function convertToBytes(
        string $value
    ): int
    {

        $value = trim($value);

        $unit = strtolower(
            substr($value, -1)
        );

        $number = (int) $value;

        return match ($unit) {

            'g' => $number * 1024 * 1024 * 1024,

            'm' => $number * 1024 * 1024,

            'k' => $number * 1024,

            default => $number

        };

    }

}