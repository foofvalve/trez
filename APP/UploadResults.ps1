function GenerateAuthHeaders() {

  $user = "autotest"  
  $pass = "^HCBc#mdCSgGh2}"
  
  $pair = "$($user):$($pass)"  
  $encodedCreds = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($pair))  
  $basicAuthValue = "Basic $encodedCreds"
  
  $Headers = @{
    Authorization = $basicAuthValue
  }

  return $Headers
}

$uri = "http://localhost:8529/_db/cupboard/faux_app/results"
$Header = GenerateAuthHeaders
$resultsFile = ".\results.json"
if (!(Test-Path $resultsFile)) {
    throw "Unable to find results file for upload"
}

$body = Get-Content -Raw -Path $resultsFile 
$body
$numberOfRetries = 3
for ($i=0; $i -lt $numberOfRetries; $i++) {
    try {
        $R = Invoke-RestMethod -Method POST -ContentType application/json -URI $uri -Headers $Header -Body $body   
        $R
        break
    }
    catch {      
        Write-Host "Retrying $i => StatusCode:" $_.Exception.Response.StatusCode.value__ 
        Write-Host "StatusDescription:" $_.Exception.Response.StatusDescription
        Start-Sleep -s 2      
    }
}
