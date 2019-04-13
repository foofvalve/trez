$MyDashboard = New-UDDashboard -Title "Hello, World" -Content {
    New-UDCard -Title "Hello, Yo! Universal Dashboard" 
    New-UDLayout -Columns 3 -Content {  
        New-UDHtml -Markup "<h1>Hi, there!</h1>"
        New-UDButton -Text "Click me!" -OnClick {
            Show-UDToast -Message "Clicked!"
        }

        New-UDChart -Type Bar -Endpoint {
            Get-CimInstance -ClassName Win32_LogicalDisk | ForEach-Object {
                [PSCustomObject]@{ DeviceId = $_.DeviceID;
                              Size = [Math]::Round($_.Size / 1GB, 2);
                              FreeSpace = [Math]::Round($_.FreeSpace / 1GB, 2); } } | Out-UDChartData -LabelProperty "DeviceID" -Dataset @(
             New-UdChartDataset -DataProperty "Size" -Label "Size" -BackgroundColor "#80962F23" -HoverBackgroundColor "#80962F23"
             New-UdChartDataset -DataProperty "FreeSpace" -Label "Free Space" -BackgroundColor "#8014558C" -HoverBackgroundColor "#8014558C"
         )
        } -Labels @("Process Memory") -Options @{
            scales = @{
                xAxes = @(
                    @{
                        stacked = $true
                    }
                )
                yAxes = @(
                    @{
                        stacked = $true
                    }
                )
            }
        }
    }
    New-UDLayout -Columns 2 -Content {  
        New-UDMonitor -Title "Downloads per second" -Type Line -Endpoint {
         Get-Random -Minimum 0 -Maximum 10 | Out-UDMonitorData
        }
    
        New-UdGrid -Title "Processes" -Headers @("testsuite", "outcome", "count") -Properties @("testsuite", "outcome", "count") -AutoRefresh -RefreshInterval 60 -Endpoint {
           
            $from = "2019-03-15"
            $to = "2019-03-16"


            $uri = "http://127.0.0.1:8529/_db/cupboard/faux_app/results?project=IQ&from=$from&to=$to"
            $Header = @{
                Authorization = "Basic YXV0b3Rlc3Q6XkhDQmMjbWRDU2dHaDJ9"
            }

            $R = Invoke-RestMethod -Method GET -ContentType application/json -URI $uri -Headers $Header 
            $R.suite_summary | Out-UDGridData
            #Get-Process | Select Name,ID,WorkingSet,CPU | Out-UDGridData
        }
    }
    New-UdMonitor -Title "CPU (% processor time)" -Type Line -DataPointHistory 20 -RefreshInterval 5 -ChartBackgroundColor '#80FF6B63' -ChartBorderColor '#FFFF6B63'  -Endpoint {
     Get-Counter '\Processor(_Total)\% Processor Time' -ErrorAction SilentlyContinue | Select-Object -ExpandProperty CounterSamples | Select-Object -ExpandProperty CookedValue | Out-UDMonitorData
    }

    New-UDCounter -Title "Basic" -Endpoint {
        1
    }
}


Start-UDDashboard -Port 1000 -Dashboard $MyDashboard -AutoReload