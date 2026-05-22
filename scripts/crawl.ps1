$ErrorActionPreference = 'SilentlyContinue'
$Base = 'https://coding-alive.jp'
$UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
$CacheDir = Join-Path $PSScriptRoot 'cache'
New-Item -ItemType Directory -Force -Path $CacheDir | Out-Null

$visited = @{}
$queue = @("$Base/")
$pages = @{}

function Normalize-Url($u) {
  try {
    $parsed = [Uri]$u
    if ($parsed.Host -ne 'coding-alive.jp') { return $null }
    $path = $parsed.AbsolutePath
    if ($path -match '\.(pdf|jpg|jpeg|png|gif|svg|webp|mp4|zip|css|js|woff2?|ttf|ico)$') { return $null }
    if ($path -match '/wp-content|/assets/|/wp-admin') { return $null }
    return "$($parsed.Scheme)://$($parsed.Host)$path"
  } catch { return $null }
}

function Get-PageType($path) {
  if ($path -eq '/' -or $path -eq '') { return @{ type='home'; parent='/'; template='home' } }
  if ($path -eq '/work/') { return @{ type='archive'; parent='/'; template='work-archive' } }
  if ($path -match '^/work/p\d+/?$') { return @{ type='detail'; parent='/work/'; template='work-detail' } }
  if ($path -match '^/work/') { return @{ type='category'; parent='/work/'; template='work-category' } }
  if ($path -eq '/animation/') { return @{ type='archive'; parent='/'; template='animation-archive' } }
  if ($path -match '^/animation/p\d+/?$') { return @{ type='detail'; parent='/animation/'; template='animation-detail' } }
  if ($path -match '^/animation/') { return @{ type='category'; parent='/animation/'; template='animation-category' } }
  if ($path -eq '/blog/') { return @{ type='archive'; parent='/'; template='blog-archive' } }
  if ($path -match '^/blog/p\d+/?$') { return @{ type='detail'; parent='/blog/'; template='blog-detail' } }
  if ($path -match '^/blogcat/') { return @{ type='category'; parent='/blog/'; template='blog-category' } }
  $static = @{
    '/our-strength/' = 'our-strength'
    '/services/' = 'services'
    '/fee/' = 'fee'
    '/faq/' = 'faq'
    '/staff/' = 'staff'
    '/company/' = 'company'
    '/contact/' = 'contact'
    '/privacy/' = 'privacy'
  }
  foreach ($k in $static.Keys) {
    if ($path -eq $k) { return @{ type='static'; parent='/'; template=$static[$k] } }
  }
  return @{ type='static'; parent='/'; template='static-page' }
}

$count = 0
while ($queue.Count -gt 0 -and $count -lt 350) {
  $url = $queue[0]
  $queue = $queue[1..($queue.Length-1)]
  $key = Normalize-Url $url
  if (-not $key -or $visited.ContainsKey($key)) { continue }
  $visited[$key] = $true
  $count++

  $safe = ($key -replace '[^a-zA-Z0-9]', '_').Substring(0, [Math]::Min(80, ($key -replace '[^a-zA-Z0-9]', '_').Length))
  $file = Join-Path $CacheDir "$safe.html"
  $null = curl.exe -sL -A $UA $key -o $file -w "%{http_code}" 2>$null
  if (-not (Test-Path $file) -or (Get-Item $file).Length -lt 500) {
    Write-Host "SKIP $key"
    continue
  }
  $html = Get-Content $file -Raw -Encoding UTF8
  $title = ''
  if ($html -match '<title[^>]*>([^<]+)</title>') { $title = $matches[1].Trim() }
  $pages[$key] = $title
  Write-Host "OK $count $key"

  $matches = [regex]::Matches($html, 'href="(https://coding-alive\.jp[^"#]+)"')
  foreach ($m in $matches) {
    $n = Normalize-Url $m.Groups[1].Value
    if ($n -and -not $visited.ContainsKey($n) -and $queue -notcontains $n) {
      $queue += $n
    }
  }
  Start-Sleep -Milliseconds 300
}

$manifest = @()
foreach ($url in ($pages.Keys | Sort-Object)) {
  $path = ([Uri]$url).AbsolutePath
  $local = if ($path -eq '/') { '/' } elseif ($path.EndsWith('/')) { $path.TrimEnd('/') } else { $path }
  $meta = Get-PageType $path
  $manifest += [PSCustomObject]@{
    source_url = $url
    local_route = $local
    page_title = $pages[$url]
    page_type = $meta.type
    parent_page = $meta.parent
    template_used = $meta.template
  }
}

$manifest | ConvertTo-Json -Depth 5 | Set-Content (Join-Path $PSScriptRoot 'route-manifest.json') -Encoding UTF8
Write-Host "`n=== TOTAL: $($manifest.Count) ==="
