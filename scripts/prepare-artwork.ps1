$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$projectRoot = Split-Path -Parent $PSScriptRoot
$sourceDirectory = Join-Path $projectRoot 'artwork/originals'
$outputDirectory = Join-Path $projectRoot 'public/artwork'
New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$manifest = @()
foreach ($name in @('industry', 'finance', 'networks', 'vietnam')) {
    $source = [System.Drawing.Image]::FromFile((Join-Path $sourceDirectory "$name.png"))
    try {
        foreach ($variant in @(@{ Suffix = ''; MaxWidth = 1280 }, @{ Suffix = '-small'; MaxWidth = 640 })) {
            $width = [Math]::Min($source.Width, $variant.MaxWidth)
            $height = [int][Math]::Round($source.Height * $width / $source.Width)
            $bitmap = [System.Drawing.Bitmap]::new($width, $height)
            $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
            $encoderParameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
            try {
                $graphics.Clear([System.Drawing.Color]::FromArgb(248, 245, 239))
                $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
                $graphics.DrawImage($source, 0, 0, $width, $height)
                $encoderParameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [long]88)
                $filename = "$name$($variant.Suffix).jpg"
                $output = Join-Path $outputDirectory $filename
                $bitmap.Save($output, $jpegCodec, $encoderParameters)
                $manifest += [PSCustomObject]@{ file = "public/artwork/$filename"; width = $width; height = $height; bytes = (Get-Item -LiteralPath $output).Length }
            } finally {
                $encoderParameters.Dispose()
                $graphics.Dispose()
                $bitmap.Dispose()
            }
        }
    } finally { $source.Dispose() }
}
$manifest | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $projectRoot 'docs/artwork-manifest.json') -Encoding UTF8
$manifest | Format-Table -AutoSize
