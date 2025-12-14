# Optimize-Images.ps1
# This script optimizes images while preserving their original orientation

# Configuration
$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$sourceDir = Join-Path $baseDir "assets\images\gallery"
$outputDir = Join-Path $baseDir "assets\images_optimized"
$quality = 85
$maxWidth = 2000
$maxHeight = 2000

# Load required assembly
Add-Type -AssemblyName System.Drawing

# Function to optimize image
function Optimize-Image {
    param($sourcePath, $destPath)
    
    try {
        # Create output directory if it doesn't exist
        $destDir = [System.IO.Path]::GetDirectoryName($destPath)
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        
        # Load the original image
        $img = [System.Drawing.Image]::FromFile($sourcePath)
        $originalSize = (Get-Item $sourcePath).Length
        
        try {
            # Calculate new dimensions
            $ratio = [Math]::Min($maxWidth / $img.Width, $maxHeight / $img.Height)
            $newWidth = [int]($img.Width * $ratio)
            $newHeight = [int]($img.Height * $ratio)
            
            # Create new bitmap with the new dimensions
            $bmp = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
            $graphics = [System.Drawing.Graphics]::FromImage($bmp)
            
            # Configure graphics for high quality
            $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
            
            # Draw the image with the new dimensions
            $graphics.DrawImage($img, 0, 0, $newWidth, $newHeight)
            
            # Set up JPEG encoder with quality parameter
            $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | 
                Where-Object { $_.MimeType -eq 'image/jpeg' }
            $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
            $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
                [System.Drawing.Imaging.Encoder]::Quality, 
                [int]$quality
            )
            
            # Save the optimized image
            $bmp.Save($destPath, $jpegCodec, $encoderParams)
            
            # Return results
            $newSize = (Get-Item $destPath).Length
            return @{
                Status = 'Success'
                OriginalSize = $originalSize
                NewSize = $newSize
                Saved = $originalSize - $newSize
                SavedPercent = [Math]::Round((1 - ($newSize / $originalSize)) * 100, 2)
            }
        }
        finally {
            # Clean up resources
            if ($graphics) { $graphics.Dispose() }
            if ($bmp) { $bmp.Dispose() }
            $img.Dispose()
        }
    }
    catch {
        return @{
            Status = 'Error'
            Message = $_.Exception.Message
        }
    }
}

# Main execution
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

$imageFiles = Get-ChildItem -Path $sourceDir -Recurse -Include *.jpg, *.jpeg, *.png
$totalOriginal = 0
$totalNew = 0
$processedCount = 0

Write-Host "Starting image optimization (preserving orientation)..." -ForegroundColor Cyan
Write-Host "Source: $sourceDir" -ForegroundColor White
Write-Host "Output: $outputDir" -ForegroundColor White
Write-Host "-" * 50

foreach ($file in $imageFiles) {
    $relativePath = $file.FullName.Substring($sourceDir.Length).TrimStart('\')
    $outputPath = Join-Path $outputDir $relativePath
    $outputPath = [System.IO.Path]::ChangeExtension($outputPath, '.jpg')
    
    Write-Host "Processing: $relativePath" -ForegroundColor Yellow
    $result = Optimize-Image -sourcePath $file.FullName -destPath $outputPath
    
    if ($result.Status -eq 'Success') {
        $totalOriginal += $result.OriginalSize
        $totalNew += $result.NewSize
        $processedCount++
        
        Write-Host "  Original: $([math]::Round($result.OriginalSize/1KB, 1)) KB" -ForegroundColor Gray
        Write-Host "  New: $([math]::Round($result.NewSize/1KB, 1)) KB" -ForegroundColor Green
        Write-Host "  Saved: $([math]::Round($result.Saved/1KB, 1)) KB ($($result.SavedPercent)%)" -ForegroundColor Green
    }
    else {
        Write-Host "  Error: $($result.Message)" -ForegroundColor Red
    }
}

# Display summary
Write-Host "`nOptimization complete!" -ForegroundColor Cyan
Write-Host "-" * 50
Write-Host "Processed: $processedCount images" -ForegroundColor White
Write-Host "Original size: $([math]::Round($totalOriginal/1MB, 2)) MB" -ForegroundColor Gray
Write-Host "New size: $([math]::Round($totalNew/1MB, 2)) MB" -ForegroundColor Green
Write-Host "Space saved: $([math]::Round(($totalOriginal - $totalNew)/1MB, 2)) MB ($([math]::Round((1 - ($totalNew / $totalOriginal)) * 100, 2))%)" -ForegroundColor Green

# Instructions
Write-Host "`nTo complete the process:" -ForegroundColor Yellow
Write-Host "1. Backup originals:"
Write-Host "   Rename-Item -Path 'assets\images' -NewName 'assets\images_backup' -Force"
Write-Host "2. Replace with optimized:"
Write-Host "   Rename-Item -Path 'assets\images_optimized' -NewName 'assets\images' -Force"