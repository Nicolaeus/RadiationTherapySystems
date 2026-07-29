<?php

declare(strict_types=1);

header('Content-Type: application/json');

require_once __DIR__ . '/ImageTools.php';

/* ==========================================================================
 * Configuration
 * ========================================================================== */

const MAX_UPLOAD_SIZE = 15 * 1024 * 1024;

const IMAGE_DIRECTORY =
    __DIR__ . '/../assets/images/machines/';

/* ==========================================================================
 * JSON Response
 * ========================================================================== */

function respond(
    bool $success,
    string $message,
    array $extra = []
): never
{
    echo json_encode(
        array_merge(
            [
                'success' => $success,
                'message' => $message
            ],
            $extra
        )
    );

    exit;
}

/* ==========================================================================
 * HTTP Method
 * ========================================================================== */

if ($_SERVER['REQUEST_METHOD'] !== 'POST')
{
    respond(
        false,
        'Invalid request method.'
    );
}

/* ==========================================================================
 * Machine identifier
 * ========================================================================== */

if (!isset($_POST['machine_id']))
{
    respond(
        false,
        'Missing machine identifier.'
    );
}

$machineId = strtolower(
    trim($_POST['machine_id'])
);

if (
    !preg_match(
        '/^[a-z0-9_-]{1,80}$/',
        $machineId
    )
)
{
    respond(
        false,
        'Invalid machine identifier.'
    );
}

/* ==========================================================================
 * Uploaded file
 * ========================================================================== */

if (!isset($_FILES['photo']))
{
    respond(
        false,
        'No file uploaded.'
    );
}

$file = $_FILES['photo'];

if ($file['error'] !== UPLOAD_ERR_OK)
{
    respond(
        false,
        'Upload failed.'
    );
}

if (!is_uploaded_file($file['tmp_name']))
{
    respond(
        false,
        'Invalid uploaded file.'
    );
}

if ($file['size'] > MAX_UPLOAD_SIZE)
{
    respond(
        false,
        'File too large.'
    );
}

/* ==========================================================================
 * Image validation
 * ========================================================================== */

$imageInfo = @getimagesize(
    $file['tmp_name']
);

if ($imageInfo === false)
{
    respond(
        false,
        'Invalid image.'
    );
}

$width  = $imageInfo[0];
$height = $imageInfo[1];

if (
    $width < 32 ||
    $height < 32
)
{
    respond(
        false,
        'Image too small.'
    );
}

if (
    $width > 12000 ||
    $height > 12000
)
{
    respond(
        false,
        'Image too large.'
    );
}

/* ==========================================================================
 * MIME verification
 * ========================================================================== */

$finfo = finfo_open(
    FILEINFO_MIME_TYPE
);

$mime = finfo_file(
    $finfo,
    $file['tmp_name']
);

if (
    !ImageTools::isSupported($mime)
)
{
    respond(
        false,
        'Unsupported image format.'
    );
}

if (
    $mime !== $imageInfo['mime']
)
{
    respond(
        false,
        'Image validation failed.'
    );
}

/* ==========================================================================
 * Output directory
 * ========================================================================== */

if (!is_dir(IMAGE_DIRECTORY))
{
    if (
        !mkdir(
            IMAGE_DIRECTORY,
            0755,
            true
        )
    )
    {
        respond(
            false,
            'Unable to create image directory.'
        );
    }
}

/* ==========================================================================
 * Destination
 * ========================================================================== */

$output = IMAGE_DIRECTORY .
    $machineId .
    '.webp';

/* ==========================================================================
 * Conversion
 * ========================================================================== */

$success = ImageTools::convertToWebp(
    $file['tmp_name'],
    $output
);

if (!$success)
{
    respond(
        false,
        'Image conversion failed.'
    );
}

/* ==========================================================================
 * File permissions
 * ========================================================================== */

@chmod(
    $output,
    0644
);

/* ==========================================================================
 * Success
 * ========================================================================== */

respond(
    true,
    'Image uploaded successfully.',
    [
        'filename' => basename($output),

        'url' =>
            'assets/images/machines/' .
            basename($output)
    ]
);