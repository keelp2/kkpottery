<?php
header('Content-Type: application/json');

$imageDir = __DIR__ . '/assets/images/gallery/';
$featuredDir = $imageDir . 'featured/';
$images = [];

// Function to scan directory and get image files
function getImagesFromDir($dir, $type = 'regular') {
    $files = [];
    if (is_dir($dir)) {
        foreach (scandir($dir) as $file) {
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif'])) {
                $files[] = [
                    'src' => ($type === 'featured' ? 'featured/' : '') . $file,
                    'type' => $type
                ];
            }
        }
    }
    return $files;
}

// Get regular and featured images
$images = array_merge(
    getImagesFromDir($imageDir, 'regular'),
    getImagesFromDir($featuredDir, 'featured')
);

// Shuffle and return
shuffle($images);
echo json_encode($images);
?>
