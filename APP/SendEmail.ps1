
Function Scrape-BuildInfo($envCode) {    
    $indexFileContents = Get-Content "C:\$envCode\webroot\dist\index.html"
    $buildId = ([regex]'name="buildId" content="(\d+)"').match($indexFileContents).groups[1].value
    $buildNumber = ([regex]'name="buildNumber" content=\"(.*?)\">').match($indexFileContents).groups[1].value
    $buildNumber  + "_" + $buildId
}


$envCode = "iq_onprem1"
$from = "2019-03-27"
$to = "2019-03-28"

$build = Scrape-BuildInfo $envCode

$uri = "http://127.0.0.1:8529/_db/cupboard/faux_app/results/html?project=IQ&from=$from&to=$to&build=$build"
$Header = @{
    Authorization = "Basic YXV0b3Rlc3Q6XkhDQmMjbWRDU2dHaDJ9"
}

try {
  $R = Invoke-RestMethod -Method GET -ContentType application/json -URI $uri -Headers $Header 
  $R
} catch {  
  Write-Error "GET failed on $uri" 
  Exit 1
}

if($R -eq 'No Results') {
  Write-Error "Returned no results => $uri" 
  Exit 1
}

$email = "autotest.rightcrowd@gmail.com"  
$pass = "1qa!QA1qa"  
$smtpServer = "smtp.gmail.com" 
 
try {
    $msg = new-object Net.Mail.MailMessage 
    $smtp = new-object Net.Mail.SmtpClient($smtpServer) 
    $smtp.EnableSsl = $true 
    $msg.From = "$email"  
    $msg.To.Add("ryanrosello@hotmail.com,ryan.rosello@rightcrowd.com") 
    $msg.BodyEncoding = [system.Text.Encoding]::Unicode 
    $msg.SubjectEncoding = [system.Text.Encoding]::Unicode 
    $msg.IsBodyHTML = $true  
    $msg.Subject = "Test Automation Results - $build" 
    $msg.Body = $R
    $SMTP.Credentials = New-Object System.Net.NetworkCredential("$email", "$pass"); 
    $smtp.Send($msg)
    Write-Host "Sended all emails"
} catch {
    Write-Error "Failed to send emails"
}
