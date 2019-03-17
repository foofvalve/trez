$from = "2019-03-15"
$to = "2019-03-18"
$project ="IQ"

$uri = "http://localhost:8529/_db/cupboard/faux_app/results/html?project=$project&from=$from&to=$to"
$Header = @{
    Authorization = "Basic YXV0b3Rlc3Q6XkhDQmMjbWRDU2dHaDJ9"
}

$R = Invoke-RestMethod -Method GET -ContentType application/json -URI $uri -Headers $Header 
$R

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
    $msg.Subject = "Test Automation Results" 
    $msg.Body = $R
    $SMTP.Credentials = New-Object System.Net.NetworkCredential("$email", "$pass"); 
    $smtp.Send($msg)
    Write-Host "Sended all emails"
} catch {
    Write-Error "Failed to send emails"
}